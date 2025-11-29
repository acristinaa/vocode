import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt || "You are a helpful assistant.",
      messages: messages,
    });

    const textContent = response.content.find((block) => block.type === "text");
    const text =
      textContent && textContent.type === "text" ? textContent.text : "";

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Claude API Error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to get response from Claude" },
      { status: 500 }
    );
  }
}