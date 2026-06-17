import React from 'react';
import { CommentState } from '../../types';
import { ThumbsDown, ThumbsUp, Moon, Sun } from 'lucide-react';
import { renderFormattedText } from '../../utils';

interface Props {
  state: CommentState;
  onThemeToggle?: () => void;
}

export function YouTubePreview({ state, onThemeToggle }: Props) {
  const isDark = state.theme === 'dark';
  
  const bgColor = isDark ? 'bg-[#0F0F0F]' : 'bg-white';
  const textColor = isDark ? 'text-[#F1F1F1]' : 'text-[#0F0F0F]';
  const mutedColor = isDark ? 'text-[#AAAAAA]' : 'text-[#606060]';
  const btnHover = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const linkColor = isDark ? 'text-[#3EA6FF]' : 'text-[#065FD4]';

  return (
    <div className={`relative group w-full ${bgColor} p-4 text-left`} style={{ fontFamily: '"Roboto", Arial, sans-serif' }}>
      {onThemeToggle && (
        <button 
          onClick={onThemeToggle}
          className="absolute -right-12 top-0 p-2 rounded-full bg-[#141414] hover:bg-[#2D2D2D] border border-[#2D2D2D] text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      )}
      <div className="flex items-start">
        {/* Avatar */}
        <img src={state.avatarUrl} alt="Avatar" className={`w-[40px] h-[40px] rounded-full object-cover mr-4 bg-gray-200 shrink-0 ${isDark ? 'border border-gray-800' : ''}`} />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span className={`text-[13px] font-medium ${textColor} mr-1 truncate max-w-[200px]`}>
              @{state.username.replace(/\s+/g, '').toLowerCase()}
            </span>
            {state.isVerified && (
               <svg className={`w-3.5 h-3.5 ${mutedColor} mr-2 shrink-0`} viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
               </svg>
            )}
            <span className={`text-[12px] ${mutedColor}`}>
              {state.timestamp}
            </span>
          </div>
          
          <p className={`text-[14px] ${textColor} leading-[1.4] break-words whitespace-pre-wrap mb-2`}>
            {renderFormattedText(state.commentText)}
          </p>
          
          <div className="flex items-center space-x-1">
            {/* Like */}
            <div className="flex items-center cursor-pointer p-1">
              <ThumbsUp className={`w-[18px] h-[18px] ${textColor}`} strokeWidth={1.5} />
              {state.likeCount && (
                <span className={`text-[12px] ${mutedColor} ml-1.5`}>{state.likeCount}</span>
              )}
            </div>
            {/* Dislike */}
            <div className="flex items-center cursor-pointer p-1 px-3">
              <ThumbsDown className={`w-[18px] h-[18px] ${textColor}`} strokeWidth={1.5} />
            </div>
            {/* Reply */}
            <span className={`text-[12px] font-medium ${textColor} ml-2 ${btnHover} px-3 py-1.5 rounded-full cursor-pointer`}>
              Balas
            </span>
          </div>
          
          {state.replyCount && parseInt(state.replyCount.replace(/\D/g, '')) > 0 && (
            <div className="flex items-center mt-1 cursor-pointer">
               <svg className={`w-4 h-4 ${linkColor} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
               <span className={`text-[14px] font-medium ${linkColor}`}>
                 {state.replyCount} balasan
               </span>
            </div>
          )}
        </div>
        
        {/* Top right menu icon dummy */}
        <div className="ml-2 shrink-0 p-1">
           <svg className={`w-5 h-5 ${textColor}`} fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
           </svg>
        </div>
      </div>
    </div>
  );
}
