
'use client';

import { usePlayerStore } from '@/store/player-store';
import AlbumCard from '@/components/album-card';
import { madeForYou, featuredPlaylists, trending } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { playSong } = usePlayerStore();

  return (
    <div className="space-y-12 mb-32">
      <section>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Listen Now</h1>
        <p className="text-muted-foreground mt-2">Top picks for you. Updated daily.</p>
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trending.map((song) => (
            <AlbumCard 
              key={song.title} 
              title={song.title} 
              artist={song.artist} 
              coverUrl={song.coverUrl} 
              aiHint={song.aiHint}
            />
          ))}
        </div>
      </section>
      
      <Separator />

      <section>
        <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4">Made For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {madeForYou.map((playlist) => (
            <AlbumCard key={playlist.name} title={playlist.name} artist={playlist.artist} coverUrl={playlist.coverUrl} aiHint={playlist.aiHint}/>
          ))}
        </div>
      </section>
      
      <Separator />

      <section>
        <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredPlaylists.map((playlist) => (
            <AlbumCard key={playlist.name} title={playlist.name} artist={playlist.artist} coverUrl={playlist.coverUrl} aiHint={playlist.aiHint}/>
          ))}
        </div>
      </section>
    </div>
  );
}
