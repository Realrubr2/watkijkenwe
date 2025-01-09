type UserPreferences = {
  type: string;
  platform: string[];
  viewers: string;
  time: string;
  mood: string;
  genre: string;
  duration: string;
};

export function buildLlamaAIRequest(userPreferences: UserPreferences) {
  return {
    messages: [
      {
        role: "user",
        content: `Recommend 5 ${userPreferences.type.toLowerCase()}s based on the following preferences:
        - Platform(s): ${userPreferences.platform.join(', ')}
        - Number of viewers: ${userPreferences.viewers}
        - Time of day: ${new Date(userPreferences.time).toLocaleTimeString()}
        - Mood: ${userPreferences.mood}
        - Preferred genre: ${userPreferences.genre}
        - Preferred duration: ${userPreferences.duration}`
      },
    ],
    functions: [
      {
        name: "get_movie_recommendations",
        description: "Get movie or TV show recommendations based on user preferences",
        parameters: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  type: { type: "string", enum: ["movie", "tv_show"] },
                  genre: { type: "string" },
                  platform: { type: "string" },
                  duration: { type: "string" },
                  description: { type: "string" },
                },
                required: ["title", "type", "genre", "platform", "duration", "description"],
              },
              minItems: 5,
              maxItems: 5,
            },
          },
          required: ["recommendations"],
        },
      },
    ],
    stream: false,
    function_call: "get_movie_recommendations",
  };
}

