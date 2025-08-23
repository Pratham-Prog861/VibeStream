
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { searchYoutubeVideo } from '@/services/youtube';
import { usePlayerStore } from '@/store/player-store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, Search as SearchIcon, Play } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  query: z.string().min(2, { message: 'Search query must be at least 2 characters.' }),
});

type Video = {
  videoId: string;
  title: string;
  artist: string;
  coverUrl: string;
};

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const { toast } = useToast();
  const { playSong } = usePlayerStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  const fetchInitialVideos = async () => {
    setLoading(true);
    try {
      const results = await searchYoutubeVideo('lofi hip hop radio - beats to relax/study to', 9);
      if (results) {
        setVideos(results);
      }
    } catch (error) {
       console.error("Error fetching initial videos:", error);
       toast({
        variant: 'destructive',
        title: 'Error fetching videos',
        description: 'Could not load initial videos. Please try searching.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInitialVideos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setVideos([]);
    try {
      const results = await searchYoutubeVideo(values.query, 9);
      if (results && results.length > 0) {
        setVideos(results);
      } else {
        toast({
          title: 'No results found',
          description: `Your search for "${values.query}" did not return any results.`,
        });
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        variant: 'destructive',
        title: 'Error searching videos',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-bold">Search</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                     <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     <Input placeholder="Artists, songs, or playlists" className="pl-12 text-lg h-14" {...field} />
                  </div>
                </FormControl>
                <FormMessage className="absolute -bottom-6 left-2"/>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 h-10">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Search
          </Button>
        </form>
      </Form>

      {loading && (
        <div className="w-full text-center pt-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
          <p className="mt-2 text-muted-foreground">Searching for music...</p>
        </div>
      )}

      {!loading && videos.length === 0 && (
         <p className="text-muted-foreground text-center pt-8">Find your next favorite song.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.videoId}
            className="group relative cursor-pointer overflow-hidden rounded-lg"
            onClick={() => playSong(video)}
          >
            <Image
              src={video.coverUrl}
              alt={`Cover for ${video.title}`}
              width={300}
              height={168}
              className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-headline text-base font-semibold truncate text-white">{video.title}</h3>
              <p className="text-sm text-white/80 truncate">{video.artist}</p>
            </div>
            <div className="absolute right-4 top-[calc(50%-1.5rem)] flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <Play className="h-6 w-6 fill-current ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
