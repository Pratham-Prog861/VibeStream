/**
 * @fileoverview Service for interacting with the YouTube Data API.
 */
'use server';

import { youtubeApiKeyManager } from '@/utils/apiKeyManager';

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
  if (youtubeApiKeyManager.getAvailableKeyCount() === 0) {
    console.error('All YouTube API keys have been rate limited.');
    return null;
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: maxResults.toString(),
    key: youtubeApiKeyManager.getCurrentKey(),
  });

  try {
    const response = await fetch(`${YOUTUBE_API_URL}?${params.toString()}`);
    
    if (response.status === 403) {
      // Check if the error is due to rate limiting or quota exceeded
      const errorData = await response.json().catch(() => ({}));
      const isQuotaExceeded = errorData.error?.errors?.some(
        (e: any) => e.reason === 'quotaExceeded' || e.reason === 'rateLimitExceeded'
      );

      if (isQuotaExceeded) {
        console.log(`API key quota exceeded. Rotating to next available key...`);
        const newKey = youtubeApiKeyManager.rotateKey();
        
        if (newKey) {
          console.log(`Retrying with new API key (${youtubeApiKeyManager.getAvailableKeyCount()} keys remaining)...`);
          // Retry the request with the new key
          return searchYoutubeVideo(query, maxResults);
        } else {
          console.error('All YouTube API keys have been rate limited.');
          return null;
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('YouTube API Error:', errorData.error?.message || 'Unknown error');
      return null;
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        coverUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
}
