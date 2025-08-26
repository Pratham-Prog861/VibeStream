
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { usePlayerStore, type Song } from '@/store/player-store';
import { searchYoutubeVideo } from '@/services/youtube';
import AlbumCard from '@/components/album-card';
import { madeForYou } from '@/lib/data';
import { featuredPlaylists } from '@/lib/featured-playlists';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [trending, setTrending] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayerStore();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTrendingMusic() {
      try {
        setLoading(true);
        // Fetch top individual songs
        const results = await searchYoutubeVideo('Top new songs 2024', 10);
        if (results) {
          setTrending(results);
        }
      } catch (error) {
        console.error('Error fetching trending music:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching trending music',
          description: 'Could not load trending music. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchTrendingMusic();
  }, [toast]);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-headline text-4xl font-bold">Listen Now</h1>
        <p className="text-muted-foreground mt-2">Top picks for you. Updated daily.</p>
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Trending Now</h2>
        {loading ? (
           <div className="w-full text-center pt-8">
             <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
             <p className="mt-2 text-muted-foreground">Loading trending music...</p>
           </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trending.map((song) => (
              <div
                key={song.videoId}
                className="group relative cursor-pointer overflow-hidden rounded-lg"
                onClick={() => playSong(song)}
              >
                <Image
                  src={song.coverUrl!}
                  alt={`Cover for ${song.title}`}
                  width={300}
                  height={300}
                  className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-headline text-lg font-semibold truncate text-white">{song.title}</h3>
                  <p className="text-sm text-white/80 truncate">{song.artist}</p>
                </div>
                <div className="absolute right-4 top-[calc(50%-2rem)] flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <Play className="h-6 w-6 fill-current ml-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      <Separator />

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Made For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {madeForYou.map((playlist) => (
            <AlbumCard key={playlist.name} title={playlist.name} artist={`${playlist.songCount} songs`} coverUrl={playlist.coverUrl} aiHint={playlist.aiHint}/>
          ))}
        </div>
      </section>
      
      <Separator />

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredPlaylists.map((playlist) => (
            <AlbumCard key={playlist.name} title={playlist.name} artist={playlist.curator} coverUrl={playlist.coverUrl} aiHint={playlist.aiHint}/>
          ))}
        </div>
      </section>
    </div>
  );
}
