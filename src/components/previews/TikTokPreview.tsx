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
  
  const defaultBg = isReply 
    ? (isDark ? 'rgba(0,0,0,0.9)' : '#ffffff') 
    : (isDark ? '#121212' : '#ffffff');
    
  const bubbleBg = (isReply && state.replyBubbleColor) ? state.replyBubbleColor : defaultBg;
  const bubbleStyle = { backgroundColor: bubbleBg };
    
  const textColor = (isReply && state.replyBubbleColor) ? '#ffffff' : (isDark ? 'text-white' : 'text-black');
  const textColorClass = (isReply && state.replyBubbleColor) ? '' : textColor;
  const mutedText = isDark ? 'text-neutral-400' : 'text-gray-500';

  if (isReply) {
    return (
      <div 
        className="flex flex-col relative w-fit max-w-lg sm:max-w-xl mt-4 shadow-md"
        style={{
          ...bubbleStyle,
          padding: `${state.padding ?? 16}px`,
          borderRadius: `${state.borderRadius ?? 12}px`,
          borderBottomLeftRadius: '0px'
        }}
      >
        {/* Reply Tail */}
        <svg 
          className="absolute"
          style={{
            bottom: '-19px',
            left: '-12px',
            color: bubbleBg,
          }}
          width="24"
          height="20"
          viewBox="0 0 24 20"
          fill="none"
        >
          <path 
            d="M 12 0 C 12 6, 8 12, 0 20 C 8 16, 16 10, 24 0 Z" 
            fill="currentColor" 
          />
        </svg>
        
        <div className="relative flex items-center w-full">
          {/* Avatar */}
          {state.avatarUrl && (
            <img src={state.avatarUrl} alt="Avatar" className="w-[46px] h-[46px] rounded-full object-cover mr-3.5 bg-neutral-800 shrink-0" />
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className={`text-[13px] font-semibold ${(isReply && state.replyBubbleColor) ? 'text-white/80' : mutedText} truncate mb-0.5`}>
              Reply to {state.username}'s comment
            </span>
            <p 
              className={`${textColorClass} leading-[1.3] font-bold text-left break-words whitespace-pre-wrap`}
              style={{ fontSize: `${(state.fontSize || 15) + 3}px`, color: (isReply && state.replyBubbleColor) ? '#ffffff' : undefined }}
            >
              {renderFormattedText(state.commentText)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col relative w-fit max-w-lg sm:max-w-xl"
      style={{
        backgroundColor: defaultBg,
        padding: `${state.padding ?? 16}px`,
        borderRadius: `${state.borderRadius ?? 12}px`
      }}
    >
      {state.isPinned && (
        <div className="flex items-center text-[13px] text-gray-500 font-medium mb-1 pl-12">
          <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h4.5v6.5l1.5 1.5 1.5-1.5V16H18v-2l-2-2z"/>
          </svg>
          Disematkan
        </div>
      )}
      <div className="relative flex items-start w-full">
        {/* Avatar */}
        {state.avatarUrl && (
          <img src={state.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover mr-3 bg-neutral-800 shrink-0" />
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex flex-col mb-1">
            <div className="flex items-center mt-0.5">
              <span className={`text-[13px] font-bold ${isDark ? 'text-neutral-300' : 'text-gray-900'} mr-1.5 hover:underline cursor-pointer truncate`}>
                {state.username}
              </span>
              {state.isVerified && (
                <div className="bg-[#20D5EC] rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <p 
            className={`${textColorClass} leading-[1.3] font-medium text-left break-words whitespace-pre-wrap mt-0.5`}
            style={{ fontSize: `${state.fontSize || 15}px` }}
          >
            {renderFormattedText(state.commentText)}
          </p>
          
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
        </div>
        
        {/* Like Button */}
        <div className={`flex flex-col items-center ml-2 shrink-0 ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
          <Heart className="w-5 h-5 mb-1 opacity-80" strokeWidth={1.5} />
          {state.likeCount && (
            <span className="text-[11px] opacity-80 font-medium">{state.likeCount}</span>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {state.nestedReplies && state.nestedReplies.length > 0 && (
        <div className="flex flex-col mt-4 pl-12 space-y-4">
          {state.nestedReplies.map(reply => (
            <div key={reply.id} className="relative flex items-start w-fit max-w-lg sm:max-w-xl">
              <img src={reply.avatarUrl} alt="Avatar" className="w-6 h-6 border shrink-0 border-neutral-700 rounded-full object-cover mr-3 bg-neutral-800" />
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center mt-0.5 mb-1">
                  <span className={`text-[13px] font-bold ${isDark ? 'text-neutral-300' : 'text-gray-900'} mr-1.5 hover:underline cursor-pointer truncate`}>
                    {reply.username}
                  </span>
                  {reply.isVerified && (
                    <div className="bg-[#20D5EC] rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M9 16.17L4.83 12l-1.42 1.41L9 16.17z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <p 
                  className={`${isDark ? 'text-white' : 'text-black'} leading-[1.3] font-medium text-left break-words whitespace-pre-wrap`}
                  style={{ fontSize: `${state.fontSize || 15}px`, opacity: 0.9 }}
                >
                  {renderFormattedText(reply.commentText)}
                </p>
                <div className="flex items-center mt-1.5 space-x-4">
                  <span className={`text-[13px] ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>
                    {reply.timestamp}
                  </span>
                  <button className={`text-[13px] ${isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-gray-500 hover:text-gray-700'} font-semibold tracking-wide`}>
                    Balas
                  </button>
                  {reply.creatorLiked && (
                    <div className={`flex items-center text-[12px] font-medium leading-none px-1.5 py-0.5 rounded-sm ${isDark ? 'bg-neutral-800 text-[#FE2B54]' : 'bg-gray-100 text-[#FE2B54]'}`}>
                      Disukai oleh kreator
                    </div>
                  )}
                </div>
              </div>
              <div className={`flex flex-col items-center ml-2 shrink-0 ${isDark ? 'text-neutral-500' : 'text-gray-400'}`}>
                <Heart className="w-4 h-4 mb-1 opacity-80" strokeWidth={1.5} />
                {reply.likeCount && reply.likeCount !== '0' && (
                  <span className="text-[11px] opacity-80 font-medium">{reply.likeCount}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

