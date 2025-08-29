'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePlaylist, GeneratePlaylistOutput } from '@/ai/flows/generate-playlist';
import { savePlaylist } from '@/lib/firebase';
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
  const [saving, setSaving] = useState(false);
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

  const handleSavePlaylist = async () => {
    if (!result) return;
    
    setSaving(true);
    try {
      const playlistName = `Playlist - ${new Date().toLocaleDateString()}`;
      const playlistData = {
        name: playlistName,
        description: `Generated playlist based on: ${form.getValues('mood')}`,
        songs: result.playlist.map(song => ({
          title: song.title,
          artist: song.artist,
          videoId: song.youtubeId,
          coverUrl: `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`
        }))
      };

      console.log('Attempting to save playlist:', playlistData);
      
      // Add a small delay to ensure the loading state is shown
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const playlistId = await savePlaylist(playlistData);
      
      if (!playlistId) {
        throw new Error('Failed to get playlist ID after save');
      }
      
      console.log('Playlist saved successfully with ID:', playlistId);
      
      toast({
        title: '🎵 Playlist Saved!',
        description: 'Your playlist has been saved to your library.',
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error in handleSavePlaylist:', error);
      
      let errorMessage = 'Failed to save playlist. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Generate a Playlist</CardTitle>
        <CardDescription>
          Describe the mood or activity for your perfect playlist
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mood or Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., workout, relaxing, focus" {...field} />
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
                  <FormLabel>Listening Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What kind of music do you like? Any specific artists or genres?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Playlist'
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Your Generated Playlist</h3>
              <Button 
                onClick={handleSavePlaylist}
                disabled={saving}
                variant="outline"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Playlist'
                )}
              </Button>
            </div>
            
            <div className="space-y-2">
              {result.playlist.map((song, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => {
                    const songData = {
                      title: song.title,
                      artist: song.artist,
                      videoId: song.youtubeId,
                      coverUrl: `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`
                    };
                    playSong(songData);
                    addToPlaylist([songData]);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={`https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`}
                        alt={song.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      const songData = {
                        title: song.title,
                        artist: song.artist,
                        videoId: song.youtubeId,
                        coverUrl: `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`
                      };
                      playSong(songData);
                      addToPlaylist([songData]);
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
