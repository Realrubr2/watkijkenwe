// app/api/chatgpt/route.ts (or app/api/chatgpt.ts, depending on your Next.js version)

import { NextRequest, NextResponse } from 'next/server';
import { buildChatGPTRequest } from '../../utils/chatgpt';

// Handle POST requests to /api/chatgpt
export async function POST(req: NextRequest) {
  try {
    const userPreferences = await req.json();
    console.log('Received user preferences:', userPreferences);

    const recommendations = await buildChatGPTRequest(userPreferences);
    console.log('Recommendations received:', recommendations);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to get recommendations from OpenAI." }, { status: 500 });
  }
}
