import React from 'react';
import { Platform } from '../types';

interface Props {
  platform: Platform;
  onPlatformChange: (p: Platform) => void;
}

export function Header({ platform, onPlatformChange }: Props) {
  const platforms: { id: Platform; label: string; }[] = [
    { id: 'tiktok', label: 'TikTok' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'twitter', label: 'Twitter/X' },
  ];

  return (
    <header className="h-16 border-b border-[#2D2D2D] px-4 lg:px-6 flex items-center justify-between bg-[#0A0A0A] shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
           <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
        </div>
        <div>
           <h1 className="text-lg font-bold tracking-tight text-[#F9FAFB] hidden sm:block">SosmedComment <span className="text-blue-500">v1.0</span></h1>
        </div>
      </div>
      
      <div className="hidden lg:flex bg-[#141414] p-1 rounded-xl border border-[#2D2D2D]">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => onPlatformChange(p.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              platform === p.id 
                ? 'bg-[#2D2D2D] text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-widest font-semibold">
        <span className="hidden sm:inline">ID</span>
        <div className="w-px h-3 bg-gray-700 hidden sm:block"></div>
        <span className="text-gray-700 hidden sm:inline">EN</span>
      </div>
    </header>
  );
}
