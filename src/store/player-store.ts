import { create } from 'zustand';

type Song = {
  title: string;
  artist: string;
  videoId: string | null;
};

type PlayerState = {
  currentSong: Song;
  isPlaying: boolean;
  volume: number;
  playSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: {
    title: 'Cosmic Echoes',
    artist: 'Galaxy Drifters',
    videoId: null,
  },
  isPlaying: false,
  volume: 50,
  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
}));
