"use server"

import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";


const recommendationsArray = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      streamingServices: z.array(z.string()),
      recomendation: z.string(),
    })
  )
});



type UserPreferences = {
  type: string;
  platform: string[];
  kijkers: string;
  tijd: string;
  stemming: string;
  genre: string;
  duur: string;
};

const apikey = process.env.OPENAI_API_KEY

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: apikey});

// Build the API request to OpenAI
export async function buildChatGPTRequest(userPreferences: UserPreferences) {
  const prompt = `Recommend 5 ${userPreferences.type.toLowerCase()}s based on the following preferences:
    - Platform(s): ${userPreferences.platform.join(', ')}
    - Aantal kijkers: ${userPreferences.kijkers}
    - Tijd van de dag: ${new Date(userPreferences.tijd).toLocaleTimeString()}
    - stemming: ${userPreferences.stemming}
    - genre voorkeur: ${userPreferences.genre}
    - lengte: ${userPreferences.duur}`;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: [
                {
                    role: "developer",
                    content:`Je bent een behulpzame assistent die geweldige aanbevelingen doet voor de gebruiker voor het kijken van films. 
                    op dit moment ben jij een expert in het aanbevelen van goede films, mensen vanuit heel nederland komen naar jou toe voor advies. 
                    omdat wij slecht zijn in het maken van keuzes ga jij het voor ons bedenken films series die beschikbaar zijn op het platform dat aangegeven word.
                    Ik zou je aanraden om na te denken over een paar films met goede beoordelingen, natuurlijk ook 1 of 2 wat oudere films aan te raden
                    en dan graag de meest populairste en best beoordeeldste als eerst en alsjeblieft geen musical!.
                    en voordat ik het vergeet als ik vraag om series alleen series geven, of als ik vraag om films alleen films geven anders raak ik in de war,
                    ook wil ik hierbij aangeven dat het bij series niet om een specifieke aflevering gaat maar om de hele series`,
                    
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: zodResponseFormat(recommendationsArray, "event"),
        });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI API request:", error);
    throw new Error("Failed to get recommendations from OpenAI.");
  }
}
