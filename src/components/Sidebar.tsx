import { Home, Flame, Music2, Library, Clock, ThumbsUp, ListMusic, Radio } from 'lucide-react';

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function Sidebar({ activeFilter, onFilterChange }: SidebarProps) {
  const mainItems = [
    { icon: Home, label: 'Home', filter: 'all' },
    { icon: Flame, label: 'Trending', filter: 'trending' },
    { icon: Music2, label: 'Music', filter: 'music' },
    { icon: Radio, label: 'Live', filter: 'live' },
  ];

  const libraryItems = [
    { icon: Library, label: 'Library', filter: 'library' },
    { icon: Clock, label: 'History', filter: 'history' },
    { icon: ThumbsUp, label: 'Liked Songs', filter: 'liked' },
    { icon: ListMusic, label: 'Playlists', filter: 'playlists' },
  ];

  const renderItem = (item: typeof mainItems[0]) => {
    const Icon = item.icon;
    const isActive = activeFilter === item.filter;
    return (
      <button
        key={item.filter}
        onClick={() => onFilterChange(item.filter)}
        className={`w-full flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
          isActive
            ? 'bg-[var(--color-yt-surface-hover)] text-white font-medium'
            : 'text-[var(--color-yt-text-secondary)] hover:bg-[var(--color-yt-surface)] hover:text-[var(--color-yt-text)]'
        }`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[var(--color-yt-red)]' : ''}`} />
        <span className="hidden lg:inline truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[72px] lg:w-[240px] bg-[var(--color-yt-darker)] border-r border-[var(--color-yt-border)]/30 overflow-y-auto z-40 hidden sm:block">
      <nav className="py-3">
        <div className="px-3 space-y-0.5">{mainItems.map(renderItem)}</div>
        <div className="my-3 mx-3 border-t border-[var(--color-yt-border)]/50" />
        <div className="px-3 space-y-0.5">
          <div className="px-3 py-2 hidden lg:block">
            <span className="text-xs font-semibold text-[var(--color-yt-text-secondary)] uppercase tracking-wider">Your Library</span>
          </div>
          {libraryItems.map(renderItem)}
        </div>
        <div className="my-3 mx-3 border-t border-[var(--color-yt-border)]/50" />
        <div className="px-6 py-3 hidden lg:block">
          <p className="text-[10px] text-[var(--color-yt-text-secondary)]">Built with ❤️ by Ignacio</p>
          <p className="text-[10px] text-[var(--color-yt-text-secondary)]/50 mt-1">© 2026 SongTube</p>
        </div>
      </nav>
    </aside>
  );
}
