export type NimSummaryRiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface NimAlertSummaryInput {
  caseId: string;
  caseType: string;
  location: string;
  confidence: number;
  riskLevel: NimSummaryRiskLevel;
  detectors: {
    thermal: string;
    acoustic: string;
    loadMat: string;
    doorFridge: string;
  };
  voiceCheckIn: string;
  immobileTime: string;
  recommendedAction: string;
}

export interface NimAlertSummaryResult {
  summary: string;
  source: 'NIM' | 'Fallback';
}

type NimChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
    text?: string;
  }>;
};

export function buildFallbackAlertSummary(input: NimAlertSummaryInput) {
  const detectorSummary = [
    input.detectors.thermal,
    input.detectors.acoustic,
    input.detectors.loadMat,
    input.voiceCheckIn,
  ]
    .filter(Boolean)
    .join(', ');

  return trimToTwoSentences(
    `${input.caseType} detected with ${input.confidence}% confidence (${input.riskLevel}). ${detectorSummary}; ${input.recommendedAction}.`
  );
}

export async function generateNimAlertSummary(input: NimAlertSummaryInput): Promise<NimAlertSummaryResult> {
  const apiKey = process.env.NIM_API_KEY;
  const apiUrl = process.env.NIM_API_URL;
  const model = process.env.NIM_MODEL;

  if (!apiKey || !apiUrl || !model) {
    return {
      summary: buildFallbackAlertSummary(input),
      source: 'Fallback',
    };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'Create a short operational SCDF dispatcher alert summary. Maximum 2 sentences. Do not diagnose medical conditions. Do not add facts beyond the provided JSON.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              caseId: input.caseId,
              caseType: input.caseType,
              location: input.location,
              confidence: input.confidence,
              riskLevel: input.riskLevel,
              detectors: input.detectors,
              voiceCheckIn: input.voiceCheckIn,
              immobileTime: input.immobileTime,
              recommendedAction: input.recommendedAction,
            }),
          },
        ],
        temperature: 0.2,
        max_tokens: 90,
      }),
    });

    if (!response.ok) {
      return {
        summary: buildFallbackAlertSummary(input),
        source: 'Fallback',
      };
    }

    const data = await response.json() as NimChatResponse;
    const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text;

    if (!content?.trim()) {
      return {
        summary: buildFallbackAlertSummary(input),
        source: 'Fallback',
      };
    }

    return {
      summary: trimToTwoSentences(content),
      source: 'NIM',
    };
  } catch {
    return {
      summary: buildFallbackAlertSummary(input),
      source: 'Fallback',
    };
  }
}

function trimToTwoSentences(value: string) {
  const cleaned = value.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);

  if (!sentences) return cleaned.slice(0, 280);

  return sentences.slice(0, 2).join(' ').slice(0, 280).trim();
}
