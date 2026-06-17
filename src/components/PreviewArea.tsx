import React, { useRef, useState } from 'react';
import { CommentState } from '../types';
import { TikTokPreview } from './previews/TikTokPreview';
import { InstagramPreview } from './previews/InstagramPreview';
import { YouTubePreview } from './previews/YouTubePreview';
import { TwitterPreview } from './previews/TwitterPreview';
import { toPng } from 'html-to-image';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  state: CommentState;
  onTransparentChange: (val: boolean) => void;
  onStateChange: (state: Partial<CommentState>) => void;
}

export function PreviewArea({ state, onTransparentChange, onStateChange }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    if (!previewRef.current) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure all images are loaded
      await new Promise(r => setTimeout(r, 100));
      
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: state.isTransparentBg ? 'transparent' : undefined,
        style: {
          margin: '0',
        }
      });
      
      const link = document.createElement('a');
      link.download = `sosmedcomment-${state.platform}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to export', err);
      alert('Gagal mengekspor gambar. Pastikan gambar avatar didukung.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleThemeToggle = () => {
    onStateChange({ theme: state.theme === 'dark' ? 'light' : 'dark' });
  };

  const getPreviewComponent = () => {
    switch (state.platform) {
      case 'tiktok': return <TikTokPreview state={state} onThemeToggle={handleThemeToggle} />;
      case 'instagram': return <InstagramPreview state={state} onThemeToggle={handleThemeToggle} />;
      case 'youtube': return <YouTubePreview state={state} onThemeToggle={handleThemeToggle} />;
      case 'twitter': return <TwitterPreview state={state} onThemeToggle={handleThemeToggle} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] border border-[#2D2D2D] rounded-2xl overflow-hidden flex-1 relative">
      <div className="p-4 border-b border-[#2D2D2D] flex items-center justify-between shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Preview ({state.platform})</h2>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-auto custom-scrollbar" style={{
        backgroundImage: 'radial-gradient(#222 20%, transparent 20%), radial-gradient(#222 20%, transparent 20%)',
        backgroundPosition: '0 0, 10px 10px',
        backgroundSize: '20px 20px',
        backgroundColor: '#0c0c0c'
      }}>
         {state.isTransparentBg && (
            <div className="absolute inset-0 z-0" style={{
              backgroundImage: 'linear-gradient(45deg, #1f1f1f 25%, transparent 25%), linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f1f1f 75%), linear-gradient(-45deg, transparent 75%, #1f1f1f 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}></div>
         )}
         
         <div className="relative z-10 w-full max-w-lg flex justify-center drop-shadow-xl">
           <div 
              ref={previewRef} 
              className="flex justify-center rounded-xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: state.isTransparentBg ? 'transparent' : (state.platform === 'twitter' ? 'black' : state.platform === 'instagram' || state.platform === 'youtube' ? 'white' : '#121212')
              }}
           >
              {getPreviewComponent()}
           </div>
         </div>
      </div>
      
      <div className="p-4 border-t border-[#2D2D2D] bg-[#0A0A0A] shrink-0">
        <div className="flex items-center justify-between mb-4 px-2">
           <span className="text-xs text-gray-400">Background Transparan</span>
           <div 
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${state.isTransparentBg ? 'bg-blue-600' : 'bg-gray-800'}`}
              onClick={() => onTransparentChange(!state.isTransparentBg)}
           >
              <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-all ${state.isTransparentBg ? 'translate-x-5 bg-white' : 'bg-gray-500'}`}></div>
           </div>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-[#22C55E] hover:bg-[#1eb054] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : success ? (
            <CheckCircle2 className="w-5 h-5 mr-2" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          <span>{isExporting ? 'MENGEKSPOR...' : success ? 'BERHASIL' : 'EXPORT PNG'}</span>
        </button>
      </div>
    </div>
  );
}
