import React from 'react';
import { CommentState } from '../../types';
import { Heart, Moon, Sun } from 'lucide-react';
import { renderFormattedText } from '../../utils';

interface Props {
  state: CommentState;
  onThemeToggle?: () => void;
}

export function InstagramPreview({ state, onThemeToggle }: Props) {
  const isDark = state.theme === 'dark';
  const bgColor = isDark ? 'bg-black' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const mutedColor = isDark ? 'text-[#A8A8A8]' : 'text-gray-500';

  return (
    <div className={`w-fit max-w-lg sm:max-w-xl ${bgColor} p-4 text-left`}>
      <div className="flex items-start">
        {/* Avatar */}
        {state.avatarUrl && (
          <img src={state.avatarUrl} alt="Avatar" className={`w-8 h-8 rounded-full object-cover mr-3 bg-gray-200 shrink-0 ${isDark ? '' : 'border border-gray-100'}`} />
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <p className={`text-[14px] leading-tight break-words whitespace-pre-wrap ${textColor}`}>
            <span className="font-semibold mr-1 inline-flex items-center">
              {state.username.replace(/\s+/g, '').toLowerCase()}
              {state.isVerified && (
                <svg className="w-3.5 h-3.5 text-[#0095F6] ml-1 mb-0.5 inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
            </span>
            <span>{renderFormattedText(state.commentText)}</span>
          </p>
          
          <div className="flex flex-wrap items-center mt-2 gap-x-3 gap-y-1">
            <span className={`text-[12px] ${mutedColor} font-medium`}>
              {state.timestamp.replace(' lalu', '')}
            </span>
            {state.likeCount && (
              <span className={`text-[12px] ${mutedColor} font-medium`}>
                {state.likeCount} suka
              </span>
            )}
            <button className={`text-[12px] ${mutedColor} font-semibold ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
              Balas
            </button>
            <button className={`text-[12px] ${mutedColor} font-semibold ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
              Kirim
            </button>
          </div>
          
          {state.creatorLiked && (
            <div className="flex items-center mt-1">
              <img src={state.avatarUrl} alt="Creator" className="w-4 h-4 border border-white dark:border-black rounded-full" />
              <div className="bg-red-500 w-3 h-3 rounded-full flex items-center justify-center -ml-1 border-2 border-white dark:border-black z-10">
                <Heart className="w-2 h-2 text-white" fill="currentColor" />
              </div>
              <span className={`text-[11px] ml-1.5 ${mutedColor}`}>
                Disukai oleh pembuat
              </span>
            </div>
          )}

          {/* Thread indicator dummy */}
          <div className="flex items-center mt-2 cursor-pointer">
             <div className="w-6 h-[1px] bg-gray-300 mr-3"></div>
             <span className={`text-[12px] ${mutedColor} font-medium`}>Lihat terjemahan</span>
          </div>
        </div>
        
        {/* Like Button */}
        <div className="flex flex-col items-center pt-2 shrink-0">
          <Heart className={`w-3 h-3 ${isDark ? 'text-[#A8A8A8]' : 'text-gray-400'}`} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
