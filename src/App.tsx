import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { PlatformSelector } from './components/PlatformSelector';
import { Sidebar } from './components/Sidebar';
import { PreviewArea } from './components/PreviewArea';
import { defaultState, Platform, DraftItem, HistoryItem } from './types';
import { getRandomState } from './utils';
import { UpgradeModal } from './components/UpgradeModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
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
  Layers,
  ArrowLeft,
  UserCheck
} from 'lucide-react';

import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
}

export default function App() {
  const [state, setState] = useState(defaultState);
  const [appTheme, setAppTheme] = useState<'light' | 'dark'>('dark');
  const [view, setView] = useState<'landing' | 'editor'>('landing');

  // Simple Router State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Watch route changes
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Sync active platform based on SEO generator routes
  useEffect(() => {
    if (currentPath.includes('twitter-generator')) {
      setState(prev => ({ ...prev, platform: 'twitter' }));
    } else if (currentPath.includes('tiktok-generator')) {
      setState(prev => ({ ...prev, platform: 'tiktok' }));
    } else if (currentPath.includes('instagram-generator')) {
      setState(prev => ({ ...prev, platform: 'instagram' }));
    } else if (currentPath.includes('youtube-generator')) {
      setState(prev => ({ ...prev, platform: 'youtube' }));
    } else if (currentPath.includes('kick-generator')) {
      setState(prev => ({ ...prev, platform: 'kick_live' }));
    }
  }, [currentPath]);

  // SaaS States & LocalStorage Integration
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return (localStorage.getItem('socialcanvas_is_premium') || localStorage.getItem('depokkomen_is_premium')) === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('socialcanvas_user') || localStorage.getItem('depokkomen_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  const [exportCount, setExportCount] = useState<number>(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('socialcanvas_last_export_date') || localStorage.getItem('depokkomen_last_export_date');
    if (storedDate !== today) {
      localStorage.setItem('socialcanvas_last_export_date', today);
      localStorage.setItem('socialcanvas_export_count', '0');
      return 0;
    }
    const count = localStorage.getItem('socialcanvas_export_count') || localStorage.getItem('depokkomen_export_count');
    return count ? parseInt(count, 10) : 0;
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeReplyEditId, setActiveReplyEditId] = useState<string | null>(null);
  const [isAddingReply, setIsAddingReply] = useState(false);
  
  // Mobile Resizable Preview State
  const [mobilePreviewHeight, setMobilePreviewHeight] = useState(400);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);

  // Drafts & History State & Actions
  const [drafts, setDrafts] = useState<DraftItem[]>(() => {
    const saved = localStorage.getItem('socialcanvas_drafts') || localStorage.getItem('depokkomen_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('socialcanvas_history') || localStorage.getItem('depokkomen_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('socialcanvas_drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem('socialcanvas_history', JSON.stringify(history));
  }, [history]);

  const handleSaveDraft = (name: string, stateToSave: typeof defaultState) => {
    const newDraft: DraftItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim() || `Draf ${new Date().toLocaleDateString('id-ID')}`,
      platform: stateToSave.platform,
      state: { ...stateToSave },
      createdAt: new Date().toISOString(),
      isCloudSynced: isPremium
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const handleRenameDraft = (id: string, newName: string) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, name: newName, createdAt: new Date().toISOString() } : d));
  };

  const handleSaveToHistory = (stateToSave: typeof defaultState) => {
    const newHistory: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      platform: stateToSave.platform,
      state: { ...stateToSave },
      createdAt: new Date().toISOString(),
    };
    // Save up to 20 history items
    setHistory(prev => [newHistory, ...prev.slice(0, 19)]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Handlers for premium simulation
  const handleUpgradeSuccess = () => {
    setIsPremium(true);
    localStorage.setItem('socialcanvas_is_premium', 'true');
  };

  const handleDowngrade = () => {
    setIsPremium(false);
    localStorage.setItem('socialcanvas_is_premium', 'false');
    // Also reset export limit
    setExportCount(0);
    localStorage.setItem('socialcanvas_export_count', '0');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('socialcanvas_user', JSON.stringify(user));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    localStorage.removeItem('socialcanvas_user');
    localStorage.removeItem('depokkomen_user');
  };

  const incrementExportCount = (): boolean => {
    if (isPremium) return true;

    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('socialcanvas_last_export_date') || localStorage.getItem('depokkomen_last_export_date');
    let currentCount = exportCount;

    // Reset daily if date changed
    if (storedDate !== today) {
      localStorage.setItem('socialcanvas_last_export_date', today);
      localStorage.setItem('socialcanvas_export_count', '0');
      setExportCount(0);
      currentCount = 0;
    }

    if (currentCount >= 30) {
      return false; // Limit reached!
    }

    const nextCount = currentCount + 1;
    setExportCount(nextCount);
    localStorage.setItem('socialcanvas_export_count', nextCount.toString());
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

  const [past, setPast] = useState<typeof defaultState[]>([]);
  const [future, setFuture] = useState<typeof defaultState[]>([]);

  const [snapshots, setSnapshots] = useState<{id: string, url: string, timestamp: string}[]>(() => {
    const saved = localStorage.getItem('socialcanvas_snapshots');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('socialcanvas_snapshots', JSON.stringify(snapshots));
  }, [snapshots]);

  const handleAddSnapshot = (url: string) => {
    setSnapshots(prev => [{ id: Math.random().toString(36).substring(2, 9), url, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  };

  const handleStateChange = (updates: Partial<typeof defaultState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      
      // If changing platform to kick_live, default to dark theme
      if (updates.platform === 'kick_live' && prev.platform !== 'kick_live') {
        newState.theme = 'dark';
      }

      if (JSON.stringify(prev) !== JSON.stringify(newState)) {
        setPast(p => [...p, prev]);
        setFuture([]); // clear redo on new action
      }
      return newState;
    });
  };

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setFuture(f => [state, ...f]);
    setState(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setFuture(newFuture);
    setPast(p => [...p, state]);
    setState(next);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.getAttribute('contenteditable') === 'true';

      if (cmdOrCtrl) {
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleSaveDraft(`Draft ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`, state);
        } else if (e.key.toLowerCase() === 'z') {
          if (!isInput) {
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
          }
        } else if (e.key.toLowerCase() === 'y' && !isMac) {
          if (!isInput) {
            e.preventDefault();
            handleRedo();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, past, future]);

  const handleRandomize = () => {
    handleSaveToHistory(state);
    const randomized = getRandomState(state);
    setPast(p => [...p, state]);
    setFuture([]);
    setState(randomized);
  };

  const handleReset = () => {
    handleSaveToHistory(state);
    setPast(p => [...p, state]);
    setFuture([]);
    setState(defaultState);
  };

  const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: 'tiktok', label: 'TikTok', icon: <TikTokColoredIcon className="w-5 h-5" /> },
    { id: 'instagram', label: 'Instagram', icon: <InstagramColoredIcon className="w-5.5 h-5.5" /> },
    { id: 'youtube', label: 'YouTube', icon: <YouTubeColoredIcon className="w-5.5 h-5.5" /> },
    { id: 'twitter', label: 'Twitter / X', icon: <TwitterColoredIcon className="w-5.5 h-5.5" /> },
    { id: 'kick_live', label: 'Kick Live', icon: <KickColoredIcon className="w-5 h-5" /> },
  ];

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setIsDraggingHeight(true);
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStartY.current = clientY;
    dragStartHeight.current = mobilePreviewHeight;
  }, [mobilePreviewHeight]);

  const handleTouchMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDraggingHeight) return;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const deltaY = clientY - dragStartY.current;
    
    // Calculate new height, constrain between 300px and 80vh
    const newHeight = Math.max(300, Math.min(window.innerHeight * 0.8, dragStartHeight.current + deltaY));
    setMobilePreviewHeight(newHeight);
  }, [isDraggingHeight]);

  const handleTouchEnd = useCallback(() => {
    setIsDraggingHeight(false);
  }, []);

  useEffect(() => {
    if (isDraggingHeight) {
      window.addEventListener('mousemove', handleTouchMove);
      window.addEventListener('mouseup', handleTouchEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleTouchMove);
      window.removeEventListener('mouseup', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleTouchMove);
      window.removeEventListener('mouseup', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDraggingHeight, handleTouchMove, handleTouchEnd]);

  if (view === 'landing') {
    return (
      <>
        <LandingPage 
          onStartEditor={(platform) => {
            if (platform) {
              handleStateChange({ platform });
            }
            setView('editor');
          }}
          onUpgradeClick={() => setShowUpgradeModal(true)}
          isPremium={isPremium}
          onLoginClick={() => setShowAuthModal(true)}
          currentUser={currentUser}
          currentPath={currentPath}
          onNavigate={navigateTo}
          theme={appTheme}
        />
        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        {/* Upgrade SaaS Billing Modal */}
        <UpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
          isPremium={isPremium}
          onDowngrade={handleDowngrade}
          exportCount={exportCount}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--root-bg)] text-[var(--root-fg)] font-sans selection:bg-blue-500/30 flex flex-col md:h-screen md:overflow-hidden relative transition-colors duration-300">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[55%] rounded-full bg-glow-blob-1 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[55%] h-[55%] rounded-full bg-glow-blob-2 pointer-events-none z-0"></div>

      {/* Modern responsive header containing platform, home navigation, and profile details */}
      <Header 
        platform={state.platform}
        theme={appTheme}
        onPlatformChange={(platform) => handleStateChange({ platform })}
        onThemeChange={() => setAppTheme(appTheme === 'dark' ? 'light' : 'dark')}
        onGoHome={() => setView('landing')}
        onLoginClick={() => setShowAuthModal(true)}
        currentUser={currentUser}
        isPremium={isPremium}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col md:h-full md:overflow-hidden z-10 min-w-0">
        
        {/* Workspace Panels (Properties & Canvas) */}
        <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 w-full mx-auto md:overflow-hidden md:h-full min-h-0">
          
          {/* Split view panels */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-stretch min-h-0 md:overflow-hidden relative">
            
            {/* Live Preview Area - Order 1 (Top) on Mobile, Order 2 (Right) on PC */}
            <div className="order-1 md:order-2 flex flex-col md:h-auto md:flex-1 md:min-h-0 overflow-hidden relative shrink-0 z-20" style={{ height: typeof window !== "undefined" && window.innerWidth < 768 ? `${mobilePreviewHeight}px` : undefined }}>
               <PreviewArea 
                 state={state} 
                 onStateChange={handleStateChange}
                 isPremium={isPremium}
                 onUpgradeClick={() => setShowUpgradeModal(true)}
                 incrementExportCount={incrementExportCount}
                 exportCount={exportCount}
                 onSaveToHistory={handleSaveToHistory}
                 editingItemId={activeReplyEditId}
                 setEditingItemId={setActiveReplyEditId}
                 isAddingNew={isAddingReply}
                 setIsAddingNew={setIsAddingReply}
                 onAddSnapshot={handleAddSnapshot}
                 onRandomize={handleRandomize}
               />

               {/* Mobile Drag Handle */}
               <div 
                  className="md:hidden absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center cursor-ns-resize bg-gradient-to-t from-[var(--root-bg)] to-transparent z-[100]"
                  onMouseDown={handleTouchStart}
                  onTouchStart={handleTouchStart}
               >
                 <div className="w-12 h-1.5 bg-white/30 backdrop-blur shadow-sm rounded-full pointer-events-none" />
               </div>
            </div>

            {/* Properties Panel - Order 2 (Bottom) on Mobile, Order 1 (Left) on PC */}
            <div className="order-2 md:order-1 w-full md:w-[320px] lg:w-[365px] flex flex-col shrink-0 md:shrink md:min-h-0 md:overflow-hidden z-10">
              <Sidebar 
                state={state} 
                onChange={handleStateChange}
                onReset={handleReset}
                isPremium={isPremium}
                exportCount={exportCount}
                onUpgradeClick={() => setShowUpgradeModal(true)}
                drafts={drafts}
                history={history}
                onSaveDraft={handleSaveDraft}
                onDeleteDraft={handleDeleteDraft}
                onRenameDraft={handleRenameDraft}
                onClearHistory={handleClearHistory}
                onEditReply={(id) => { setActiveReplyEditId(id); setIsAddingReply(false); }}
                onAddReply={() => { setIsAddingReply(true); setActiveReplyEditId(null); }}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={past.length > 0}
                canRedo={future.length > 0}
                snapshots={snapshots}
                onDeleteSnapshot={handleDeleteSnapshot}
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

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
