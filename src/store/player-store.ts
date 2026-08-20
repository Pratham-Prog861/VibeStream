
import { create } from 'zustand';
import { generateSongRecommendation, SongRecommendationInput } from '@/ai/flows/generate-playlist';

export type Song = {
  title: string;
  artist: string;
  videoId: string | null;
  coverUrl?: string;
  duration?: number;
  genre?: string;
  mood?: string;
  language?: string;
};

type PlayerState = {
  currentSong: Song;
  playlist: Song[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  previousVolume: number;
  progress: number;
  duration: number;
  isSeeking: boolean;
  isAutoRecommendationEnabled: boolean;
  isGeneratingRecommendations: boolean;
  playSong: (song: Song) => void;
  playFromQueue: (songs: Song[], startIndex?: number) => void;
  addToPlaylist: (songs: Song[]) => void;
  nextSong: () => void;
  previousSong: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  updateProgress: (progress: number, duration: number) => void;
  setSeeking: (seeking: boolean) => void;
  toggleAutoRecommendation: () => void;
  getSmartRecommendation: () => Promise<void>;
};

const normalizeSong = (song: Song): Song => ({
  ...song,
  coverUrl: song.coverUrl || `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`,
});

const clampVolume = (volume: number) => Math.max(0, Math.min(100, Math.round(volume)));

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: {
    title: 'Welcome to VibeStream!',
    artist: 'Select a song to start playing.',
    videoId: null,
    coverUrl: "https://placehold.co/64x64/222629/4DBA99.png",
  },
  playlist: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 50,
  previousVolume: 50,
  progress: 0,
  duration: 0,
  isSeeking: false,
  isAutoRecommendationEnabled: true,
  isGeneratingRecommendations: false,
  playSong: (song) => set((state) => {
    // If a new song is clicked, always play it.
    // If the same song is clicked, the play/pause logic is handled by the play/pause actions.
    if (state.currentSong.videoId !== song.videoId) {
      const normalizedSong = normalizeSong(song);
      // Check if song is already in playlist
      const existingIndex = state.playlist.findIndex(s => s.videoId === song.videoId);
      let newPlaylist = state.playlist;
      let newIndex = state.currentIndex;
        
      if (existingIndex === -1) {
        // Add new song to playlist
        newPlaylist = [...state.playlist, normalizedSong];
        newIndex = newPlaylist.length - 1;
      } else {
        // Song exists in playlist, set current index to it
        newIndex = existingIndex;
      }
        
      return { 
        currentSong: normalizedSong,
        playlist: newPlaylist,
        currentIndex: newIndex,
        isPlaying: true,
        progress: 0,
        duration: 0,
      }
    }
    // If it's the same song, just ensure it's set to play.
    // The player button's onClick will handle toggling.
    return { isPlaying: true };
  }),
  playFromQueue: (songs, startIndex = 0) => set(() => {
    if (!songs.length) return {};
    const queue = songs
      .filter((song) => !!song.videoId)
      .map((song) => normalizeSong(song));

    if (!queue.length) return {};

    const safeIndex = Math.max(0, Math.min(startIndex, queue.length - 1));
    return {
      playlist: queue,
      currentIndex: safeIndex,
      currentSong: queue[safeIndex],
      isPlaying: true,
      progress: 0,
      duration: 0,
    };
  }),
  addToPlaylist: (songs) => set((state) => {
    const existingIds = new Set(state.playlist.map((song) => song.videoId));
    const uniqueSongs = songs
      .filter((song) => !!song.videoId && !existingIds.has(song.videoId))
      .map((song) => normalizeSong(song));
    const newPlaylist = [...state.playlist, ...uniqueSongs];
    return { 
      playlist: newPlaylist,
      currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex
    };
  }),
  nextSong: () => set((state) => {
    if (state.playlist.length === 0 || state.currentIndex === -1) return {};
    
    const nextIndex = (state.currentIndex + 1) % state.playlist.length;
    const nextSong = normalizeSong(state.playlist[nextIndex]);
    
    return {
      currentSong: { 
        ...nextSong, 
        coverUrl: nextSong.coverUrl || `https://i.ytimg.com/vi/${nextSong.videoId}/hqdefault.jpg` 
      },
      currentIndex: nextIndex,
      isPlaying: true,
      progress: 0,
      duration: 0,
    };
  }),
  previousSong: () => set((state) => {
    if (state.playlist.length === 0 || state.currentIndex === -1) return {};
    
    const prevIndex = state.currentIndex === 0 ? state.playlist.length - 1 : state.currentIndex - 1;
    const prevSong = normalizeSong(state.playlist[prevIndex]);
    
    return {
      currentSong: { 
        ...prevSong, 
        coverUrl: prevSong.coverUrl || `https://i.ytimg.com/vi/${prevSong.videoId}/hqdefault.jpg` 
      },
      currentIndex: prevIndex,
      isPlaying: true,
      progress: 0,
      duration: 0,
    };
  }),
  play: () => set((state) => (state.currentSong.videoId ? { isPlaying: true } : {})),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set((state) => {
    const nextVolume = clampVolume(volume);
    return {
      volume: nextVolume,
      previousVolume: nextVolume > 0 ? nextVolume : state.previousVolume,
    };
  }),
  toggleMute: () => set((state) => {
    if (state.volume === 0) {
      return { volume: state.previousVolume || 50 };
    }
    return {
      previousVolume: state.volume > 0 ? state.volume : state.previousVolume,
      volume: 0,
    };
  }),
  updateProgress: (progress, duration) => set({ progress, duration }),
  setSeeking: (isSeeking) => set({ isSeeking }),
  toggleAutoRecommendation: () => set((state) => ({ 
    isAutoRecommendationEnabled: !state.isAutoRecommendationEnabled 
  })),
  getSmartRecommendation: async () => {
    const state = get();
    if (!state.currentSong.videoId || !state.isAutoRecommendationEnabled) return;
    
    try {
      set({ isGeneratingRecommendations: true });
      
      const input: SongRecommendationInput = {
        currentSongTitle: state.currentSong.title,
        currentSongArtist: state.currentSong.artist,
        genre: state.currentSong.genre,
        mood: state.currentSong.mood,
        language: state.currentSong.language,
      };
      
      const result = await generateSongRecommendation(input);
      
      if (result.recommendations.length > 0) {
        // Add recommended songs to playlist
        const recommendedSongs = result.recommendations.map(song => normalizeSong({
          title: song.title,
          artist: song.artist,
          videoId: song.youtubeId,
          coverUrl: `https://i.ytimg.com/vi/${song.youtubeId}/hqdefault.jpg`,
        }));
        
        set((state) => ({
          playlist: [...state.playlist, ...recommendedSongs],
          isGeneratingRecommendations: false
        }));
      } else {
        set({ isGeneratingRecommendations: false });
      }
    } catch (error) {
      console.error('Failed to get smart recommendation:', error);
      set({ isGeneratingRecommendations: false });
    }
  },
}));
