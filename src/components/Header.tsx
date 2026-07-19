import React from 'react';
import { Platform } from '../types';
import { TikTokColoredIcon, InstagramColoredIcon, YouTubeColoredIcon, TwitterColoredIcon, KickColoredIcon } from './icons';
import { Moon, Sun, Home, User, Sparkles } from 'lucide-react';
import { CapybaraLogo } from './CapybaraLogo';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
}

interface Props {
  platform: Platform;
  theme: 'light' | 'dark';
  onPlatformChange: (p: Platform) => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onGoHome: () => void;
  onLoginClick: () => void;
  currentUser: UserProfile | null;
  isPremium: boolean;
  onUpgradeClick: () => void;
}

export function Header({ 
  platform, 
  theme, 
  onPlatformChange, 
  onThemeChange, 
  onGoHome, 
  onLoginClick, 
  currentUser,
  isPremium,
  onUpgradeClick
}: Props) {
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
        <div 
          onClick={onGoHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none hover:opacity-90 active:scale-95 transition-all"
          title="Kembali ke Beranda"
        >
          <CapybaraLogo className="w-9 h-9 drop-shadow-sm shrink-0 hover:rotate-6 transition-transform duration-300" />
          <h1 
            className={`text-xl font-black tracking-tight transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            SocialCanvas
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Home text button */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-1 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[var(--button-hover)] cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Beranda</span>
        </button>

        {/* User Account Button */}
        {currentUser ? (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--root-bg)] border border-[var(--panel-border)] text-xs font-bold hover:bg-[var(--button-hover)] text-[var(--root-fg)] transition-all cursor-pointer"
            title={`${currentUser.name} (${isPremium ? 'Akun PRO' : 'Akun Free'})`}
          >
            <div className={`p-[1.5px] rounded-full flex items-center justify-center shrink-0 ${
              isPremium 
                ? 'bg-gradient-to-tr from-blue-500 via-indigo-500 to-pink-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]' 
                : 'bg-gray-400/50 dark:bg-gray-600'
            }`}>
              <img src={currentUser.avatar} alt="User Avatar" className="w-5 h-5 rounded-full object-cover border border-[var(--root-bg)]" referrerPolicy="no-referrer" />
            </div>
            <span className="max-w-[70px] sm:max-w-[100px] truncate hidden sm:inline">{currentUser.name}</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--root-bg)] border border-[var(--panel-border)] text-xs font-bold hover:bg-[var(--button-hover)] text-[var(--root-fg)] transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </button>
        )}

        <button
          onClick={onThemeChange}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--root-bg)] text-[var(--root-fg)] hover:bg-[var(--button-hover)] transition-colors cursor-pointer"
          title={`Switch Theme`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
