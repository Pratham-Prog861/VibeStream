import PlaylistForm from "@/components/playlist-form";

export default function GeneratePlaylistPage() {
  return (
    <div className="space-y-8 min-h-[150vh]">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">AI Playlist Generator</h1>
        <p className="text-muted-foreground mt-2">Describe your vibe, and let AI create the perfect playlist for you.</p>
      </div>
      <div className="max-w-2xl mx-auto">
        <PlaylistForm />
      </div>
    </div>
  );
}
