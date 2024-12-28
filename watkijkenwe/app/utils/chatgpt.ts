// utils/chatgpt.ts
import OpenAI from "openai";


// Define the structure of user preferences
type UserPreferences = {
  type: string;
  platform: string[];
  viewers: string;
  time: string;
  mood: string;
  genre: string;
  duration: string;
};

const arrr:OpenAI.Chat.Completions.ChatCompletionContentPartText = {
    text: "Can you recommend a movie?",
    type: "text"
  };

const apikey = process.env.OPENAI_API_KEY
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
            model: "gpt-4o-mini", // Or "gpt-4" if you want to use GPT-4
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
            
        });
        
        console.log(response)
    // Assuming the response will contain the recommendations in the assistant's reply
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI API request:", error);
    throw new Error("Failed to get recommendations from OpenAI.");
  }
}
