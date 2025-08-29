
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import YouTube from 'react-youtube';
import type { YouTubePlayer } from 'react-youtube';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/store/player-store';

export default function MusicPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    volume,
    progress,
    duration,
    playlist,
    currentIndex,
    isSeeking,
    isAutoRecommendationEnabled,
    isGeneratingRecommendations,
    play, 
    pause, 
    setVolume,
    updateProgress,
    nextSong,
    previousSong,
    setSeeking,
    toggleAutoRecommendation,
    getSmartRecommendation
  } = usePlayerStore();
  
  const playerRef = useRef<YouTubePlayer | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Reset readiness state when the song changes
  useEffect(() => {
    setIsReady(false);
  }, [currentSong.videoId]);

  // Effect to control the YouTube player instance
  useEffect(() => {
    const player = playerRef.current;
    if (!isReady || !player || !currentSong.videoId) {
      return;
    }
  
    // Encapsulate player commands in a try-catch block
    // to gracefully handle cases where the player might not be available.
    const safePlayerAction = (action: () => void) => {
      try {
        // Check if player methods exist and player is in a valid state
        if (player && 
            typeof player.getPlayerState === 'function' && 
            typeof player.playVideo === 'function' &&
            typeof player.pauseVideo === 'function') {
          const playerState = player.getPlayerState();
          // Only proceed if player is in a valid state (not -1: unstarted)
          if (playerState !== -1 && playerState !== undefined) {
            action();
          }
        }
      } catch (e) {
        console.error("Player command failed:", e);
        // If player is in an invalid state, reset readiness
        setIsReady(false);
      }
    };
    
    if (isPlaying) {
      safePlayerAction(() => player.playVideo());
    } else {
      safePlayerAction(() => player.pauseVideo());
    }

  }, [isPlaying, isReady, currentSong.videoId]);

  // Effect to sync volume
  useEffect(() => {
    const player = playerRef.current;
    if (isReady && player && currentSong.videoId && typeof player.setVolume === 'function') {
      try {
        player.setVolume(volume);
      } catch (e) {
        console.error("Set volume failed:", e);
        setIsReady(false);
      }
    }
  }, [volume, isReady, currentSong.videoId]);
  
  const startProgressLoop = () => {
    stopProgressLoop();
    progressIntervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (player && 
          currentSong.videoId && 
          typeof player.getCurrentTime === 'function' && 
          typeof player.getDuration === 'function') {
        try {
          const currentTime = player.getCurrentTime();
          const totalDuration = player.getDuration();
          if (totalDuration > 0 && currentTime >= 0) {
            updateProgress(currentTime, totalDuration);
          }
        } catch (e) {
          console.error("Progress tracking failed:", e);
          stopProgressLoop();
        }
      }
    }, 1000);
  };
  
  const stopProgressLoop = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    try {
      playerRef.current = event.target;
      setIsReady(true);
    } catch (e) {
      console.error("Player ready failed:", e);
      setIsReady(false);
    }
  };
  
  const onPlayerStateChange = (event: { data: number }) => {
    try {
      // Don't change play state if we're currently seeking
      if (isSeeking) return;
      
      // Player state codes from YouTube Iframe API
      // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
      if (event.data === 1) { // Playing
        if(!isPlaying) play();
        startProgressLoop();
      } else if (event.data === 0) { // Ended
        if(isPlaying) pause();
        stopProgressLoop();
        
        // Auto-advance to next song if available
        if (playlist.length > 0 && currentIndex >= 0) {
          setTimeout(() => {
            nextSong();
          }, 1000); // Wait 1 second before auto-advancing
        } else if (isAutoRecommendationEnabled) {
          // If no more songs in playlist, get smart recommendations
          setTimeout(async () => {
            await getSmartRecommendation();
            // After getting recommendations, try to play next song
            if (playlist.length > 0) {
              nextSong();
            }
          }, 2000); // Wait 2 seconds before getting recommendations
        }
      } else { // Paused, Buffering etc.
        if(isPlaying) pause();
        stopProgressLoop();
      }
    } catch (e) {
      console.error("Player state change failed:", e);
      setIsReady(false);
    }
  };
  
  const onSliderChange = (value: number[]) => {
    const player = playerRef.current;
    if (player && isReady && currentSong.videoId && typeof player.seekTo === 'function') {
      try {
        const newTime = value[0];
        setSeeking(true);
        player.seekTo(newTime, true);
        updateProgress(newTime, duration);
        
        // Reset seeking flag after a short delay to allow the player to stabilize
        setTimeout(() => {
          setSeeking(false);
        }, 100);
      } catch (e) {
        console.error("Seek failed:", e);
        setIsReady(false);
        setSeeking(false);
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const canNavigate = playlist.length > 0 && currentIndex >= 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/80 backdrop-blur-xl shadow-2xl">
      <div className="flex h-28 items-center justify-between px-6 md:px-8 md:ml-64">
        {/* Song Info */}
        <div className="flex items-center gap-4 w-1/4">
          <Image
            src={currentSong.coverUrl || "https://placehold.co/64x64/222629/4DBA99.png"}
            alt="Album Art"
            width={72}
            height={72}
            className="rounded-lg object-cover shadow-md"
            data-ai-hint="album cover"
            unoptimized
          />
          <div className="hidden lg:block">
            <h3 className="font-semibold truncate text-foreground">{currentSong.title.length > 30 ? currentSong.title.slice(0, 30) + "..." : currentSong.title}</h3>
            <p className="text-sm text-foreground/70 truncate">{currentSong.artist}</p>
            {isGeneratingRecommendations && (
              <p className="text-xs text-accent animate-pulse">Finding similar songs...</p>
            )}
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-1 flex-col items-center gap-2 max-w-2xl">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              title="Shuffle"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              title="Previous"
              onClick={previousSong}
              disabled={!canNavigate}
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 hover:scale-105 transition-all"
              onClick={isPlaying ? pause : play}
              disabled={!currentSong.videoId}
            >
              {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 fill-current ml-1" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              title="Next"
              onClick={nextSong}
              disabled={!canNavigate}
            >
              <SkipForward className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-10 w-10 transition-colors ${
                isAutoRecommendationEnabled 
                  ? 'text-accent hover:text-accent/80 hover:bg-accent/20' 
                  : 'text-foreground/70 hover:text-foreground hover:bg-accent'
              }`}
              title={isAutoRecommendationEnabled ? "Auto-recommendations ON" : "Auto-recommendations OFF"}
              onClick={async () => {
                if (isGeneratingRecommendations) return;
                
                if (playlist.length === 0 || currentIndex >= playlist.length - 1) {
                  // If no more songs, get recommendations
                  await getSmartRecommendation();
                } else {
                  // Toggle auto-recommendations
                  toggleAutoRecommendation();
                }
              }}
              disabled={isGeneratingRecommendations}
            >
              {isGeneratingRecommendations ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Repeat className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="flex w-full items-center gap-3 text-xs text-foreground/70">
            <span className="min-w-[2.5rem] text-right font-mono">{formatTime(progress)}</span>
            <Slider 
              value={[progress]} 
              max={duration || 1} 
              step={1} 
              className="flex-1"
              onValueChange={onSliderChange}
            />
            <span className="min-w-[2.5rem] text-left font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 w-1/4 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-foreground/70 hover:text-foreground hover:bg-accent/20 transition-colors"
            onClick={() => setVolume(volume > 0 ? 0 : 50)}
            title={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Slider 
            value={[volume]} 
            max={100} 
            step={1} 
            className="w-24 hidden md:block" 
            onValueChange={(value) => setVolume(value[0])}
          />
        </div>
      </div>
      {currentSong.videoId && (
         <YouTube
            key={currentSong.videoId}
            videoId={currentSong.videoId}
            opts={{ 
              height: '0', 
              width: '0', 
              playerVars: { 
                autoplay: isPlaying ? 1 : 0,
                origin: typeof window !== 'undefined' ? window.location.origin : undefined
              } 
            }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            onError={(e: any) => {
              console.error('YT Player Error:', e);
              setIsReady(false);
            }}
            className="absolute -z-10"
         />
      )}
    </footer>
  );
}
