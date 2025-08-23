/**
 * @fileoverview Service for interacting with the YouTube Data API.
 */
'use server';

const API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * Searches for a video on YouTube and returns the video ID.
 * @param query The search query.
 * @returns The video ID, or null if not found.
 */
export async function searchYoutubeVideo(
  query: string
): Promise<string | null> {
  if (!API_KEY) {
    console.error('YOUTUBE_API_KEY environment variable not set.');
    return null;
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '1',
    key: API_KEY,
  });

  try {
    const response = await fetch(`${YOUTUBE_API_URL}?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData.error.message);
      return null;
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch from YouTube API:', error);
    return null;
  }
}
