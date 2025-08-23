'use client';

import Image from 'next/image';
import YouTube from 'react-youtube';
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
  const { currentSong, isPlaying, volume, play, pause, setVolume } = usePlayerStore();

  const onPlayerReady = (event: any) => {
    // access to player in all event handlers via event.target
    event.target.setVolume(volume);
  };

  const onPlayerStateChange = (event: any) => {
    // event.data can be:
    // -1 (unstarted)
    // 0 (ended)
    // 1 (playing)
    // 2 (paused)
    // 3 (buffering)
    // 5 (video cued)
    if (event.data === 1) {
      play();
    } else if (event.data === 2) {
      pause();
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-24 items-center justify-between px-4 md:px-6 md:ml-64">
        {/* Song Info */}
        <div className="flex items-center gap-4 w-1/4">
          <Image
            src={currentSong.videoId ? `https://img.youtube.com/vi/${currentSong.videoId}/0.jpg` : "https://placehold.co/64x64/222629/4DBA99.png"}
            alt="Album Art"
            width={64}
            height={64}
            className="rounded-md"
            data-ai-hint="album cover"
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
            <span>1:23</span>
            <Slider defaultValue={[33]} max={100} step={1} className="flex-1" />
            <span>3:45</span>
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
            videoId={currentSong.videoId}
            opts={{ height: '0', width: '0' }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            className="absolute -z-10"
         />
      )}
    </footer>
  );
}
