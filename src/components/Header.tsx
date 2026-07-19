import React from 'react';
import { Platform } from '../types';
import { TikTokColoredIcon, InstagramColoredIcon, YouTubeColoredIcon, TwitterColoredIcon, KickColoredIcon } from './icons';
import { Moon, Sun } from 'lucide-react';

interface Props {
  platform: Platform;
  theme: 'light' | 'dark';
  onPlatformChange: (p: Platform) => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function Header({ platform, theme, onPlatformChange, onThemeChange }: Props) {
  const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'tiktok', label: 'TikTok', icon: <TikTokColoredIcon className="w-5 h-5" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramColoredIcon className="w-6 h-6" /> },
    { id: 'youtube', label: 'YouTube', icon: <YouTubeColoredIcon className="w-6 h-6" /> },
    { id: 'twitter', label: 'Twitter/X', icon: <TwitterColoredIcon className="w-6 h-6" /> },
    { id: 'kick_live', label: 'Kick Live', icon: <KickColoredIcon className="w-5 h-5" fontSize="14px" /> },
  ];

  return (
    <header className="h-16 px-4 lg:px-6 flex items-center justify-between bg-[var(--panel-bg-translucent)] backdrop-blur-xl border-b border-[var(--panel-border)] shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-sm">
           <div className="w-4 h-4 border-2 border-white rounded-[4px]"></div>
        </div>
        <div>
           <h1 className="text-xl font-semibold tracking-tight text-[var(--root-fg)] hidden sm:block">SocialCanvas</h1>
        </div>
      </div>
      
      <div className="hidden lg:flex bg-[var(--root-bg)] p-1 rounded-full items-center gap-1">
        {platforms.map((p) => (
          <button
            key={p.id}
            title={p.label}
            onClick={() => onPlatformChange(p.id)}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              platform === p.id 
                ? 'bg-[var(--panel-bg)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-105 z-10' 
                : 'hover:bg-[var(--button-hover)] opacity-60 hover:opacity-100 z-0'
            }`}
          >
            {p.icon}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--root-bg)] text-[var(--root-fg)] hover:bg-[var(--button-hover)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
