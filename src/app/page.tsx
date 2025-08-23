import AlbumCard from '@/components/album-card';
import { playlists, recentlyPlayed, madeForYou } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-headline text-4xl font-bold">Listen Now</h1>
        <p className="text-muted-foreground mt-2">Top picks for you. Updated daily.</p>
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recentlyPlayed.map((album) => (
            <AlbumCard key={album.title} {...album} />
          ))}
        </div>
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
          {playlists.map((playlist) => (
            <AlbumCard key={playlist.name} title={playlist.name} artist={`${playlist.songCount} songs`} coverUrl={playlist.coverUrl} aiHint={playlist.aiHint}/>
          ))}
        </div>
      </section>
    </div>
  );
}
