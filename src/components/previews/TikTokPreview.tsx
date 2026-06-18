import React from 'react';
import { CommentState } from '../../types';
import { Heart, Moon, Sun } from 'lucide-react';
import { renderFormattedText } from '../../utils';

interface Props {
  state: CommentState;
  onThemeToggle?: () => void;
}

export function TikTokPreview({ state, onThemeToggle }: Props) {
  const isReply = state.tiktokTemplate === 'reply';
  const isDark = state.theme === 'dark';
  
  const bgColor = isReply 
    ? (isDark ? 'bg-black/90 backdrop-blur-md' : 'bg-white') 
    : (isDark ? 'bg-[#121212]' : 'bg-white');
    
  const textColor = isDark ? 'text-white' : 'text-black';
  const mutedText = isDark ? 'text-neutral-400' : 'text-gray-500';

  return (
    <>
      <div className={`relative flex items-start p-4 ${bgColor} ${isReply ? 'w-fit max-w-lg sm:max-w-xl rounded-xl drop-shadow-xl mt-4' : 'w-fit max-w-lg sm:max-w-xl'}`}>
        
        {/* Reply Pointer (if reply bubble) */}
        {isReply && (
          <div className={`absolute -top-[10px] left-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] ${isDark ? 'border-b-black/90' : 'border-b-white'}`}></div>
        )}

        {/* Avatar */}
        {state.avatarUrl && (
          <img src={state.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover mr-3 bg-neutral-800 shrink-0" />
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex flex-col mb-1">
            <div className="flex items-center mt-0.5">
              {isReply ? (
                <span className={`text-[13px] font-bold ${mutedText} mr-1.5 truncate`}>
                  Balas {state.username}
                </span>
              ) : (
                <span className={`text-[13px] font-bold ${isDark ? 'text-neutral-300' : 'text-gray-900'} mr-1.5 hover:underline cursor-pointer truncate`}>
                  {state.username}
                </span>
              )}
              {state.isVerified && (
                <div className="bg-[#20D5EC] rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <p className={`text-[15px] ${textColor} leading-[1.3] font-medium text-left break-words whitespace-pre-wrap mt-0.5`}>
            {renderFormattedText(state.commentText)}
          </p>
          
          {!isReply && (
            <div className="flex items-center mt-2 space-x-4">
              <span className={`text-[13px] ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>
                {state.timestamp}
              </span>
              <button className={`text-[13px] ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-500 hover:text-gray-700'} font-semibold tracking-wide`}>
                Balas
              </button>
              {state.creatorLiked && (
                <div className={`flex items-center text-[12px] font-medium leading-none px-1.5 py-0.5 rounded-sm ${isDark ? 'bg-neutral-800 text-[#FE2B54]' : 'bg-gray-100 text-[#FE2B54]'}`}>
                  Disukai oleh kreator
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Like Button */}
        {!isReply && (
          <div className={`flex flex-col items-center ml-2 shrink-0 ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
            <Heart className="w-5 h-5 mb-1 opacity-80" strokeWidth={1.5} />
            {state.likeCount && (
              <span className="text-[11px] opacity-80 font-medium">{state.likeCount}</span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
