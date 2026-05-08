import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Menu,
  Plus,
  Music2,
  Upload,
  Bell,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onAddNew: () => void;
}

export default function Header({ searchQuery, onSearchChange, onSearch, onAddNew }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-[var(--color-yt-darker)]/95 backdrop-blur-lg border-b border-[var(--color-yt-border)]/50">
      {/* Left Section */}
      <div className="flex items-center gap-4 shrink-0">
        <button className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors">
          <Menu className="w-5 h-5 text-[var(--color-yt-text)]" />
        </button>
        <a href="/" className="flex items-center gap-1 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 group-hover:from-red-500 group-hover:to-red-600 transition-all shadow-lg shadow-red-900/20">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--color-yt-text)] hidden sm:inline ml-1">
            Song<span className="text-[var(--color-yt-red)]">Tube</span>
          </span>
        </a>
      </div>

      {/* Center Search */}
      <div className={`flex-1 max-w-2xl mx-4 ${mobileSearchOpen ? 'flex' : 'hidden sm:flex'} items-center`}>
        <div className={`flex-1 flex items-center border rounded-full overflow-hidden transition-all duration-200 ${
          searchFocused 
            ? 'border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]' 
            : 'border-[var(--color-yt-border)]'
        }`}>
          {searchFocused && (
            <div className="pl-4">
              <Search className="w-4 h-4 text-[var(--color-yt-text-secondary)]" />
            </div>
          )}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-[var(--color-yt-surface)] text-[var(--color-yt-text)] text-sm py-2 px-4 outline-none placeholder:text-[var(--color-yt-text-secondary)]"
          />
          <button
            onClick={onSearch}
            className="px-5 py-2 bg-[var(--color-yt-surface-hover)] border-l border-[var(--color-yt-border)] hover:bg-[var(--color-yt-chip)] transition-colors"
          >
            <Search className="w-4 h-4 text-[var(--color-yt-text-secondary)]" />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Mobile search toggle */}
        <button
          className="sm:hidden p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        >
          <Search className="w-5 h-5 text-[var(--color-yt-text)]" />
        </button>

        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors group"
        >
          <div className="p-0.5 rounded-full">
            <Plus className="w-5 h-5 text-[var(--color-yt-text)]" />
          </div>
          <span className="text-sm font-medium text-[var(--color-yt-text)] hidden md:inline">Create</span>
        </button>

        <button className="p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors hidden sm:flex">
          <Upload className="w-5 h-5 text-[var(--color-yt-text)]" />
        </button>

        <button className="relative p-2 rounded-full hover:bg-[var(--color-yt-surface-hover)] transition-colors hidden sm:flex">
          <Bell className="w-5 h-5 text-[var(--color-yt-text)]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-yt-red)] rounded-full"></span>
        </button>

        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white ml-2 hover:opacity-90 transition-opacity shadow-lg">
          N
        </button>
      </div>
    </header>
  );
}
