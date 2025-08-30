import ollama from "ollama";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userInput, attachments } = await request.json();
    
    const messages = [
      {
        role: "system",
        content: "You are a helpful legal assistant AI. Provide general legal information and guidance, but always remind users to consult with a qualified attorney for specific legal advice. Be helpful, accurate, and professional."
      },
      {
        role: "user",
        content: userInput,
      },
    ];

    // If there are attachments, mention them in the prompt
    if (attachments && attachments.length > 0) {
      messages[1].content += `\n\nNote: The user has uploaded ${attachments.length} file(s): ${attachments.map((f: { name: string }) => f.name).join(', ')}`;
    }

    const result = await ollama.chat({
      model: "gemma3:4b",
      messages,
    });

    return NextResponse.json({ 
      success: true, 
      response: result.message.content 
    });
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate AI response" 
      },
      { status: 500 }
    );
  }
}
