
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
  progress: number;
  duration: number;
  isSeeking: boolean;
  isAutoRecommendationEnabled: boolean;
  isGeneratingRecommendations: boolean;
  playSong: (song: Song) => void;
  addToPlaylist: (songs: Song[]) => void;
  nextSong: () => void;
  previousSong: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  updateProgress: (progress: number, duration: number) => void;
  setSeeking: (seeking: boolean) => void;
  toggleAutoRecommendation: () => void;
  getSmartRecommendation: () => Promise<void>;
};

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
  progress: 0,
  duration: 0,
  isSeeking: false,
  isAutoRecommendationEnabled: true,
  isGeneratingRecommendations: false,
  playSong: (song) => set((state) => {
    // If a new song is clicked, always play it.
    // If the same song is clicked, the play/pause logic is handled by the play/pause actions.
    if (state.currentSong.videoId !== song.videoId) {
      // Check if song is already in playlist
      const existingIndex = state.playlist.findIndex(s => s.videoId === song.videoId);
      let newPlaylist = state.playlist;
      let newIndex = state.currentIndex;
      
      if (existingIndex === -1) {
        // Add new song to playlist
        newPlaylist = [...state.playlist, song];
        newIndex = newPlaylist.length - 1;
      } else {
        // Song exists in playlist, set current index to it
        newIndex = existingIndex;
      }
      
      return { 
        currentSong: { ...song, coverUrl: song.coverUrl || `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg` }, 
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
  addToPlaylist: (songs) => set((state) => {
    const newPlaylist = [...state.playlist, ...songs];
    return { 
      playlist: newPlaylist,
      currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex
    };
  }),
  nextSong: () => set((state) => {
    if (state.playlist.length === 0 || state.currentIndex === -1) return {};
    
    const nextIndex = (state.currentIndex + 1) % state.playlist.length;
    const nextSong = state.playlist[nextIndex];
    
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
    const prevSong = state.playlist[prevIndex];
    
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
  setVolume: (volume) => set({ volume }),
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
        const recommendedSongs = result.recommendations.map(song => ({
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
