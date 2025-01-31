"use server"
import { createClient } from "@libsql/client";
import OpenAI from "openai";

// this page creates the embedding and searches it from the backend



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const turso = createClient({
  url: "libsql://embeddings-realrubr2.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN,
});


// Generate an embedding for the query
export async function generateEmbedding(recomendations :string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: recomendations,
  });

return response.data[0].embedding;
}

// here we search tuso db with the vectors just gotten
export async function searchTurso(embedding: number[]): Promise<Array<{ title: string; image: string; description: string }>> {
   
    const vectorString = JSON.stringify(embedding)
  
    const { rows } = await turso.execute({
      sql: `SELECT content.title, content.image_link, content.description
          FROM embeddings
          JOIN content ON embeddings.content_id = content.id
          ORDER BY vector_distance_cos(embeddings.vectors, vector32(?)) ASC
          LIMIT 5;`,
       args: [vectorString]
});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((row: any) => ({
        title: row.title,
        image: appendLink(row.image_link),
        description: row.description
      }));
   
}


function appendLink(contentLink :string) {
const imageBaseUrl= 'https://image.tmdb.org/t/p/w500'

const transformedLink = `${imageBaseUrl}${contentLink}`
  return transformedLink
}