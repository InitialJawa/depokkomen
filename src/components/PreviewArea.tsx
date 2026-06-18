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
    <div className="flex flex-col h-full bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex-1 relative">
      <div className="p-4 border-b border-[var(--panel-border)] flex items-center justify-between shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Live Preview ({state.platform})</h2>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-auto custom-scrollbar" style={{
        backgroundImage: 'radial-gradient(var(--panel-border) 20%, transparent 20%), radial-gradient(var(--panel-border) 20%, transparent 20%)',
        backgroundPosition: '0 0, 10px 10px',
        backgroundSize: '20px 20px',
        backgroundColor: 'var(--root-bg)'
      }}>
         <div className="absolute inset-0 z-0" style={{
           backgroundImage: 'linear-gradient(45deg, var(--panel-border) 25%, transparent 25%), linear-gradient(-45deg, var(--panel-border) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--panel-border) 75%), linear-gradient(-45deg, transparent 75%, var(--panel-border) 75%)',
           backgroundSize: '20px 20px',
           backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
         }}></div>
         
         <div className="relative z-10 flex justify-center drop-shadow-xl" style={getFontFamilyStyle()}>
           <div 
              ref={previewRef} 
              className={`flex justify-center transition-all ${state.hasDropShadow ? 'p-8' : 'p-0'}`}
              style={{ backgroundColor: 'transparent' }}
           >
              <div className={`flex justify-center transition-all ${state.hasDropShadow ? 'drop-shadow-[14px_14px_23px_rgba(0,0,0,0.49)]' : ''}`}>
                {getPreviewComponent()}
              </div>
           </div>
         </div>
      </div>
      
      <div className="p-4 border-t border-[var(--panel-border)] bg-[var(--root-bg)] shrink-0">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 px-2 gap-3 sm:gap-0">
           <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
             <span className="text-xs text-[var(--text-muted)]">Tema Komentar</span>
             
             {/* Drop Shadow Toggle */}
             <div className="flex items-center gap-2">
               <span className="text-xs text-[var(--text-muted)] font-medium">Fx Shadow</span>
               <label className="relative inline-flex items-center flex-col cursor-pointer">
                 <input 
                   type="checkbox" 
                   className="sr-only peer"
                   checked={state.hasDropShadow}
                   onChange={(e) => onStateChange({ hasDropShadow: e.target.checked })}
                 />
                 <div className="w-9 h-5 bg-[var(--panel-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]"></div>
               </label>
             </div>
           </div>

           <div className="flex bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg p-1 w-full sm:w-auto justify-center">
             <button
               onClick={() => onStateChange({ theme: 'light' })}
               className={`px-3 py-1.5 flex-1 sm:flex-none justify-center text-[10px] uppercase font-bold rounded-md transition flex items-center gap-1.5 ${state.theme === 'light' ? 'bg-[var(--panel-bg)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[var(--root-fg)]' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
             >
               <Sun className="w-3 h-3" /> Light
             </button>
             <button
               onClick={() => onStateChange({ theme: 'dark' })}
               className={`px-3 py-1.5 flex-1 sm:flex-none justify-center text-[10px] uppercase font-bold rounded-md transition flex items-center gap-1.5 ${state.theme === 'dark' ? 'bg-[var(--panel-bg)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[var(--root-fg)]' : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'}`}
             >
               <Moon className="w-3 h-3" /> Dark
             </button>
           </div>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-3 rounded-[14px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
