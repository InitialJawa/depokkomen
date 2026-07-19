import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlatformSelector } from './components/PlatformSelector';
import { Sidebar } from './components/Sidebar';
import { PreviewArea } from './components/PreviewArea';
import { defaultState, Platform } from './types';
import { getRandomState } from './utils';
import { UpgradeModal } from './components/UpgradeModal';
import { 
  TikTokColoredIcon, 
  InstagramColoredIcon, 
  YouTubeColoredIcon, 
  TwitterColoredIcon, 
  KickColoredIcon 
} from './components/icons';
import { 
  Sun, 
  Moon, 
  Shuffle, 
  RotateCcw, 
  ExternalLink, 
  Globe, 
  Cpu,
  Layers
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState(defaultState);
  const [appTheme, setAppTheme] = useState<'light' | 'dark'>('dark');

  // SaaS States & LocalStorage Integration
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('depokkomen_is_premium') === 'true';
  });

  const [exportCount, setExportCount] = useState<number>(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('depokkomen_last_export_date');
    if (storedDate !== today) {
      localStorage.setItem('depokkomen_last_export_date', today);
      localStorage.setItem('depokkomen_export_count', '0');
      return 0;
    }
    const count = localStorage.getItem('depokkomen_export_count');
    return count ? parseInt(count, 10) : 0;
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Handlers for premium simulation
  const handleUpgradeSuccess = () => {
    setIsPremium(true);
    localStorage.setItem('depokkomen_is_premium', 'true');
  };

  const handleDowngrade = () => {
    setIsPremium(false);
    localStorage.setItem('depokkomen_is_premium', 'false');
    // Also reset export limit
    setExportCount(0);
    localStorage.setItem('depokkomen_export_count', '0');
  };

  const incrementExportCount = (): boolean => {
    if (isPremium) return true;

    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('depokkomen_last_export_date');
    let currentCount = exportCount;

    // Reset daily if date changed
    if (storedDate !== today) {
      localStorage.setItem('depokkomen_last_export_date', today);
      localStorage.setItem('depokkomen_export_count', '0');
      setExportCount(0);
      currentCount = 0;
    }

    if (currentCount >= 30) {
      return false; // Limit reached!
    }

    const nextCount = currentCount + 1;
    setExportCount(nextCount);
    localStorage.setItem('depokkomen_export_count', nextCount.toString());
    return true;
  };

  // Sync dark class on document element
  useEffect(() => {
    if (appTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appTheme]);

  const handleStateChange = (updates: Partial<typeof defaultState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleRandomize = () => {
    setState(prev => getRandomState(prev));
  };

  const handleReset = () => {
    setState(defaultState);
  };

  const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'tiktok', label: 'TikTok', icon: <TikTokColoredIcon className="w-5 h-5" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramColoredIcon className="w-5.5 h-5.5" /> },
    { id: 'youtube', label: 'YouTube', icon: <YouTubeColoredIcon className="w-5.5 h-5.5" /> },
    { id: 'twitter', label: 'Twitter / X', icon: <TwitterColoredIcon className="w-5.5 h-5.5" /> },
    { id: 'kick_live', label: 'Kick Live', icon: <KickColoredIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--root-bg)] text-[var(--root-fg)] font-sans selection:bg-blue-500/30 flex flex-row h-screen overflow-hidden relative transition-colors duration-300">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] rounded-full bg-glow-blob-1 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full bg-glow-blob-2 pointer-events-none z-0"></div>

      {/* 2. Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden z-10 min-w-0">
        
        {/* Header on Mobile/Tablet (lg:hidden) */}
        <div className="lg:hidden">
          <Header 
            platform={state.platform}
            theme={appTheme}
            onPlatformChange={(platform) => handleStateChange({ platform })}
            onThemeChange={setAppTheme}
          />
        </div>

        {/* Header on Desktop (Breadcrumbs & Dashboard controls) */}
        <header className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-[var(--sidebar-border)] bg-[var(--panel-bg-translucent)] backdrop-blur-xl shrink-0">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="text-[var(--text-muted)] opacity-80">SocialCanvas</span>
            <span className="text-[var(--text-muted)] opacity-40">/</span>
            <span className="text-[var(--text-muted)] font-semibold capitalize">{state.platform.replace('_', ' ')}</span>
            <span className="text-[var(--text-muted)] opacity-40">/</span>
            <span className="text-[var(--root-fg)] font-bold">Screenshot Builder</span>
          </div>

          {/* Desktop Right Controls (Clean theme switcher) */}
          <div className="flex items-center gap-3">
            <div className="bg-[var(--input-bg)] p-1 rounded-xl border border-[var(--panel-border)] flex items-center w-40">
              <button 
                onClick={() => setAppTheme('light')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  appTheme === 'light' 
                    ? 'bg-[var(--button-bg)] text-[var(--root-fg)] shadow-sm font-bold border border-[var(--panel-border)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button 
                onClick={() => setAppTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  appTheme === 'dark' 
                    ? 'bg-[var(--button-bg)] text-[var(--root-fg)] shadow-sm font-bold border border-[var(--panel-border)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>
        </header>
        
        {/* Workspace Panels (Properties & Canvas) */}
        <main className="flex-1 flex flex-col p-4 lg:p-6 gap-6 w-full mx-auto overflow-hidden h-full min-h-0">
          
          {/* Platform selector strictly for mobile layouts */}
          <div className="lg:hidden shrink-0">
            <PlatformSelector 
              platform={state.platform} 
              onChange={(platform) => handleStateChange({ platform })} 
            />
          </div>
          
          {/* Split view panels */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch min-h-0 overflow-hidden relative">
            
            {/* Properties Panel */}
            <Sidebar 
              state={state} 
              onChange={handleStateChange}
              onRandomize={handleRandomize}
              onReset={handleReset}
              isPremium={isPremium}
              exportCount={exportCount}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
            
            {/* Live Preview Area */}
            <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0 overflow-hidden relative">
               <PreviewArea 
                 state={state} 
                 onStateChange={handleStateChange}
                 isPremium={isPremium}
                 onUpgradeClick={() => setShowUpgradeModal(true)}
                 incrementExportCount={incrementExportCount}
               />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="h-10 flex items-center justify-between shrink-0 px-6 w-full mt-auto text-[11px] text-[var(--text-muted)] border-t border-[var(--sidebar-border)] bg-[var(--panel-bg-translucent)] backdrop-blur-md">
          <p className="font-semibold tracking-wide hidden sm:block opacity-80">
            Hanya untuk keperluan konten kreatif & edukasi. Jangan digunakan untuk menyebarkan misinformasi.
          </p>
          <div className="flex items-center gap-4 text-center sm:text-right w-full sm:w-auto justify-center font-bold">
            <span className="text-blue-500 dark:text-[var(--accent)] tracking-tight">Built for Indonesia UGC</span>
            <span className="opacity-40">•</span>
            <span>Premium Output Enabled</span>
          </div>
        </footer>
      </div>

      {/* Upgrade SaaS Billing Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        isPremium={isPremium}
        onDowngrade={handleDowngrade}
        exportCount={exportCount}
      />
    </div>
  );
}
