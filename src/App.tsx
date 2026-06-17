import { useState } from 'react';
import { Header } from './components/Header';
import { PlatformSelector } from './components/PlatformSelector';
import { CommentForm } from './components/CommentForm';
import { PreviewArea } from './components/PreviewArea';
import { defaultState } from './types';
import { getRandomState } from './utils';

export default function App() {
  const [state, setState] = useState(defaultState);

  const handleStateChange = (updates: Partial<typeof defaultState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleRandomize = () => {
    setState(prev => getRandomState(prev));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F9FAFB] font-sans selection:bg-blue-500/30 flex flex-col h-screen overflow-hidden">
      <Header 
        platform={state.platform}
        onPlatformChange={(platform) => handleStateChange({ platform })}
      />
      
      <main className="flex-1 flex flex-col p-4 lg:p-6 gap-4 lg:gap-6 w-full max-w-[1440px] mx-auto overflow-y-auto lg:overflow-hidden h-full">
        


        <div className="lg:hidden shrink-0">
          <PlatformSelector 
            platform={state.platform} 
            onChange={(platform) => handleStateChange({ platform })} 
          />
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch min-h-0">
          <div className="w-full lg:w-[400px] shrink-0 flex flex-col min-h-0">
             <CommentForm 
               state={state} 
               onChange={handleStateChange}
               onRandomize={handleRandomize}
             />
          </div>
          
          <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0">
             <PreviewArea 
               state={state} 
               onTransparentChange={(isTransparentBg) => handleStateChange({ isTransparentBg })}
               onStateChange={handleStateChange}
             />
          </div>
        </div>

        {/* Footer info / Disclaimer */}
        <footer className="mt-auto h-10 border-t border-[#2D2D2D] flex items-center justify-between shrink-0 px-2 lg:px-0 lg:-mx-6 lg:px-6">
          <p className="text-[10px] text-gray-600 font-medium tracking-wide uppercase hidden sm:block">
            Hanya untuk keperluan konten kreatif & edukasi. Jangan digunakan untuk menyebarkan misinformasi.
          </p>
          <div className="flex items-center gap-4 text-center sm:text-right w-full sm:w-auto justify-center">
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Built for Indonesia UGC</span>
            <span className="text-[10px] text-gray-600">v1.0.0 Stable</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

