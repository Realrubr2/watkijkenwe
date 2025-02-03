import { generateEmbedding, searchTurso } from "@/app/utils/embedding";
import { NextResponse } from "next/server";

export type FormData = {
  type: string;
  platform: string[];
  kijkers: number;
  tijd: string;
  stemming: string;
  genre: string;
  duur: string;
};

// API Route: Handles search query
export async function POST(req: Request) {
  try {
    const body: FormData = await req.json();

    // Convert FormData into a search string
    const searchQuery = `${body.genre} ${body.platform.join(", ")} ${body.tijd} ${body.stemming} ${body.duur}`;

    const embedding = await generateEmbedding(searchQuery);
    
    console.log(body.type)
   const query = await searchTurso(embedding, body.type, body.platform, body.genre)

 

    return NextResponse.json(query);
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
