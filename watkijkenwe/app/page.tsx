'use client'

import { useState } from 'react'
import RecommendationForm from '../components/RecommendationForm'
import { LoadingAnimation } from '../components/LoadingAnimation'
import { getRecommendation } from './actions'
import { buildLlamaAIRequest } from './utils/llamaai'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from '../components/Navbar'

type Recommendation = {
  title: string;
  type: 'movie' | 'tv_show';
  genre: string;
  platform: string;
  duration: string;
  description: string;
}

type RecommendationResult = {
  title: string;
  collectedData: any;
  llamaRecommendations: Recommendation[];
}

export default function Home() {
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    // setIsLoading(true);
    // setError(null);
    // try {
    //   const result = await getRecommendation(data);
    //   const llamaRequestBody = buildLlamaAIRequest(result.collectedData);
    //   const llamaResponse = await fetch('https://api.llamaai.com/recommend', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer YOUR_LLAMA_AI_API_KEY', // Replace with your actual API key
    //     },
    //     body: JSON.stringify(llamaRequestBody),
    //   });
    //   if (!llamaResponse.ok) {
    //     throw new Error('Failed to get recommendations from LlamaAI');
    //   }
    //   const llamaData = await llamaResponse.json();
    //   setRecommendation({ 
    //     ...result, 
    //     llamaRecommendations: llamaData.recommendations || [] 
    //   });
    // } catch (error) {
    //   console.error('Error getting recommendation:', error);
    //   setError("Wat kijken we heeft ook moeite met het bedenken van een film. Probeer het nog een keer!");
    // } finally {
    //   setIsLoading(false);
    // }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendation.llamaRecommendations.map((rec, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">Type: {rec.type}</p>
                  <p className="text-sm text-gray-600 mb-1">Genre: {rec.genre}</p>
                  <p className="text-sm text-gray-600 mb-1">Platform: {rec.platform}</p>
                  <p className="text-sm text-gray-600 mb-1">Duration: {rec.duration}</p>
                  <p className="text-sm mt-2">{rec.description}</p>
                </div>
              ))}
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
  )
}

