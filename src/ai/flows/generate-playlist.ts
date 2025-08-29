'use server';

/**
 * @fileOverview Generates a playlist of songs based on user input.
 *
 * - generatePlaylist - A function that generates a playlist based on user input.
 * - GeneratePlaylistInput - The input type for the generatePlaylist function.
 * - GeneratePlaylistOutput - The return type for the generatePlaylist function.
 * - generateSongRecommendation - A function that generates song recommendations based on current song.
 * - SongRecommendationInput - The input type for the generateSongRecommendation function.
 * - SongRecommendationOutput - The return type for the generateSongRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {searchYoutubeVideo} from '@/services/youtube';
import {z} from 'genkit';

const GeneratePlaylistInputSchema = z.object({
  mood: z
    .string()
    .describe("The mood of the playlist (e.g., 'happy', 'sad', 'energetic')."),
  listeningHabits: z
    .string()
    .describe("The user's listening habits and preferences."),
  length: z.number().optional().describe('The desired length of the playlist.'),
});
export type GeneratePlaylistInput = z.infer<typeof GeneratePlaylistInputSchema>;

const SongSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
  youtubeId: z.string().describe('The YouTube video ID for the song.'),
});

const GeneratedSongSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
});

const GeneratePlaylistOutputSchema = z.object({
  playlist: z.array(SongSchema).describe('A list of songs for the playlist.'),
});
export type GeneratePlaylistOutput = z.infer<typeof GeneratePlaylistOutputSchema>;

// New schema for song recommendations
const SongRecommendationInputSchema = z.object({
  currentSongTitle: z.string().describe('The title of the currently playing song.'),
  currentSongArtist: z.string().describe('The artist of the currently playing song.'),
  genre: z.string().optional().describe('The genre of the current song (if known).'),
  mood: z.string().optional().describe('The mood of the current song (e.g., energetic, calm, sad).'),
  language: z.string().optional().describe('The language of the current song (e.g., English, Hindi, Spanish).'),
});

export type SongRecommendationInput = z.infer<typeof SongRecommendationInputSchema>;

const SongRecommendationOutputSchema = z.object({
  recommendations: z.array(SongSchema).describe('A list of recommended songs similar to the current song.'),
});

export type SongRecommendationOutput = z.infer<typeof SongRecommendationOutputSchema>;

export async function generatePlaylist(
  input: GeneratePlaylistInput
): Promise<GeneratePlaylistOutput> {
  return generatePlaylistFlow(input);
}

// New function for generating song recommendations
export async function generateSongRecommendation(
  input: SongRecommendationInput
): Promise<SongRecommendationOutput> {
  return generateSongRecommendationFlow(input);
}

const generatePlaylistPrompt = ai.definePrompt({
  name: 'generatePlaylistPrompt',
  input: {schema: GeneratePlaylistInputSchema},
  output: {schema: z.object({songs: z.array(GeneratedSongSchema)})},
  prompt: `You are a playlist curator who creates playlists based on user input.

  Based on the user's mood and listening habits, create a playlist of songs.
  Consider the desired length if provided.
  For each song, provide a realistic title and artist.

  Mood: {{{mood}}}
  Listening Habits: {{{listeningHabits}}}
  Length: {{{length}}}

  Playlist:
  `,
});

const generateSongRecommendationPrompt = ai.definePrompt({
  name: 'generateSongRecommendationPrompt',
  input: {schema: SongRecommendationInputSchema},
  output: {schema: z.object({songs: z.array(GeneratedSongSchema)})},
  prompt: `You are a music recommendation expert. Based on the currently playing song, suggest 3-5 similar songs that would create a seamless listening experience.

  Current Song: {{{currentSongTitle}}} by {{{currentSongArtist}}}
  Genre: {{{genre}}}
  Mood: {{{mood}}}
  Language: {{{language}}}

  Consider:
  - Similar musical style and genre
  - Matching energy level and mood
  - Same language if specified
  - Complementary artists and sounds
  - Songs that flow well together

  Provide realistic song titles and artists that would be perfect to play next.
  `,
});

const generatePlaylistFlow = ai.defineFlow(
  {
    name: 'generatePlaylistFlow',
    inputSchema: GeneratePlaylistInputSchema,
    outputSchema: GeneratePlaylistOutputSchema,
  },
  async input => {
    const {output} = await generatePlaylistPrompt(input);
    if (!output) {
      throw new Error('Could not generate playlist');
    }

    const playlist = await Promise.all(
      output.songs.map(async song => {
        const video = await searchYoutubeVideo(
          `${song.artist} - ${song.title}`
        );
        return {
          ...song,
          youtubeId: video ? video[0].videoId : 'dQw4w9WgXcQ', // Fallback to a default video
        };
      })
    );

    return {playlist};
  }
);

const generateSongRecommendationFlow = ai.defineFlow(
  {
    name: 'generateSongRecommendationFlow',
    inputSchema: SongRecommendationInputSchema,
    outputSchema: SongRecommendationOutputSchema,
  },
  async input => {
    const {output} = await generateSongRecommendationPrompt(input);
    if (!output) {
      throw new Error('Could not generate song recommendations');
    }

    const recommendations = await Promise.all(
      output.songs.map(async song => {
        const video = await searchYoutubeVideo(
          `${song.artist} - ${song.title}`
        );
        return {
          ...song,
          youtubeId: video ? video[0].videoId : 'dQw4w9WgXcQ', // Fallback to a default video
        };
      })
    );

    return {recommendations};
  }
);
