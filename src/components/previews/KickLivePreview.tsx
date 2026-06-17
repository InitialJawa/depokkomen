import React from 'react';
import { CommentState } from '../../types';
import { renderFormattedText } from '../../utils';
import { Moon, Sun } from 'lucide-react';

interface Props {
  state: CommentState;
  onThemeToggle?: () => void;
}

export function KickLivePreview({ state, onThemeToggle }: Props) {
  const isDark = state.theme === 'dark';
  const bgColor = state.hideLiveBackground ? 'bg-transparent' : (isDark ? 'bg-[#0B0E14]' : 'bg-white');
  const borderColor = state.hideLiveBackground ? 'border-transparent' : (isDark ? 'border-[#1E232B]' : 'border-gray-200');
  const textColor = isDark ? 'text-white' : 'text-black';
  const containerClasses = state.hideLiveBackground 
    ? "w-full font-sans text-left flex flex-col gap-1 text-[14px] drop-shadow-md"
    : `${bgColor} w-full p-4 font-sans text-left flex flex-col gap-1 text-[14px] rounded-lg border ${borderColor}`;

  return (
    <div className={containerClasses}>
      <div className="flex items-start w-full">
        <img src={state.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover mr-3 bg-gray-800 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 leading-relaxed">
          <span className="font-bold text-[#53FC18] mr-2 inline-flex items-center">
            {state.username}
            {state.isVerified && (
              <svg className="w-3.5 h-3.5 ml-1.5 text-black bg-[#53FC18] rounded-sm p-[2px]" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            )}
          </span>
          <span className={`${textColor} break-words`}>
            {renderFormattedText(state.commentText)}
          </span>
        </div>
      </div>
      
      {(state.additionalComments || []).map((comment) => (
        <div key={comment.id} className="flex items-start w-full">
          <img src={comment.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover mr-3 bg-gray-800 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0 leading-relaxed">
            <span className="font-bold text-[#53FC18] mr-2 inline-flex items-center">
              {comment.username}
              {comment.isVerified && (
                <svg className="w-3.5 h-3.5 ml-1.5 text-black bg-[#53FC18] rounded-sm p-[2px]" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
            </span>
            <span className={`${textColor} break-words`}>
              {renderFormattedText(comment.commentText)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
