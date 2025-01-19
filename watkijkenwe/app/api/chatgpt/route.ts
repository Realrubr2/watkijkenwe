
import { NextRequest, NextResponse } from 'next/server';
import { buildChatGPTRequest } from '../../utils/chatgpt';

export async function POST(req: NextRequest) {
  try {
    const userPreferences = await req.json();

    const recommendations = await buildChatGPTRequest(userPreferences);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to get recommendations from OpenAI." }, { status: 500 });
  }
}
