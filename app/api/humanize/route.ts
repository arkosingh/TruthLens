import { NextRequest, NextResponse } from "next/server";

const MAX_TEXT_LENGTH = 200000;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
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
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { text } = body;
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH.toLocaleString()} characters` },
      { status: 400 }
    );
  }

  const prompt = `You are a text humanizer. Rewrite the following text so it reads as naturally human-written as possible.

Guidelines:
- Preserve the original meaning, facts, and key points exactly
- Use varied sentence lengths — mix short punchy sentences with longer ones
- Add natural transitions and conversational flow
- Replace overly formal or generic AI phrases with more natural alternatives
- Use contractions where appropriate (e.g., "it's", "don't", "we're")
- Add subtle personal touches or opinions where fitting
- Vary vocabulary — avoid repetitive word choices
- Break up long paragraphs if needed
- Keep the same overall tone (academic stays academic, casual stays casual) but make it sound more authentic
- Do NOT add any commentary, preamble, or explanation — return ONLY the rewritten text

Text to humanize:
"""
${text}
"""`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8 },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      console.error("Gemini REST error:", res.status, errBody);
      return NextResponse.json(
        { error: errBody?.error?.message || `Gemini API error (${res.status})` },
        { status: 502 }
      );
    }

    const geminiData = await res.json();
    const humanizedText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!humanizedText) {
      return NextResponse.json(
        { error: "Failed to generate humanized text. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ humanizedText });
  } catch (error) {
    console.error("Gemini humanize request failed:", error);
    return NextResponse.json(
      { error: "Unable to reach humanization service. Please try again." },
      { status: 502 }
    );
  }
}
