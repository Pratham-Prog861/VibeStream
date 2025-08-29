'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePlaylist, GeneratePlaylistOutput } from '@/ai/flows/generate-playlist';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music, Play } from 'lucide-react';
import { usePlayerStore } from '@/store/player-store';

const formSchema = z.object({
  mood: z.string().min(3, { message: 'Mood must be at least 3 characters long.' }),
  listeningHabits: z.string().min(10, { message: 'Listening habits must be at least 10 characters long.' }),
});

export default function PlaylistForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratePlaylistOutput | null>(null);
  const { toast } = useToast();
  const { playSong, addToPlaylist } = usePlayerStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      listeningHabits: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    try {
      const output = await generatePlaylist(values);
      setResult(output);
      
      // Add songs to the player's playlist
      const songs = output.playlist.map(song => ({
        title: song.title,
        artist: song.artist,
        videoId: song.youtubeId,
        coverUrl: `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`
      }));
      
      addToPlaylist(songs);
      
      toast({
        title: 'Playlist generated!',
        description: `${songs.length} songs added to your queue.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error generating playlist',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Create Your Playlist</CardTitle>
        <CardDescription>Fill out the details below to get a custom playlist.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's your mood?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Energetic, chill, melancholic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="listeningHabits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your listening habits</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I love indie rock from the 2000s, female vocalists, and upbeat tempos."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Playlist
            </Button>
          </form>
        </Form>

        {loading && (
          <div className="mt-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
            <p className="mt-2 text-muted-foreground">Curating your vibe...</p>
          </div>
        )}

        {result && (
          <div className="mt-8">
            <h3 className="font-headline text-2xl font-semibold mb-4">Your AI-Generated Playlist</h3>
            <ul className="space-y-2 rounded-md border p-4">
              {result.playlist.map((song, index) => (
                <li key={index} className="flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3">
                    <Music className="h-4 w-4 text-accent" />
                    <div>
                      <p>{song.title}</p>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={() => playSong({ title: song.title, artist: song.artist, videoId: song.youtubeId })}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
