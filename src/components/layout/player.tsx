
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

  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      console.error("Player command failed", e);
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (playerRef.current && isReady && typeof playerRef.current.setVolume === 'function') {
        try {
            playerRef.current.setVolume(volume);
        } catch (e) {
            console.error("Set volume failed", e);
        }
    }
  }, [volume, isReady]);
  
  const startProgressLoop = () => {
    stopProgressLoop(); // Ensure no multiple loops are running
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function' && typeof playerRef.current.getDuration === 'function') {
        const currentTime = playerRef.current.getCurrentTime();
        const totalDuration = playerRef.current.getDuration();
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
    // We get the player from the event target to ensure it's the correct, active instance
    const player = event.target;
    if (typeof player.getPlayerState !== 'function') return;

    const playerState = player.getPlayerState();
    if (playerState === 1) { // Playing
      play();
      startProgressLoop();
    } else { // Paused, Ended, Buffering etc.
      pause();
      stopProgressLoop();
    }
  };
  
  const onSliderChange = (value: number[]) => {
    if (playerRef.current && isReady && typeof playerRef.current.seekTo === 'function') {
      const newTime = value[0];
      playerRef.current.seekTo(newTime, true);
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
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/80 backdrop-blur-sm">
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
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={isPlaying ? pause : play}
              disabled={!currentSong.videoId}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <SkipForward className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
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
            opts={{ height: '0', width: '0', playerVars: { autoplay: 1 } }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            onError={(e) => console.error('YT Player Error:', e)}
            className="absolute -z-10"
         />
      )}
    </footer>
  );
}
