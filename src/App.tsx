import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlatformSelector } from './components/PlatformSelector';
import { CommentForm } from './components/CommentForm';
import { PreviewArea } from './components/PreviewArea';
import { defaultState } from './types';
import { getRandomState } from './utils';

export default function App() {
  const [state, setState] = useState(defaultState);
  const [appTheme, setAppTheme] = useState<'light' | 'dark'>('dark');

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

  return (
    <div className="min-h-screen bg-[var(--root-bg)] text-[var(--root-fg)] font-sans selection:bg-[var(--accent)]/30 flex flex-col h-screen overflow-hidden">
      <Header 
        platform={state.platform}
        theme={appTheme}
        onPlatformChange={(platform) => handleStateChange({ platform })}
        onThemeChange={setAppTheme}
      />
      
      <main className="flex-1 flex flex-col p-4 lg:p-6 gap-4 lg:gap-6 w-full max-w-[1440px] mx-auto overflow-y-auto h-full">
        
        <div className="lg:hidden shrink-0">
          <PlatformSelector 
            platform={state.platform} 
            onChange={(platform) => handleStateChange({ platform })} 
          />
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch min-h-0">
          <div className="w-full lg:w-[420px] shrink-0 flex flex-col min-h-0">
             <CommentForm 
               state={state} 
               onChange={handleStateChange}
               onRandomize={handleRandomize}
             />
          </div>
          
          <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0">
             <PreviewArea 
               state={state} 
               onStateChange={handleStateChange}
             />
          </div>
        </div>
      </main>

      {/* Footer info / Disclaimer */}
      <footer className="h-12 flex items-center justify-between shrink-0 px-4 lg:px-6 w-full max-w-[1440px] mx-auto mt-auto text-xs text-[var(--text-muted)]">
        <p className="font-medium tracking-wide hidden sm:block">
          Hanya untuk keperluan konten kreatif & edukasi. Jangan digunakan untuk menyebarkan misinformasi.
        </p>
        <div className="flex items-center gap-4 text-center sm:text-right w-full sm:w-auto justify-center font-medium">
          <span className="text-[var(--accent)] tracking-tight">Built for Indonesia UGC</span>
          <span>v1.0.0 Stable</span>
        </div>
      </footer>
    </div>
  );
}

