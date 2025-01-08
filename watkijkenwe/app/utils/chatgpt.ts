// utils/chatgpt.ts
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




// structure of user preferences
type UserPreferences = {
  type: string;
  platform: string[];
  viewers: string;
  time: string;
  mood: string;
  genre: string;
  duration: string;
};

const apikey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: apikey,dangerouslyAllowBrowser: true});

// Build the API request to OpenAI
export async function buildChatGPTRequest(userPreferences: UserPreferences) {
  const prompt = `Recommend 5 ${userPreferences.type.toLowerCase()}s based on the following preferences:
    - Platform(s): ${userPreferences.platform.join(', ')}
    - Number of viewers: ${userPreferences.viewers}
    - Time of day: ${new Date(userPreferences.time).toLocaleTimeString()}
    - Mood: ${userPreferences.mood}
    - Preferred genre: ${userPreferences.genre}
    - Preferred duration: ${userPreferences.duration}`;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", 
            messages: [
                {
                    role: "developer",
                    content:`Je bent een behulpzame assistent die geweldige aanbevelingen doet voor de gebruiker voor het kijken van films. 
                    Uw aanbevelingen zijn een groot probleem voor de gebruikers, 
                    omdat ze slecht zijn in het maken van keuzes. Ik zou je aanraden om na te denken over een paar films met goede beoordelingen, 
                    de mensen die je vragen Deze vragen liggen tussen de 16 en 50, dus houd daar rekening mee bij het doen van aanbevelingen`,
                    
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: zodResponseFormat(recommendationsArray, "event"),
        });
        
        console.log(response)

    // Assuming the response will contain the recommendations in the assistant's reply
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI API request:", error);
    throw new Error("Failed to get recommendations from OpenAI.");
  }
}
