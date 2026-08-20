'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { usePlayerStore } from '@/store/player-store';
import { useToast } from '@/hooks/use-toast';
import { searchYoutubeVideo } from '@/services/youtube';

type AlbumCardProps = {
  title: string;
  artist: string;
  coverUrl: string;
  aiHint?: string;
  genre?: string;
  mood?: string;
  language?: string;
  type?: 'song' | 'playlist';
  queueSongs?: Array<{
    title: string;
    artist: string;
    videoId: string | null;
    coverUrl?: string;
    genre?: string;
    mood?: string;
    language?: string;
  }>;
  queueStartIndex?: number;
};

export default function AlbumCard({ 
  title, 
  artist, 
  coverUrl, 
  aiHint,
  genre = 'Unknown',
  mood = 'Unknown',
  language = 'English',
  type = 'song',
  queueSongs,
  queueStartIndex = 0,
}: AlbumCardProps) {
  const { playSong, playFromQueue } = usePlayerStore();
  const { toast } = useToast();

  const handlePlay = async () => {
    try {
      if (queueSongs && queueSongs.length > 0) {
        playFromQueue(queueSongs, queueStartIndex);
        toast({
          title: 'Now playing',
          description: `${queueSongs[queueStartIndex]?.title ?? title} by ${queueSongs[queueStartIndex]?.artist ?? artist}.`,
        });
        return;
      }

      if (type === 'playlist') {
        const results = await searchYoutubeVideo(`${title} ${artist} playlist`, 10);
        if (results && results.length > 0) {
          const songs = results.map((result) => ({
            ...result,
            genre,
            mood,
            language,
          }));
          playFromQueue(songs, 0);
          toast({
            title: 'Playlist started',
            description: `${title} is now playing.`,
          });
          return;
        }
      }

      const results = await searchYoutubeVideo(`${title} ${artist}`, 1);
      if (results && results.length > 0) {
        const song = {
          ...results[0],
          genre,
          mood,
          language,
        };
        playSong(song);
        toast({
          title: 'Song added to queue',
          description: `${title} by ${artist} is now playing.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Song not found',
          description: `Could not find "${title}" on YouTube.`,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Playback failed',
        description: 'Could not start playback. Please try again.',
      });
    }
  };

  return (
    <button
      type="button"
      className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card/70 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      onClick={handlePlay}
      aria-label={`Play ${title} by ${artist}`}
    >
      <div className="relative">
        <Image
          src={coverUrl}
          alt={`Cover for ${title}`}
          width={300}
          height={300}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint={aiHint}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute right-3 top-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <Play className="h-5 w-5 fill-current ml-0.5" />
        </div>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-2 font-headline text-sm font-semibold leading-5 text-foreground md:text-base">{title}</h3>
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs text-muted-foreground md:text-sm">{artist}</p>
          <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">Play</span>
        </div>
      </div>
    </button>
  );
}
