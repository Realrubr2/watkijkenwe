"use server"

interface RecommendationObject {
    id: number;
    movieTitle: string;
}

const TMDB_ACCESS_TOKEN = process.env.TMDB_AUTH; // Replace with your TMDB Bearer Token
const MOVIE_BASE_URL = process.env.TMDB_URL_MOVIES;
const SERIES_BASE_URL = process.env.TMDB_URL_SERIES
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export async function getMovieImageLinks(recommendations: RecommendationObject[]): Promise<Record<number, string | null>> {
    const movieImageLinks: Record<number, string | null> = {};

    for (const { id, movieTitle } of recommendations) {
        try {
            const response = await fetch(`${MOVIE_BASE_URL}?query=${encodeURIComponent(movieTitle)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                movieImageLinks[id] = `${IMAGE_BASE_URL}${data.results[0].poster_path}`;
            } else {
                movieImageLinks[id] = null; // No image found
            }
        } catch (error) {
            console.error(`Error fetching movie data for: ${movieTitle}`, error);
            movieImageLinks[id] = null;
        }
    }

    return movieImageLinks;
}

export async function getSeriesImageLinks(recommendations: RecommendationObject[]): Promise<Record<number, string | null>> {
    const movieImageLinks: Record<number, string | null> = {};

    for (const { id, movieTitle } of recommendations) {
        try {
            const response = await fetch(`${SERIES_BASE_URL}?query=${encodeURIComponent(movieTitle)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                movieImageLinks[id] = `${IMAGE_BASE_URL}${data.results[0].poster_path}`;
            } else {
                movieImageLinks[id] = null; // No image found
            }
        } catch (error) {
            console.error(`Error fetching movie data for: ${movieTitle}`, error);
            movieImageLinks[id] = null;
        }
    }

    return movieImageLinks;
}