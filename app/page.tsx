"use client";

import { useState, useEffect } from "react";
import RecommendationForm from "../components/RecommendationForm";
import { LoadingAnimation } from "../components/LoadingAnimation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "../components/Navbar";
import { callDatabase, callGPT } from "./utilsclient/fetching";
import Image from "next/image";

type RecommendationData = {
  type: string;
  platform: string[];
  viewers: string;
  time: string;
  mood: string;
  genre: string;
  duration: string;
};

type RecommendationResult = {
  title: string;
  recommendations: Array<{ title: string; image: string; description: string }>;
  collectedData: RecommendationData;
};

export default function Home() {
  const [recommendation, setRecommendation] =
    useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [lastPreferences, setLastPreferences] =
    useState<RecommendationData | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (userPreferences: any) => {
    setIsLoading(true);
    setError(null);
    setLastPreferences(userPreferences);

    try {
      const recommendations = await callDatabase(userPreferences);
      if (recommendations && Array.isArray(recommendations)) {
        setRecommendation({
          title: "Your Recommendations",
          recommendations: recommendations.map(
            (rec: {
              title: string;
              image: string;
              description: string;
            }) => ({
              title: rec.title,
              image: rec.image,
              description: rec.description,
            })
          ),
          collectedData: userPreferences,
        });
      } else {
        setError("Invalid recommendations format.");
      }
    } catch (error) {
      console.error("Error getting recommendation:", error);
      setError(
        "An error occurred while fetching recommendations. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!lastPreferences) {
      setError(null);
      setRecommendation(null);
      return;
    }

    setIsResubmitting(true);
    await handleSubmit(lastPreferences);
    setIsResubmitting(false);
  };
  const reset = () => {
    setError(null)
    setRecommendation(null)
  }
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleExpand = (index: any) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle expand state
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onReset={reset} />
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
              <ul className="space-y-4 text-left text-lg">
                {recommendation.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-md flex flex-col md:flex-row items-center md:items-start space-x-4 shadow-sm"
                  >
                    <div className="flex-grow text-center md:text-left">
                      <strong className="block">{rec.title}</strong>{" "}
                      {/* Ensures title is on its own line */}
                      {isMobile && (
                        <div className="flex justify-center mt-2">
                        <button
                          onClick={() => toggleExpand(index)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-lg mt-2 block transition-transform transform hover:scale-105"
                        >
                          {expandedIndex === index
                            ? "Verberg details"
                            : "Toon details"}
                        </button>
                        </div>
                      )}
                      {(!isMobile || expandedIndex === index) && (
                        <p className="mt-2 text-gray-700">{rec.description}</p>
                      )}
                    </div>
                    <Image
                      src={rec.image}
                      width={150}
                      height={150}
                      alt={rec.title}
                      className="rounded-md mt-4 md:mt-0" // Added spacing
                    />
                  </li>
                ))}
              </ul>
            </div>
            <h3 className="text-xl font-bold mt-8 mb-2">
              Verzamelde gegevens:
            </h3>
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              {Object.entries(recommendation.collectedData).map(
                ([key, value]) => (
                  <p key={key} className="text-lg mb-2">
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </strong>
                    {Array.isArray(value) ? value.join(", ") : value}
                  </p>
                )
              )}
            </div>
            <Button
              onClick={handleRetry}
              className="mt-4"
              disabled={isResubmitting}
            >
              {isResubmitting ? <LoadingAnimation /> : "Nieuwe aanbeveling"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
