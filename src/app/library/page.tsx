"use client";

import { useEffect, useState } from 'react';
import { Play, Music, Trash2, X, ListMusic } from 'lucide-react';
import { getPlaylists, deletePlaylist, Playlist } from '@/lib/firebase';
import { usePlayerStore } from '@/store/player-store';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function LibraryPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { playSong, addToPlaylist } = usePlayerStore();
  const { toast } = useToast();

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const savedPlaylists = await getPlaylists();
      setPlaylists(savedPlaylists);
    } catch (error) {
      console.error('Error loading playlists:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load playlists. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.songs.length > 0) {
      const firstSong = playlist.songs[0];
      playSong({
        title: firstSong.title,
        artist: firstSong.artist,
        videoId: firstSong.videoId,
        coverUrl: firstSong.coverUrl
      });
      addToPlaylist(playlist.songs);
    }
  };

  const handleDeleteClick = (playlistId: string) => {
    setDeletingId(playlistId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      await deletePlaylist(deletingId);
      setPlaylists(playlists.filter(p => p.id !== deletingId));
      toast({
        title: 'Success',
        description: 'Playlist deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete playlist. Please try again.',
      });
    } finally {
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="font-headline text-4xl font-bold">Your Library</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4 space-y-4">
              <Skeleton className="h-15 w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-4xl font-bold">Your Library</h1>
          <p className="text-muted-foreground">
            {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Music className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No playlists yet</h3>
          <p className="mt-1 text-muted-foreground">
            Generate and save a playlist to see it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="group relative rounded-lg border p-4 hover:bg-accent/50 transition-colors">
              <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
                {playlist.songs[0]?.coverUrl ? (
                  <img
                    src={playlist.songs[0].coverUrl}
                    alt={playlist.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <Music className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium line-clamp-1">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created on {format(new Date(playlist.createdAt), 'MMM d, yyyy')}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Button 
                  size="sm" 
                  onClick={() => handlePlayPlaylist(playlist)}
                  className="flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  <span>Play</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(playlist.id!);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the playlist. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
