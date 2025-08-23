'use server';

/**
 * @fileOverview Generates a playlist of songs based on user input.
 *
 * - generatePlaylist - A function that generates a playlist based on user input.
 * - GeneratePlaylistInput - The input type for the generatePlaylist function.
 * - GeneratePlaylistOutput - The return type for the generatePlaylist function.
 */

import {ai} from '@/ai/genkit';
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

const GeneratePlaylistOutputSchema = z.object({
  playlist: z.array(z.string()).describe('A list of song titles for the playlist.'),
});
export type GeneratePlaylistOutput = z.infer<typeof GeneratePlaylistOutputSchema>;

export async function generatePlaylist(input: GeneratePlaylistInput): Promise<GeneratePlaylistOutput> {
  return generatePlaylistFlow(input);
}

const generatePlaylistPrompt = ai.definePrompt({
  name: 'generatePlaylistPrompt',
  input: {schema: GeneratePlaylistInputSchema},
  output: {schema: GeneratePlaylistOutputSchema},
  prompt: `You are a playlist curator who creates playlists based on user input.

  Based on the user's mood and listening habits, create a playlist of songs.
  Consider the desired length if provided.

  Mood: {{{mood}}}
  Listening Habits: {{{listeningHabits}}}
  Length: {{{length}}}

  Playlist:
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
    return output!;
  }
);
