import React from 'react';
import { Platform } from '../types';
import { Instagram, PlaySquare, Twitter } from 'lucide-react';

// Custom TikTok icon since Lucide doesn't have it natively sometimes
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface Props {
  platform: Platform;
  onChange: (p: Platform) => void;
}

export function PlatformSelector({ platform, onChange }: Props) {
  const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'tiktok', label: 'TikTok', icon: <TikTokIcon className="w-5 h-5 mr-2" /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5 mr-2" /> },
    { id: 'youtube', label: 'YouTube', icon: <PlaySquare className="w-5 h-5 mr-2" /> },
    { id: 'twitter', label: 'Twitter', icon: <Twitter className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex bg-[#141414] p-1 rounded-xl border border-[#2D2D2D] mb-4 overflow-x-auto custom-scrollbar">
      {platforms.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`flex items-center justify-center flex-1 py-2 px-4 min-w-[110px] rounded-lg text-sm font-medium transition-colors ${
            platform === p.id 
              ? 'bg-[#2D2D2D] text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {p.icon}
          {p.label}
        </button>
      ))}
    </div>
  );
}
