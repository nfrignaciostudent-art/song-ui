import type { Song } from '../types';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface VideoPlayerProps {
  song: Song;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function VideoPlayer({ song, onClose, isExpanded, onToggleExpand }: VideoPlayerProps) {
  const videoId = song.youtubeId;

  if (!videoId) {
    return (
      <div className={`video-player ${isExpanded ? 'video-player-expanded' : 'video-player-mini'} fade-in`}>
        <div className="flex items-center justify-center h-full bg-[var(--color-yt-darker)]">
          <p className="text-[var(--color-yt-text-secondary)] text-sm">No video available for this song</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-player ${isExpanded ? 'video-player-expanded' : 'video-player-mini'} slide-up`}>
      {/* Controls overlay */}
      <div className="video-player-controls">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4 text-white" />
            ) : (
              <Maximize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all"
            title="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* YouTube iframe */}
      <div className="video-player-frame">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={song.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Song info bar (mini mode only) */}
      {!isExpanded && (
        <div className="video-player-info">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{song.title}</p>
            <p className="text-xs text-white/60 truncate">{song.artist}</p>
          </div>
        </div>
      )}
    </div>
  );
}
