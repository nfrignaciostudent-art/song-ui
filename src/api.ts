import axios from 'axios';
import type { Song } from './types';
import { demoSongs } from './data/demoSongs';

const API_BASE = import.meta.env.VITE_API_URL || 'https://song-api-1-23oa.onrender.com';
const API = `${API_BASE}/ignacio/songs`;

// In-memory store for when the backend is down
let localSongs: Song[] = [...demoSongs];
let nextId = Math.max(...localSongs.map(s => s.id || 0)) + 1;
let useLocal = false;

// Extract YouTube video ID from various URL formats
export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Enrich song with youtubeId if not present
function enrichSong(song: Song): Song {
  if (!song.youtubeId && song.url) {
    song.youtubeId = extractYoutubeId(song.url) || undefined;
  }
  return song;
}

export const songApi = {
  getAll: async (): Promise<Song[]> => {
    try {
      const response = await axios.get<Song[]>(API, { timeout: 10000 });
      const songs = response.data.map(enrichSong);
      if (songs.length === 0) {
        // Backend is up but DB is empty (e.g. Render cold-start wiped H2)
        // Fall back to demo songs so the page is never blank
        console.log('Backend returned empty list, using demo songs');
        useLocal = true;
        return [...localSongs];
      }
      useLocal = false;
      return songs;
    } catch {
      // Backend is down — use local demo songs
      console.log('Backend unreachable, using demo songs');
      useLocal = true;
      return [...localSongs];
    }
  },

  getById: async (id: number): Promise<Song> => {
    if (useLocal) {
      const song = localSongs.find(s => s.id === id);
      if (song) return { ...song };
      throw new Error('Song not found');
    }
    const response = await axios.get<Song>(`${API}/${id}`);
    return enrichSong(response.data);
  },

  create: async (song: Omit<Song, 'id'>): Promise<Song> => {
    if (useLocal) {
      const newSong: Song = {
        ...song,
        id: nextId++,
        youtubeId: song.youtubeId || extractYoutubeId(song.url) || undefined,
      };
      localSongs.push(newSong);
      return { ...newSong };
    }
    const response = await axios.post<Song>(API, song);
    return enrichSong(response.data);
  },

  update: async (id: number, song: Omit<Song, 'id'>): Promise<Song> => {
    if (useLocal) {
      const index = localSongs.findIndex(s => s.id === id);
      if (index !== -1) {
        localSongs[index] = {
          ...song,
          id,
          youtubeId: song.youtubeId || extractYoutubeId(song.url) || undefined,
        };
        return { ...localSongs[index] };
      }
      throw new Error('Song not found');
    }
    const response = await axios.put<Song>(`${API}/${id}`, song);
    return enrichSong(response.data);
  },

  delete: async (id: number): Promise<void> => {
    if (useLocal) {
      localSongs = localSongs.filter(s => s.id !== id);
      return;
    }
    await axios.delete(`${API}/${id}`);
  },

  search: async (keyword: string): Promise<Song[]> => {
    if (useLocal) {
      const q = keyword.toLowerCase();
      return localSongs.filter(
        s =>
          s.title?.toLowerCase().includes(q) ||
          s.artist?.toLowerCase().includes(q) ||
          s.album?.toLowerCase().includes(q) ||
          s.genre?.toLowerCase().includes(q)
      );
    }
    try {
      const response = await axios.get<Song[]>(`${API}/search/${keyword}`, { timeout: 8000 });
      return response.data.map(enrichSong);
    } catch {
      // Fallback to local search
      const q = keyword.toLowerCase();
      return localSongs.filter(
        s =>
          s.title?.toLowerCase().includes(q) ||
          s.artist?.toLowerCase().includes(q) ||
          s.album?.toLowerCase().includes(q) ||
          s.genre?.toLowerCase().includes(q)
      );
    }
  },
};
