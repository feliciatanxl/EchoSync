import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const distDir = path.join(process.cwd(), "app", "myResponder", "dist");

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function isInsideDist(filePath: string) {
  const relative = path.relative(distDir, filePath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path: requestPath = [] } = await context.params;
  const relativePath = requestPath.join("/");
  const requestedFile = path.join(distDir, relativePath);
  const filePath =
    relativePath.includes(".") && isInsideDist(requestedFile)
      ? requestedFile
      : path.join(distDir, "index.html");
  const extension = path.extname(filePath);

  try {
    const body = await readFile(filePath);
    return new NextResponse(body, {
      headers: {
        "Cache-Control": extension === ".html" ? "no-store" : "public, max-age=31536000, immutable",
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
