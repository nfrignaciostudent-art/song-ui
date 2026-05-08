import type { Song } from '../types';
import {
  Play,
  Trash2,
  Edit3,
  MoreVertical,
  Music,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

interface SongCardProps {
  song: Song;
  onEdit: (song: Song) => void;
  onDelete: (id: number) => void;
  onPlay: (song: Song) => void;
  index: number;
  isPlaying?: boolean;
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
  'from-indigo-600 via-blue-500 to-violet-400',
  'from-amber-600 via-orange-500 to-red-400',
];

export default function SongCard({ song, onEdit, onDelete, onPlay, index, isPlaying }: SongCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const gradientClass = GRADIENT_COVERS[index % GRADIENT_COVERS.length];

  const handleOpenUrl = () => {
    if (song.url) {
      window.open(song.url, '_blank', 'noopener,noreferrer');
    }
  };

  // YouTube thumbnail or gradient
  const thumbnailUrl = song.youtubeId
    ? `https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`
    : null;

  return (
    <div
      className={`group cursor-pointer fade-in ${isPlaying ? 'ring-2 ring-[var(--color-yt-red)] rounded-xl' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowMenu(false); }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
        {thumbnailUrl ? (
          /* Real YouTube thumbnail */
          <img
            src={thumbnailUrl}
            alt={song.title}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
            loading="lazy"
          />
        ) : (
          /* Gradient fallback */
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <Music className={`w-12 h-12 text-white/40 transition-transform duration-500 ${isHovered ? 'scale-110 rotate-12' : ''}`} />
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-20 h-20 rounded-full border border-white/30 animate-pulse" />
              <div className="absolute bottom-6 right-6 w-14 h-14 rounded-full border border-white/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10" />
            </div>
          </div>
        )}

        {/* Now playing indicator */}
        {isPlaying && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-[var(--color-yt-red)] text-white text-[10px] px-2.5 py-1 rounded-full font-semibold shadow-lg z-10">
            <span className="now-playing-bars">
              <span /><span /><span />
            </span>
            NOW PLAYING
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); onPlay(song); }}
            className={`w-12 h-12 rounded-full bg-[var(--color-yt-red)] hover:bg-[var(--color-yt-red-dark)] flex items-center justify-center transition-all duration-300 shadow-xl ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </button>
        </div>

        {/* Genre badge */}
        {song.genre && (
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
            {song.genre}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3">
        {/* Artist avatar */}
        <div className={`w-9 h-9 shrink-0 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center mt-0.5`}>
          <span className="text-xs font-bold text-white">
            {song.artist ? song.artist.charAt(0).toUpperCase() : '?'}
          </span>
        </div>

        {/* Text info */}
        <div className="flex-1 min-w-0" onClick={() => onPlay(song)}>
          <h3 className="text-sm font-medium text-[var(--color-yt-text)] leading-5 line-clamp-2 group-hover:text-white transition-colors">
            {song.title || 'Untitled Song'}
          </h3>
          <p className="text-xs text-[var(--color-yt-text-secondary)] mt-0.5 hover:text-[var(--color-yt-text)] transition-colors truncate">
            {song.artist || 'Unknown Artist'}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs text-[var(--color-yt-text-secondary)]">{song.album || 'Single'}</span>
            {song.youtubeId && (
              <>
                <span className="text-[var(--color-yt-text-secondary)]">•</span>
                <span className="text-xs text-[var(--color-yt-red)] font-medium">▶ YouTube</span>
              </>
            )}
          </div>
        </div>

        {/* Action menu */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className={`p-1 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-all ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <MoreVertical className="w-5 h-5 text-[var(--color-yt-text-secondary)]" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-[var(--color-yt-surface)] rounded-xl shadow-2xl border border-[var(--color-yt-border)] overflow-hidden z-50 fade-in">
              <button
                onClick={(e) => { e.stopPropagation(); onPlay(song); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-yt-text)] hover:bg-[var(--color-yt-surface-hover)] transition-colors"
              >
                <Play className="w-4 h-4" />
                Play now
              </button>
              {song.url && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenUrl(); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-yt-text)] hover:bg-[var(--color-yt-surface-hover)] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in YouTube
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(song); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-yt-text)] hover:bg-[var(--color-yt-surface-hover)] transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit song
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (song.id) onDelete(song.id); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete song
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
