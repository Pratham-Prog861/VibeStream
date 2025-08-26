
import { create } from 'zustand';

export type Song = {
  title: string;
  artist: string;
  videoId: string | null;
  coverUrl?: string;
  duration?: number;
};

type PlayerState = {
  currentSong: Song;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  updateProgress: (progress: number, duration: number) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: {
    title: 'Welcome to VibeStream!',
    artist: 'Select a song to start playing.',
    videoId: null,
    coverUrl: "https://placehold.co/64x64/222629/4DBA99.png",
  },
  isPlaying: false,
  volume: 50,
  progress: 0,
  duration: 0,
  playSong: (song) => set((state) => {
    // If the same song is clicked, toggle play/pause.
    if (state.currentSong.videoId === song.videoId) {
      return { isPlaying: !state.isPlaying };
    }
    // If a new song is clicked, play it.
    return { 
      currentSong: { ...song, coverUrl: song.coverUrl || `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg` }, 
      isPlaying: true,
      progress: 0,
      duration: 0,
    }
  }),
  play: () => set((state) => (state.currentSong.videoId ? { isPlaying: true } : {})),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
  updateProgress: (progress, duration) => set({ progress, duration }),
}));
