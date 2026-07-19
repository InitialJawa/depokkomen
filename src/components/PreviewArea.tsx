import React, { useRef, useState, useEffect } from 'react';
import { CommentState, Platform } from '../types';
import { TikTokPreview } from './previews/TikTokPreview';
import { InstagramPreview } from './previews/InstagramPreview';
import { YouTubePreview } from './previews/YouTubePreview';
import { TwitterPreview } from './previews/TwitterPreview';
import { KickLivePreview } from './previews/KickLivePreview';
import { IGLivePreview } from './previews/IGLivePreview';
import { toPng, toJpeg } from 'html-to-image';
import { Toolbar } from './Canvas/Toolbar';
import { ExportCard } from './Canvas/ExportCard';
import { 
  TikTokColoredIcon, 
  InstagramColoredIcon, 
  YouTubeColoredIcon, 
  TwitterColoredIcon, 
  KickColoredIcon 
} from './icons';
import { motion, useMotionValue } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

interface Props {
  state: CommentState;
  onStateChange: (state: Partial<CommentState>) => void;
  isPremium: boolean;
  onUpgradeClick: () => void;
  incrementExportCount: () => boolean;
}

export function PreviewArea({ state, onStateChange, isPremium, onUpgradeClick, incrementExportCount }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [bgStyle, setBgStyle] = useState<'checkerboard' | 'solid' | 'transparent'>('checkerboard');
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const centerCanvas = () => {
    setScale(1);
    x.set(0);
    y.set(0);
  };

  const handleExport = async (exportScale: number, format: 'png' | 'jpg' | 'webp' | 'transparent') => {
    if (!previewRef.current) return;
    
    // Check and increment export limit
    const allowed = incrementExportCount();
    if (!allowed) {
      onUpgradeClick();
      return;
    }
    
    setIsExporting(true);
    try {
      // Temporarily reset transform for clean export
      const originalTransform = previewRef.current.style.transform;
      previewRef.current.style.transform = `scale(1) translate(0px, 0px)`;
      
      await new Promise(r => setTimeout(r, 100)); // wait for dom to update
      
      const options = {
        cacheBust: true,
        pixelRatio: exportScale,
        backgroundColor: format === 'transparent' ? 'transparent' : (state.theme === 'dark' ? '#000000' : '#ffffff'),
        style: { margin: '0' }
      };

      let dataUrl = '';
      if (format === 'jpg') {
        dataUrl = await toJpeg(previewRef.current, options);
      } else {
        dataUrl = await toPng(previewRef.current, options);
      }
      
      const link = document.createElement('a');
      link.download = `sosmedcomment-${state.platform}-${Date.now()}.${format === 'transparent' ? 'png' : format}`;
      link.href = dataUrl;
      link.click();
      
      previewRef.current.style.transform = originalTransform;
    } catch (err) {
      console.error('Failed to export', err);
      alert('Gagal mengekspor gambar.');
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
      case 'roboto': return { fontFamily: '"Roboto", sans-serif' };
      case 'inter': return { fontFamily: '"Inter", sans-serif' };
      case 'space-grotesk': return { fontFamily: '"Space Grotesk", sans-serif' };
      case 'playfair-display': return { fontFamily: '"Playfair Display", serif' };
      case 'poppins': return { fontFamily: '"Poppins", sans-serif' };
      case 'jetbrains-mono': return { fontFamily: '"JetBrains Mono", monospace' };
      case 'san-francisco': return { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "SF Pro", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' };
      default: return {};
    }
  };

  // Handle Mouse Wheel Zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(s => Math.min(Math.max(0.25, s + delta), 3));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'tiktok', label: 'TikTok', icon: <TikTokColoredIcon className="w-4.5 h-4.5" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramColoredIcon className="w-5 h-5" /> },
    { id: 'youtube', label: 'YouTube', icon: <YouTubeColoredIcon className="w-5 h-5" /> },
    { id: 'twitter', label: 'Twitter / X', icon: <TwitterColoredIcon className="w-5 h-5" /> },
    { id: 'kick_live', label: 'Kick Live', icon: <KickColoredIcon className="w-4 h-4 text-[10px]" /> },
  ];

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl shadow-xl overflow-hidden relative">
      <Toolbar 
        scale={scale} 
        setScale={setScale} 
        showGrid={showGrid} 
        setShowGrid={setShowGrid} 
        centerCanvas={centerCanvas} 
        cardTheme={state.theme}
        onCardThemeChange={(theme) => onStateChange({ theme })}
      />

      <ExportCard onExport={handleExport} isExporting={isExporting} />

      {/* Floating Platform Dock (Centered at the top to prevent any collision) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-[var(--panel-bg)]/85 backdrop-blur-md border border-[var(--panel-border)] rounded-xl p-1 shadow-lg items-center gap-1">
         {platforms.map((p) => {
           const isActive = state.platform === p.id;
           return (
             <button
               key={p.id}
               onClick={() => onStateChange({ platform: p.id })}
               className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                 isActive 
                   ? 'bg-[var(--root-bg)] shadow-sm text-[var(--root-fg)] font-bold' 
                   : 'text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--button-hover)]/40'
               }`}
               title={`Switch to ${p.label}`}
             >
               <span className={`w-4.5 h-4.5 flex items-center justify-center transition-transform ${isActive ? 'scale-110' : 'opacity-80'}`}>
                 {p.icon}
               </span>
               <span className="hidden md:inline text-[11px]">{p.label}</span>
             </button>
           );
         })}
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className={`flex-1 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing ${bgStyle === 'checkerboard' ? 'bg-checkerboard' : bgStyle === 'solid' ? 'bg-[var(--root-bg)]' : 'bg-transparent'}`}
      >
        {/* Figma like checkerboard via CSS class or inline style */}
        {bgStyle === 'checkerboard' && (
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, var(--panel-border) 25%, transparent 25%, transparent 75%, var(--panel-border) 75%, var(--panel-border)), repeating-linear-gradient(45deg, var(--panel-border) 25%, var(--root-bg) 25%, var(--root-bg) 75%, var(--panel-border) 75%, var(--panel-border))',
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
          }}></div>
        )}

        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{
            backgroundImage: 'linear-gradient(to right, var(--root-fg) 1px, transparent 1px), linear-gradient(to bottom, var(--root-fg) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        )}

        <motion.div
          drag
          dragMomentum={false}
          style={{ x, y, scale }}
          className="relative z-10 flex justify-center items-center"
        >
          <div 
            ref={previewRef} 
            className={`flex justify-center transition-shadow preview-card-font ${state.hasDropShadow ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]' : ''}`}
            style={getFontFamilyStyle()}
          >
             {getPreviewComponent()}
          </div>
        </motion.div>
      </div>

      {/* Canvas Status Bar */}
      <div className="h-8 border-t border-[var(--panel-border)] bg-[var(--panel-bg)] flex items-center px-4 justify-between text-[10px] text-[var(--text-muted)] font-mono shrink-0 select-none">
        <div className="flex gap-4 items-center">
          <span>{Math.round(scale * 100)}%</span>
          <span className="opacity-30">|</span>
          <button 
            onClick={() => {
              const styles: ('checkerboard' | 'solid' | 'transparent')[] = ['checkerboard', 'solid', 'transparent'];
              const nextIndex = (styles.indexOf(bgStyle) + 1) % styles.length;
              setBgStyle(styles[nextIndex]);
            }}
            className="hover:text-[var(--root-fg)] font-bold transition-colors cursor-pointer flex items-center gap-1.5 group"
            title="Cycle background style"
          >
            <span>BACKGROUND:</span>
            <span className="bg-slate-200 dark:bg-slate-800 text-[var(--root-fg)] px-1.5 py-0.5 rounded text-[9px] font-bold group-hover:bg-blue-500 group-hover:text-white transition-all uppercase tracking-wide">
              {bgStyle}
            </span>
          </button>
          <span className="opacity-30">|</span>
          <span>Auto Saved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}
