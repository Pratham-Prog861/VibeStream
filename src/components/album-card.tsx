
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
};

export default function AlbumCard({ title, artist, coverUrl, aiHint }: AlbumCardProps) {
  const { playSong } = usePlayerStore();
  const { toast } = useToast();

  const handlePlay = async () => {
    // This is a simple implementation. We search for the title and artist on YouTube.
    // In a real app, you might have a specific playlist ID or track IDs.
    const results = await searchYoutubeVideo(`${title} ${artist}`, 1);
    if (results && results.length > 0) {
      playSong(results[0]);
    } else {
      toast({
        variant: 'destructive',
        title: 'Song not found',
        description: `Could not find "${title}" on YouTube.`,
      });
    }
  };

  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl shadow-sm ring-1 ring-border/60 transition-all hover:shadow-xl hover:ring-border" onClick={handlePlay}>
        <Image
          src={coverUrl}
          alt={`Cover for ${title}`}
          width={300}
          height={300}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={aiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-headline text-lg font-semibold truncate text-white drop-shadow-sm">{title}</h3>
          <p className="text-sm text-white/80 truncate">{artist}</p>
        </div>
        <div className="absolute right-4 top-[calc(50%-2rem)] flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="h-6 w-6 fill-current ml-1" />
        </div>
    </div>
  );
}
