import { NextRequest, NextResponse } from "next/server";

type VlmRequestBody = {
  caseId?: string;
  caseType?: string;
  location?: string;
  confidence?: number;
  riskLevel?: string;
  imageUrl?: string;
  videoUrl?: string;
  sensorSummary?: string;
};

function fallbackVlmSummary(body: VlmRequestBody) {
  const caseType = body.caseType ?? "Possible emergency";
  const riskLevel = body.riskLevel ?? "Unknown";
  const confidence = body.confidence ?? 0;

  return {
    visualSummary:
      `${caseType} visual verification is currently running in fallback mode. ` +
      `Sensor confidence is ${confidence}% with ${riskLevel} risk level.`,
    source: "Fallback",
    model: "mock-vlm-fallback",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VlmRequestBody;

    const vlmApiUrl = process.env.VLM_API_URL;
    const vlmApiKey = process.env.VLM_API_KEY || process.env.NIM_API_KEY || "local";
    const vlmModel = process.env.VLM_MODEL || "nvidia/cosmos3-nano-reasoner";

    // Demo image is used when dashboard does not send real camera image/video yet
    const demoMediaUrl = process.env.VLM_DEMO_IMAGE_URL;
    const mediaUrl = body.imageUrl || body.videoUrl || demoMediaUrl;

    const mediaType =
      body.videoUrl && !body.imageUrl && !demoMediaUrl ? "video_url" : "image_url";

    if (!vlmApiUrl || !mediaUrl) {
      return NextResponse.json(fallbackVlmSummary(body));
    }

    const response = await fetch(vlmApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${vlmApiKey}`,
      },
      body: JSON.stringify({
        model: vlmModel,
        messages: [
          {
            role: "system",
            content:
              "You are an emergency visual verification assistant for EchoSync. " +
              "Only provide short operational observations. Do not diagnose. " +
              "Keep the response suitable for SCDF dispatcher review.",
          },
          {
            role: "user",
            content: [
              {
                type: mediaType,
                [mediaType]: {
                  url: mediaUrl,
                },
              },
              {
                type: "text",
                text:
                  `Case ID: ${body.caseId ?? "Unknown"}\n` +
                  `Case type: ${body.caseType ?? "Unknown"}\n` +
                  `Location: ${body.location ?? "Unknown"}\n` +
                  `Confidence: ${body.confidence ?? "Unknown"}\n` +
                  `Risk level: ${body.riskLevel ?? "Unknown"}\n` +
                  `Sensor summary: ${body.sensorSummary ?? "No sensor summary provided"}\n\n` +
                  "Review the visual input and give a short verification summary in 1-2 sentences. " +
                  "Mention whether the visual evidence supports possible fall, medical distress, or no clear emergency.",
              },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 120,
        stream: false,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(fallbackVlmSummary(body));
    }

    const data = await response.json();

    const visualSummary =
      data?.choices?.[0]?.message?.content ??
      data?.output_text ??
      "Visual verification completed, but no summary was returned.";

    return NextResponse.json({
      visualSummary,
      source: "VLM",
      model: vlmModel,
    });
  } catch {
    return NextResponse.json(
      {
        visualSummary:
          "Visual verification fallback activated. The dashboard can continue without VLM output.",
        source: "Fallback",
        model: "mock-vlm-fallback",
      },
      { status: 200 }
    );
  }
}