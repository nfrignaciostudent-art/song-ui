import { useState, useEffect, useCallback } from 'react';
import type { Song } from './types';
import { songApi, isUsingLocalData } from './api';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SongCard from './components/SongCard';
import SongModal from './components/SongModal';
import PlayerBar from './components/PlayerBar';
import VideoPlayer from './components/VideoPlayer';
import { Loader2, Music2, Plus, RefreshCw, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

const GENRE_CHIPS = ['All', 'Pop', 'Rock', 'Hip Hop', 'R&B', 'Jazz', 'Electronic', 'Classical', 'Country', 'Latin', 'K-Pop', 'Indie', 'Metal'];

function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Player state
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await songApi.getAll();
      setSongs(data);
      // Use the reliable flag from the API module
      setIsOffline(isUsingLocalData());
    } catch {
      setError('Could not connect to the Song API. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    let result = songs;
    if (activeGenre !== 'All') {
      result = result.filter(s => s.genre?.toLowerCase() === activeGenre.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.artist?.toLowerCase().includes(q) ||
        s.album?.toLowerCase().includes(q) ||
        s.genre?.toLowerCase().includes(q)
      );
    }
    setFilteredSongs(result);
  }, [songs, activeGenre, searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchSongs();
      return;
    }
    setLoading(true);
    try {
      const data = await songApi.search(searchQuery.trim());
      setSongs(data);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async (songData: Omit<Song, 'id'>) => {
    try {
      if (editingSong?.id) {
        await songApi.update(editingSong.id, songData);
      } else {
        await songApi.create(songData);
      }
      setEditingSong(null);
      fetchSongs();
    } catch {
      setError('Failed to save song.');
    }
  };

  const handleDelete = async (id: number) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }
    try {
      await songApi.delete(id);
      setDeleteConfirm(null);
      // If we deleted the currently playing song, stop playback
      if (currentSong?.id === id) {
        setCurrentSong(null);
        setIsPlaying(false);
        setShowVideoPlayer(false);
      }
      fetchSongs();
    } catch {
      setError('Failed to delete song.');
    }
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSong(null);
    setModalOpen(true);
  };

  // Playback handlers
  const handlePlay = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (song.youtubeId) {
      setShowVideoPlayer(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex <= 0 ? filteredSongs.length - 1 : currentIndex - 1;
    handlePlay(filteredSongs[prevIndex]);
  };

  const handleNext = () => {
    if (!currentSong || filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const nextIndex = currentIndex >= filteredSongs.length - 1 ? 0 : currentIndex + 1;
    handlePlay(filteredSongs[nextIndex]);
  };

  const handleClosePlayer = () => {
    setCurrentSong(null);
    setIsPlaying(false);
    setShowVideoPlayer(false);
    setVideoExpanded(false);
  };

  const hasPlayer = currentSong !== null;

  return (
    <div className="min-h-screen bg-[var(--color-yt-dark)]">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
      />
      <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Main content */}
      <main className={`pt-14 sm:pl-[72px] lg:pl-[240px] min-h-screen ${hasPlayer ? 'pb-20' : ''}`}>
        {/* Genre chips */}
        <div className="sticky top-14 z-30 bg-[var(--color-yt-dark)] border-b border-[var(--color-yt-border)]/30 px-6 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {GENRE_CHIPS.map(genre => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`genre-chip shrink-0 ${
                  activeGenre === genre
                    ? 'bg-[var(--color-yt-chip-active)] text-[var(--color-yt-dark)] font-semibold'
                    : 'bg-[var(--color-yt-chip)] text-[var(--color-yt-text-secondary)] hover:bg-[var(--color-yt-surface-hover)]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Offline banner */}
          {isOffline && (
            <div className="mb-4 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-2.5 rounded-xl fade-in">
              <WifiOff className="w-4 h-4 shrink-0" />
              <p className="text-xs flex-1">Playing demo songs — backend API is offline. Your changes are saved locally.</p>
              <Wifi className="w-3 h-3 opacity-50" />
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl fade-in">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm flex-1">{error}</p>
              <button onClick={() => setError(null)} className="text-red-300 hover:text-white text-sm font-medium">
                Dismiss
              </button>
            </div>
          )}

          {/* Delete confirm toast */}
          {deleteConfirm !== null && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-yt-surface)] border border-[var(--color-yt-border)] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 slide-up" style={{ bottom: hasPlayer ? '5rem' : '1.5rem' }}>
              <span className="text-sm text-[var(--color-yt-text)]">Click delete again to confirm</span>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="text-sm font-semibold text-red-400 hover:text-red-300"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-sm text-[var(--color-yt-text-secondary)] hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 fade-in">
              <Loader2 className="w-10 h-10 text-[var(--color-yt-red)] mb-4" style={{ animation: 'spin 1s linear infinite' }} />
              <p className="text-[var(--color-yt-text-secondary)] text-sm">Loading your music...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredSongs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 fade-in">
              <div className="w-20 h-20 rounded-full bg-[var(--color-yt-surface)] flex items-center justify-center mb-6">
                <Music2 className="w-10 h-10 text-[var(--color-yt-text-secondary)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-yt-text)] mb-2">
                {searchQuery || activeGenre !== 'All' ? 'No songs found' : 'Your library is empty'}
              </h3>
              <p className="text-[var(--color-yt-text-secondary)] text-sm mb-6 max-w-md text-center">
                {searchQuery || activeGenre !== 'All'
                  ? 'Try a different search or filter'
                  : 'Start building your music collection by adding your first song'}
              </p>
              <div className="flex gap-3">
                {(searchQuery || activeGenre !== 'All') && (
                  <button
                    onClick={() => { setSearchQuery(''); setActiveGenre('All'); fetchSongs(); }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Clear Filters
                  </button>
                )}
                <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Song
                </button>
              </div>
            </div>
          )}

          {/* Song grid */}
          {!loading && filteredSongs.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[var(--color-yt-text)]">
                  {activeGenre === 'All' ? 'All Songs' : activeGenre}
                  <span className="ml-2 text-xs text-[var(--color-yt-text-secondary)] font-normal">
                    {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
                  </span>
                </h2>
                <button onClick={fetchSongs} className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors" title="Refresh">
                  <RefreshCw className="w-4 h-4 text-[var(--color-yt-text-secondary)]" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {filteredSongs.map((song, i) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPlay={handlePlay}
                    index={i}
                    isPlaying={currentSong?.id === song.id && isPlaying}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Song Modal */}
      <SongModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingSong(null); }}
        onSubmit={handleAddOrUpdate}
        editingSong={editingSong}
      />

      {/* Video Player (expanded) */}
      {showVideoPlayer && currentSong && (
        <VideoPlayer
          song={currentSong}
          onClose={handleClosePlayer}
          isExpanded={videoExpanded}
          onToggleExpand={() => setVideoExpanded(!videoExpanded)}
        />
      )}

      {/* Now Playing Bar */}
      {currentSong && !videoExpanded && (
        <PlayerBar
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onExpand={() => { setShowVideoPlayer(true); setVideoExpanded(true); }}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}

export default App;
