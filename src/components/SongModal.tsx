import { useState, useEffect } from 'react';
import type { Song } from '../types';
import { X, Music2, Disc3 } from 'lucide-react';

interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (song: Omit<Song, 'id'>) => void;
  editingSong?: Song | null;
}

export default function SongModal({ isOpen, onClose, onSubmit, editingSong }: SongModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    url: '',
  });

  useEffect(() => {
    if (editingSong) {
      setFormData({
        title: editingSong.title || '',
        artist: editingSong.artist || '',
        album: editingSong.album || '',
        genre: editingSong.genre || '',
        url: editingSong.url || '',
      });
    } else {
      setFormData({ title: '', artist: '', album: '', genre: '', url: '' });
    }
  }, [editingSong, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const genres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Electronic', 'Classical', 'Country', 'Latin', 'K-Pop', 'Indie', 'Metal'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[var(--color-yt-surface)] rounded-2xl shadow-2xl border border-[var(--color-yt-border)] overflow-hidden slide-up">
        {/* Header gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-pink-500 to-orange-500" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
              {editingSong ? (
                <Disc3 className="w-5 h-5 text-white" />
              ) : (
                <Music2 className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-yt-text)]">
                {editingSong ? 'Edit Song' : 'Add New Song'}
              </h2>
              <p className="text-xs text-[var(--color-yt-text-secondary)]">
                {editingSong ? 'Update the song details' : 'Fill in the details to add a song'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-yt-text-secondary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--color-yt-text-secondary)] uppercase tracking-wider mb-1.5 block">
              Song Title *
            </label>
            <input
              type="text"
              required
              placeholder="Enter song title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-yt-text-secondary)] uppercase tracking-wider mb-1.5 block">
                Artist *
              </label>
              <input
                type="text"
                required
                placeholder="Artist name"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-yt-text-secondary)] uppercase tracking-wider mb-1.5 block">
                Album
              </label>
              <input
                type="text"
                placeholder="Album name"
                value={formData.album}
                onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-yt-text-secondary)] uppercase tracking-wider mb-1.5 block">
              Genre
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setFormData({ ...formData, genre })}
                  className={`genre-chip text-xs ${
                    formData.genre === genre
                      ? 'bg-[var(--color-yt-chip-active)] text-[var(--color-yt-dark)] font-semibold'
                      : 'bg-[var(--color-yt-chip)] text-[var(--color-yt-text-secondary)] hover:bg-[var(--color-yt-surface-hover)]'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type a custom genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-yt-text-secondary)] uppercase tracking-wider mb-1.5 block">
              URL (YouTube, Spotify, etc.)
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingSong ? 'Save Changes' : 'Add Song'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
