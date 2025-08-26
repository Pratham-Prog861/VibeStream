import AlbumCard from '@/components/album-card';
import { featuredPlaylists } from '@/lib/data';

export default function PlaylistsPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-4xl font-bold">Your Playlists</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredPlaylists.map((playlist) => (
            <AlbumCard key={playlist.name} title={playlist.name} artist={`${playlist.artist} songs`} coverUrl={playlist.coverUrl} aiHint={playlist.aiHint}/>
          ))}
        </div>
    </div>
  )
}
