/**
 * @fileoverview Service for interacting with the YouTube Data API.
 */
'use server';

const API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

type YouTubeVideo = {
  videoId: string;
  title: string;
  artist: string;
  coverUrl: string;
};

/**
 * Searches for videos on YouTube and returns them.
 * @param query The search query.
 * @param maxResults The maximum number of results to return.
 * @returns A list of videos, or null if an error occurs.
 */
export async function searchYoutubeVideo(
  query: string,
  maxResults = 1
): Promise<YouTubeVideo[] | null> {
  if (!API_KEY) {
    console.error('YOUTUBE_API_KEY environment variable not set.');
    // This error is for developers, so we don't toast.
    return null;
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: maxResults.toString(),
    key: API_KEY,
  });

  try {
    const response = await fetch(`${YOUTUBE_API_URL}?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData.error.message);
      // We can't use useToast here because this is a server component.
      // We will handle the error in the component that calls this function.
      return null;
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        coverUrl: item.snippet.thumbnails.high.url,
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch from YouTube API:', error);
    return null;
  }
}
