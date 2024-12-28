'use server'

import { revalidatePath } from 'next/cache'

type RecommendationData = {
  type: string
  platform: string[]
  viewers: string
  time: string
  mood: string
  genre: string
  duration: string
}

export async function getRecommendation(data: RecommendationData) {
  // Hier zou je normaal gesproken een AI-model aanroepen of een database raadplegen
  // Voor dit voorbeeld simuleren we een aanbeveling
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simuleer vertraging

  const recommendations = {
    'Film': {
      'Netflix': ['The Adam Project', 'Don\'t Look Up', 'Red Notice'],
      'Disney+': ['Avengers: Endgame', 'Soul', 'Cruella'],
      'Amazon Prime': ['The Tomorrow War', 'Borat Subsequent Moviefilm', 'One Night in Miami'],
      'HBO Max': ['Dune', 'The Batman', 'King Richard'],
      'Apple TV+': ['CODA', 'The Banker', 'Greyhound']
    },
    'Serie': {
      'Netflix': ['Stranger Things', 'The Crown', 'Bridgerton'],
      'Disney+': ['The Mandalorian', 'WandaVision', 'Loki'],
      'Amazon Prime': ['The Boys', 'The Marvelous Mrs. Maisel', 'Fleabag'],
      'HBO Max': ['Succession', 'The White Lotus', 'Euphoria'],
      'Apple TV+': ['Ted Lasso', 'The Morning Show', 'For All Mankind']
    }
  }

  const selectedPlatforms = data.platform as string[]
  let allRecommendations: string[] = []

  selectedPlatforms.forEach(platform => {
    const platformRecommendations = recommendations[data.type as 'Film' | 'Serie'][platform as keyof typeof recommendations['Film']]
    allRecommendations = [...allRecommendations, ...platformRecommendations]
  })

  const recommendation = allRecommendations[Math.floor(Math.random() * allRecommendations.length)]

  revalidatePath('/')
  return { recommendation, collectedData: data }
}

