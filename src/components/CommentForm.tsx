import React, { useRef } from 'react';
import { CommentState } from '../types';
import { Image, Shuffle, Highlighter, EyeOff, Scissors, RotateCcw } from 'lucide-react';
import { getRandomState } from '../utils';

interface Props {
  state: CommentState;
  onChange: (state: Partial<CommentState>) => void;
  onRandomize: () => void;
}

export function CommentForm({ state, onChange, onRandomize }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFormat = (tag: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = state.commentText;
    if (start !== end) {
      const selectedText = text.substring(start, end);
      const newText = text.substring(0, start) + `[${tag}]` + selectedText + `[/${tag}]` + text.substring(end);
      onChange({ commentText: newText });
      
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start, start + tag.length * 2 + 5 + selectedText.length);
      }, 0);
    } else {
      alert('Tandai / blok teks komentar terlebih dahulu!');
    }
  };

  const resetFormat = () => {
    const newText = state.commentText.replace(/\[\/?(highlight|blur|cut)\]/g, '');
    onChange({ commentText: newText });
  };

  return (
    <div className="bg-[#141414] border border-[#2D2D2D] rounded-2xl p-5 flex flex-col gap-5 flex-1">
      <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Konfigurasi Komentar</h2>
        <button 
          onClick={onRandomize}
          className="flex items-center text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition"
        >
          <Shuffle className="w-3 h-3 mr-1" />
          RANDOMIZE
        </button>
      </div>

      {state.platform === 'tiktok' && (
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Template</label>
          <div className="flex bg-[#0A0A0A] border border-[#2D2D2D] rounded-lg p-1">
            <button
              onClick={() => onChange({ tiktokTemplate: 'video' })}
              className={`flex-1 py-1 text-sm rounded-md transition ${state.tiktokTemplate === 'video' ? 'bg-[#2D2D2D] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Video Comment
            </button>
            <button
              onClick={() => onChange({ tiktokTemplate: 'reply' })}
              className={`flex-1 py-1 text-sm rounded-md transition ${state.tiktokTemplate === 'reply' ? 'bg-[#2D2D2D] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Reply Bubble
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Avatar</label>
          <div className="flex items-center space-x-4">
            <img src={state.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-[#2D2D2D] bg-[#0A0A0A]" />
            <div className="flex-1">
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload} 
              />
              <label 
                htmlFor="avatar-upload" 
                className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#2D2D2D] border border-[#2D2D2D] rounded-lg text-sm text-gray-300 transition"
              >
                <Image className="w-4 h-4 mr-2" />
                Upload
              </label>
              <p className="mt-1 text-[10px] text-gray-500">JPG/PNG maks 2MB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Username / Name</label>
             <input 
                type="text" 
                value={state.username} 
                onChange={e => onChange({ username: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#2D2D2D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition"
             />
          </div>
          
          {state.platform === 'twitter' && (
            <div className="col-span-2">
               <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">@Handle</label>
               <input 
                  type="text" 
                  value={state.handle} 
                  onChange={e => onChange({ handle: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#2D2D2D] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition"
               />
            </div>
          )}

          <div>
             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Likes</label>
             <input 
                type="text" 
                value={state.likeCount} 
                onChange={e => onChange({ likeCount: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#2D2D2D] focus:border-blue-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition"
                placeholder="Misal: 1.2K"
             />
          </div>

          {state.platform === 'twitter' && (
            <>
               <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Retweets</label>
                 <input 
                    type="text" 
                    value={state.retweetCount} 
                    onChange={e => onChange({ retweetCount: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#2D2D2D] focus:border-blue-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition"
                    placeholder="Misal: 800"
                 />
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Views</label>
                 <input 
                    type="text" 
                    value={state.viewCount} 
                    onChange={e => onChange({ viewCount: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#2D2D2D] focus:border-blue-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition"
                    placeholder="Misal: 1.2M"
                 />
               </div>
            </>
          )}

          {state.platform === 'youtube' && (
             <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Replies</label>
                 <input 
                    type="text" 
                    value={state.replyCount} 
                    onChange={e => onChange({ replyCount: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#2D2D2D] focus:border-blue-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition"
                    placeholder="Misal: 24"
                 />
             </div>
          )}

          <div>
             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Waktu</label>
             <input 
                type="text" 
                value={state.timestamp} 
                onChange={e => onChange({ timestamp: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#2D2D2D] focus:border-blue-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition"
                placeholder="2j lalu"
             />
          </div>

          <div className="col-span-2 flex items-center mt-2">
            <input 
              type="checkbox" 
              id="verified" 
              checked={state.isVerified}
              onChange={e => onChange({ isVerified: e.target.checked })}
              className="w-4 h-4 rounded border-[#2D2D2D] text-blue-600 focus:ring-blue-600 focus:ring-offset-[#141414] bg-[#0A0A0A]"
            />
            <label htmlFor="verified" className="ml-2 text-sm text-gray-300 select-none">
              Verified Badge (Centang Biru)
            </label>
          </div>
        </div>

        <div>
           <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Isi Komentar</label>
           <textarea 
              ref={textareaRef}
              value={state.commentText} 
              onChange={e => onChange({ commentText: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#2D2D2D] focus:border-blue-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition h-24 resize-none"
              placeholder="Tulis komentar di sini..."
           />
        </div>

        <div className="pt-2">
           <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Advanced Edits</h3>
           </div>
           <p className="text-[10px] text-gray-500 mb-3 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Blok/tandai teks, lalu pilih efek
           </p>
           <div className="flex gap-2">
             <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('highlight'); }} className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#2D2D2D] hover:bg-[#2D2D2D] flex items-center justify-center text-gray-400 hover:text-white transition">
               <Highlighter className="w-4 h-4" />
             </button>
             <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('blur'); }} className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#2D2D2D] hover:bg-[#2D2D2D] flex items-center justify-center text-gray-400 hover:text-white transition">
               <EyeOff className="w-4 h-4" />
             </button>
             <button type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('cut'); }} className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#2D2D2D] hover:bg-[#2D2D2D] flex items-center justify-center text-gray-400 hover:text-white transition">
               <Scissors className="w-4 h-4" />
             </button>
             <button type="button" onClick={resetFormat} className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#2D2D2D] hover:bg-[#2D2D2D] flex items-center justify-center text-gray-400 hover:text-white transition">
               <RotateCcw className="w-4 h-4" />
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
