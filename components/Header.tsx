
import React from 'react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const titles: Record<AppTab, string> = {
    [AppTab.MALA]: 'Ananta Naam',
    [AppTab.HISTORY]: 'Journey',
    [AppTab.SETTINGS]: 'Setup'
  };

  const subtitles: Record<AppTab, string> = {
    [AppTab.MALA]: 'Meditation',
    [AppTab.HISTORY]: 'Your Stats',
    [AppTab.SETTINGS]: 'Preferences'
  };

  return (
    <header className="px-4 py-3 text-center bg-white/80 backdrop-blur-md z-10 border-b border-slate-100 flex-none">
      <h1 className="text-xl font-devotional tracking-[0.2em] text-amber-600 font-bold drop-shadow-sm">
        {titles[activeTab].toUpperCase()}
      </h1>
      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em]">
        {subtitles[activeTab]}
      </p>
    </header>
  );
};

export default Header;
