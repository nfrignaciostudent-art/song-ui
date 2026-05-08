import type { Song } from '../types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Music,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface PlayerBarProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onExpand: () => void;
  onClose: () => void;
}

const GRADIENT_COVERS = [
  'from-red-600 via-pink-500 to-orange-400',
  'from-blue-600 via-purple-500 to-indigo-400',
  'from-green-600 via-teal-500 to-cyan-400',
  'from-purple-600 via-violet-500 to-fuchsia-400',
  'from-orange-600 via-amber-500 to-yellow-400',
  'from-cyan-600 via-sky-500 to-blue-400',
  'from-pink-600 via-rose-500 to-red-400',
  'from-emerald-600 via-green-500 to-lime-400',
];

export default function PlayerBar({
  song,
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onExpand,
  onClose,
}: PlayerBarProps) {
  const [progress, setProgress] = useState(0);
  const gradientClass = GRADIENT_COVERS[(song.id || 0) % GRADIENT_COVERS.length];

  // Simulate progress animation
  useEffect(() => {
    if (!isPlaying) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 0.3;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, song.id]);

  return (
    <div className="player-bar slide-up">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10">
        <div
          className="h-full bg-[var(--color-yt-red)] transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-4 h-full px-4 max-w-screen-2xl mx-auto">
        {/* Song info (left) */}
        <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={onExpand}>
          {/* Mini album art */}
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center shrink-0 shadow-lg`}>
            <Music className="w-5 h-5 text-white/60" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-yt-text)] truncate">
              {song.title}
            </p>
            <p className="text-xs text-[var(--color-yt-text-secondary)] truncate">
              {song.artist} {song.album ? `• ${song.album}` : ''}
            </p>
          </div>
        </div>

        {/* Playback controls (center) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 text-[var(--color-yt-text)]" fill="currentColor" />
          </button>
          <button
            onClick={onPlayPause}
            className="p-2.5 rounded-full bg-white hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-[var(--color-yt-dark)]" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 text-[var(--color-yt-dark)] ml-0.5" fill="currentColor" />
            )}
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors"
            title="Next"
          >
            <SkipForward className="w-5 h-5 text-[var(--color-yt-text)]" fill="currentColor" />
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 flex-1 justify-end">
          <button className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors hidden sm:flex">
            <Volume2 className="w-4 h-4 text-[var(--color-yt-text-secondary)]" />
          </button>
          <button
            onClick={onExpand}
            className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors"
            title="Expand player"
          >
            <Maximize2 className="w-4 h-4 text-[var(--color-yt-text-secondary)]" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors"
            title="Close player"
          >
            <X className="w-4 h-4 text-[var(--color-yt-text-secondary)]" />
          </button>
        </div>
      </div>
    </div>
  );
}
