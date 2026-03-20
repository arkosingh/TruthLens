import { NextRequest, NextResponse } from "next/server";

const SAPLING_API_URL = "https://api.sapling.ai/api/v1/aidetect";
const MAX_TEXT_LENGTH = 200000;

export async function POST(request: NextRequest) {
  const apiKey = process.env.SAPLING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured", code: "NO_API_KEY" },
      { status: 503 }
    );
  }

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { text } = body;
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "Text is required" },
      { status: 400 }
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH.toLocaleString()} characters` },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(SAPLING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: apiKey,
        text,
        sent_scores: true,
        score_string: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please wait a moment and try again.", code: "RATE_LIMITED" },
          { status: 429 }
        );
      }
      console.error(`Sapling API error ${response.status}: ${errorText}`);
      return NextResponse.json(
        { error: "AI detection service returned an error. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Sapling API request failed:", error);
    return NextResponse.json(
      { error: "Unable to reach AI detection service. Please try again." },
      { status: 502 }
    );
  }
}
