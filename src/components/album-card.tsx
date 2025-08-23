import Image from 'next/image';
import { Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type AlbumCardProps = {
  title: string;
  artist: string;
  coverUrl: string;
  aiHint?: string;
};

export default function AlbumCard({ title, artist, coverUrl, aiHint }: AlbumCardProps) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-lg">
        <Image
          src={coverUrl}
          alt={`Cover for ${title}`}
          width={300}
          height={300}
          className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
          data-ai-hint={aiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-headline text-lg font-semibold truncate text-white">{title}</h3>
          <p className="text-sm text-white/80 truncate">{artist}</p>
        </div>
        <div className="absolute right-4 top-[calc(50%-2rem)] flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="h-6 w-6 fill-current ml-1" />
        </div>
    </div>
  );
}
