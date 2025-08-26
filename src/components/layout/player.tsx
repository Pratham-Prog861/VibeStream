
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
    play, 
    pause, 
    setVolume,
    updateProgress
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
    if (!isReady || !player) {
      return;
    }
  
    // Encapsulate player commands in a try-catch block
    // to gracefully handle cases where the player might not be available.
    const safePlayerAction = (action: () => void) => {
      try {
        if (typeof player.getPlayerState === 'function' && player.getPlayerState() !== -1) {
            action();
        }
      } catch (e) {
        console.error("Player command failed:", e);
      }
    };
    
    if (isPlaying) {
      safePlayerAction(() => player.playVideo());
    } else {
      safePlayerAction(() => player.pauseVideo());
    }

  }, [isPlaying, isReady]);

  // Effect to sync volume
  useEffect(() => {
    const player = playerRef.current;
    if (isReady && player && typeof player.setVolume === 'function') {
      try {
        player.setVolume(volume);
      } catch (e) {
        console.error("Set volume failed:", e);
      }
    }
  }, [volume, isReady]);
  
  const startProgressLoop = () => {
    stopProgressLoop();
    progressIntervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
        const currentTime = player.getCurrentTime();
        const totalDuration = player.getDuration();
        if (totalDuration > 0) {
          updateProgress(currentTime, totalDuration);
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
    playerRef.current = event.target;
    setIsReady(true);
  };
  
  const onPlayerStateChange = (event: { data: number }) => {
    // Player state codes from YouTube Iframe API
    // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: video cued
    if (event.data === 1) { // Playing
      if(!isPlaying) play();
      startProgressLoop();
    } else { // Paused, Ended, Buffering etc.
      if(isPlaying) pause();
      stopProgressLoop();
    }
  };
  
  const onSliderChange = (value: number[]) => {
    const player = playerRef.current;
    if (player && isReady && typeof player.seekTo === 'function') {
      const newTime = value[0];
      player.seekTo(newTime, true);
      updateProgress(newTime, duration);
    }
  };
  
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/70 backdrop-blur-md">
      <div className="flex h-24 items-center justify-between px-4 md:px-6 md:ml-64">
        {/* Song Info */}
        <div className="flex items-center gap-4 w-1/4">
          <Image
            src={currentSong.coverUrl || "https://placehold.co/64x64/222629/4DBA99.png"}
            alt="Album Art"
            width={64}
            height={64}
            className="rounded-md object-cover"
            data-ai-hint="album cover"
            unoptimized
          />
          <div className="hidden lg:block">
            <h3 className="font-semibold truncate">{currentSong.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-1 flex-col items-center gap-2 max-w-2xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent/20">
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent/20">
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full bg-accent text-accent-foreground shadow-md hover:bg-accent/90"
              onClick={isPlaying ? pause : play}
              disabled={!currentSong.videoId}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent/20">
              <SkipForward className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent/20">
              <Repeat className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <Slider 
              value={[progress]} 
              max={duration || 1} 
              step={1} 
              className="flex-1"
              onValueChange={onSliderChange}
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          <Button variant="ghost" size="icon" onClick={() => setVolume(volume > 0 ? 0 : 50)}>
            {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Slider value={[volume]} max={100} step={1} className="w-24 hidden md:block" onValueChange={(value) => setVolume(value[0])}/>
        </div>
      </div>
      {currentSong.videoId && (
         <YouTube
            key={currentSong.videoId}
            videoId={currentSong.videoId}
            opts={{ height: '0', width: '0', playerVars: { autoplay: isPlaying ? 1 : 0 } }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            onError={(e: any) => console.error('YT Player Error:', e)}
            className="absolute -z-10"
         />
      )}
    </footer>
  );
}
