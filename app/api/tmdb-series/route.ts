import { NextRequest, NextResponse } from 'next/server';
import { getSeriesImageLinks } from '@/app/utils/themoviedb';

export async function POST(req: NextRequest) {
  try {
    const userPreferences = await req.json(); // Expecting an array of { id, movieTitle }

    const recommendations = await getSeriesImageLinks(userPreferences);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to get recommendations from TMDB." }, { status: 500 });
  }
}
