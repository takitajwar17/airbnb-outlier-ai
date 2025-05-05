// Unsplash API service
// This service handles communication with the Unsplash API

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

const UNSPLASH_API_URL = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

/**
 * Search for photos on Unsplash
 * @param query Search query
 * @param page Page number (optional, default: 1)
 * @param perPage Number of items per page (optional, default: 10)
 * @returns Promise resolving to array of photo objects
 */
export async function searchPhotos(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<UnsplashPhoto[]> {
  try {
    const searchParams = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json() as UnsplashSearchResponse;
    return data.results;
  } catch (error) {
    console.error('Error fetching photos from Unsplash:', error);
    return [];
  }
}

/**
 * Get a random photo URL for a given query
 * @param query Search query
 * @returns Promise resolving to a photo URL or fallback image if not found
 */
export async function getRandomPhotoUrl(query: string): Promise<string> {
  try {
    const photos = await searchPhotos(query, 1, 10);
    
    if (photos.length > 0) {
      // Return a random photo from the results
      const randomIndex = Math.floor(Math.random() * photos.length);
      return photos[randomIndex].urls.regular;
    }
    
    // Fallback to placeholder if no photos found
    return '/images/placeholder.jpg';
  } catch (error) {
    console.error('Error getting random photo:', error);
    return '/images/placeholder.jpg';
  }
} 