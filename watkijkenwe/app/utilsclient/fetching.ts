
  
// Fetches movie posters and merges them with recommendations
async function fetchMoviePosters(ismovie: boolean,transformedRecommendations: { id: number; movieTitle: string }[]) {
    let apiUrl = "/api/tmdb-series"
    if (ismovie){
        apiUrl = "/api/tmdb-movie"
    }
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedRecommendations),
      });
  
      if (!response.ok) throw new Error('Failed to fetch movie posters.');
  
      const movieImageLinks = await response.json();
  
      return transformedRecommendations.map((rec) => ({
        ...rec,
        imageUrl: movieImageLinks[rec.id] || null,
      }));
    } catch (error) {
      console.error('Error fetching movie posters:', error);
      return transformedRecommendations.map((rec) => ({
        ...rec,
        imageUrl: null,
      }));
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export async function callGPT(userPreferences: any) {
    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPreferences),
      });
  
      if (!response.ok) throw new Error("Failed to fetch recommendations.");
  
      const data = await response.json();
      const parsedData = JSON.parse(data);
      const recommendations = parsedData.recommendations;
  
      if (!Array.isArray(recommendations)) {
        throw new Error("Invalid recommendations format.");
      }
  
      // Transform recommendations for fetching movie posters
      const transformedRecommendations = recommendations.map((rec, index) => ({
        id: index + 1,
        movieTitle: rec.title,
      }));
      let isMovie = true
      if (userPreferences.type == 'Serie'){
        isMovie = false
      }
        const recommendationsWithPosters = await fetchMoviePosters(isMovie,transformedRecommendations);
  
      // Return recommendations with images
      return recommendations.map((rec, index) => ({
        title: rec.title,
        imageUrl: recommendationsWithPosters[index].imageUrl,
        description: rec.recomendation,
      }));
  
    } catch (error) {
      console.error("Error in callGPT:", error);
      throw new Error("An error occurred while fetching recommendations. Please try again later.");
    }
  }
  