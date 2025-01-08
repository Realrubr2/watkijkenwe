'use client'; // Mark the file as a client component

import { useState } from 'react';
import RecommendationForm from '../components/RecommendationForm';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from '../components/Navbar';
import { buildChatGPTRequest } from './utils/chatgpt'; // Import the utility function

// Define types for recommendations
type RecommendationResult = {
  title: string;
  recommendations: Array<{ title: string; description: string }>;
  collectedData: any;
};

export default function Home() {
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (userPreferences: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the OpenAI API with the user preferences
      const apiResponse = await buildChatGPTRequest(userPreferences);
      

      // Check if 'choices' is defined in the response
      if (apiResponse) {
        const content = apiResponse

        // Check if content exists and is a valid JSON string
        if (content) {
          const parsedContent = JSON.parse(content);

          // Validate the parsed content structure
          if (parsedContent && Array.isArray(parsedContent.recommendations)) {
            // Set the recommendation data
            setRecommendation({
              title: "Your Recommendations",
              recommendations: parsedContent.recommendations.map((rec: any) => ({
                title: rec.title,            // Extract the title
                description: rec.recomendation,  // Extract the description
              })),
              collectedData: userPreferences,
            });
          } else {
            setError("Invalid recommendations format.");
          }
        } else {
          setError("No content found in the response.");
        }
      } else {
        setError("No choices available in the response.");
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setError("An error occurred while fetching recommendations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setRecommendation(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        {error ? (
          <div className="text-center">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleRetry}>Probeer opnieuw</Button>
          </div>
        ) : !recommendation ? (
          isLoading ? (
            <LoadingAnimation />
          ) : (
            <RecommendationForm onSubmit={handleSubmit} />
          )
        ) : (
          <div className="text-center w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Onze aanbevelingen:</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              {/* Render recommendations as simple text in a box */}
              <ul className="space-y-2 text-left text-lg">
                {recommendation.recommendations.map((rec, index) => (
                  <li key={index} className="bg-white p-2 rounded-md">
                    <strong>{rec.title}</strong>: {rec.description}
                  </li>
                ))}
              </ul>
            </div>
            <h3 className="text-xl font-bold mt-8 mb-2">Verzamelde gegevens:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-left text-sm">
              {JSON.stringify(recommendation.collectedData, null, 2)}
            </pre>
            <Button onClick={handleRetry} className="mt-4">Nieuwe aanbeveling</Button>
          </div>
        )}
      </main>
    </div>
  );
}
