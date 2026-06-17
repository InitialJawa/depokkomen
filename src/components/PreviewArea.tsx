import React, { useRef, useState } from 'react';
import { CommentState } from '../types';
import { TikTokPreview } from './previews/TikTokPreview';
import { InstagramPreview } from './previews/InstagramPreview';
import { YouTubePreview } from './previews/YouTubePreview';
import { TwitterPreview } from './previews/TwitterPreview';
import { KickLivePreview } from './previews/KickLivePreview';
import { IGLivePreview } from './previews/IGLivePreview';
import { toPng } from 'html-to-image';
import { Download, Loader2, CheckCircle2, Sun, Moon } from 'lucide-react';

interface Props {
  state: CommentState;
  onStateChange: (state: Partial<CommentState>) => void;
}

export function PreviewArea({ state, onStateChange }: Props) {
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
        backgroundColor: 'transparent',
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

  const getPreviewComponent = () => {
    switch (state.platform) {
      case 'tiktok': return <TikTokPreview state={state} />;
      case 'instagram': return state.instagramTemplate === 'live' ? <IGLivePreview state={state} /> : <InstagramPreview state={state} />;
      case 'youtube': return <YouTubePreview state={state} />;
      case 'twitter': return <TwitterPreview state={state} />;
      case 'kick_live': return <KickLivePreview state={state} />;
      default: return null;
    }
  };

  const getFontFamilyStyle = () => {
    switch (state.fontFamily) {
      case 'roboto':
        return { fontFamily: 'Roboto, Arial, sans-serif' };
      case 'san-francisco':
        return { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' };
      default:
        return {}; // Tailwind default
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
         <div className="absolute inset-0 z-0" style={{
           backgroundImage: 'linear-gradient(45deg, #1f1f1f 25%, transparent 25%), linear-gradient(-45deg, #1f1f1f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f1f1f 75%), linear-gradient(-45deg, transparent 75%, #1f1f1f 75%)',
           backgroundSize: '20px 20px',
           backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
         }}></div>
         
         <div className="relative z-10 w-full max-w-lg flex justify-center drop-shadow-xl" style={getFontFamilyStyle()}>
           <div 
              ref={previewRef} 
              className="flex justify-center rounded-xl overflow-hidden shadow-2xl w-full"
              style={{ backgroundColor: 'transparent' }}
           >
              {getPreviewComponent()}
           </div>
         </div>
      </div>
      
      <div className="p-4 border-t border-[#2D2D2D] bg-[#0A0A0A] shrink-0">
        <div className="flex items-center justify-between mb-4 px-2">
           <span className="text-xs text-gray-400">Tema Komentar</span>
           <div className="flex bg-[#141414] border border-[#2D2D2D] rounded-lg p-1">
             <button
               onClick={() => onStateChange({ theme: 'light' })}
               className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-md transition flex items-center gap-1.5 ${state.theme === 'light' ? 'bg-[#2D2D2D] text-white' : 'text-gray-500 hover:text-white'}`}
             >
               <Sun className="w-3 h-3" /> Light
             </button>
             <button
               onClick={() => onStateChange({ theme: 'dark' })}
               className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-md transition flex items-center gap-1.5 ${state.theme === 'dark' ? 'bg-[#2D2D2D] text-white' : 'text-gray-500 hover:text-white'}`}
             >
               <Moon className="w-3 h-3" /> Dark
             </button>
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
