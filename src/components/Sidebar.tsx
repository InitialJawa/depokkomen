import React from 'react';
import { CommentState } from '../types';
import { Accordion } from './Sidebar/Accordion';
import { SectionBasic } from './Sidebar/SectionBasic';
import { SectionComment } from './Sidebar/SectionComment';
import { SectionAppearance } from './Sidebar/SectionAppearance';
import { SectionReplies } from './Sidebar/SectionReplies';
import { Shuffle, RotateCcw, Sliders, MessageSquare, Palette, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
  onRandomize: () => void;
  onReset?: () => void;
  isPremium: boolean;
  exportCount: number;
  onUpgradeClick: () => void;
}

export function Sidebar({ state, onChange, onRandomize, onReset, isPremium, exportCount, onUpgradeClick }: Props) {
  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden w-full lg:w-[365px] shrink-0 shadow-lg">
      <div className="p-4.5 border-b border-[var(--panel-border)] flex items-center justify-between bg-[var(--panel-bg-translucent)] backdrop-blur-md z-10 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--root-fg)] opacity-90">Properties</h2>
        <div className="flex items-center gap-1.5">
          {onReset && (
            <Button variant="ghost" onClick={onReset} title="Reset" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--button-hover)] transition-all">
              <RotateCcw className="w-3.5 h-3.5 text-[var(--root-fg)]" />
            </Button>
          )}
          <Button variant="secondary" onClick={onRandomize} className="px-3 h-8 text-xs font-semibold gap-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border-blue-500/20 text-blue-400">
            <Shuffle className="w-3.5 h-3.5" />
            Randomize
          </Button>
        </div>
      </div>

      {/* SaaS Premium Status Widget */}
      <div className={`p-4 mx-4.5 my-3 rounded-2xl border bg-gradient-to-br transition-all flex flex-col gap-3 shadow-sm select-none shrink-0 ${
        isPremium 
          ? 'from-blue-500/10 to-indigo-500/10 border-blue-500/20' 
          : 'from-[var(--input-bg)] to-[var(--input-bg)] border-[var(--panel-border)]'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xl ${isPremium ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/15 text-[var(--text-muted)]'}`}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Keanggotaan</div>
              <div className="text-xs font-extrabold flex items-center gap-1">
                {isPremium ? (
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">PRO Creator</span>
                ) : (
                  <span className="text-[var(--root-fg)]">Free Plan</span>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={onUpgradeClick}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              isPremium 
                ? 'bg-[var(--root-bg)] text-blue-400 border border-blue-500/20 hover:bg-blue-500/10' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {isPremium ? 'Detail PRO' : 'Upgrade PRO'}
          </button>
        </div>

        {/* Progress Limit indicator */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-semibold text-[var(--text-muted)]">
            <span>Batas Ekspor Harian</span>
            <span>{isPremium ? 'Tanpa Batas (∞)' : `${exportCount} / 30 ekspor`}</span>
          </div>
          <div className="h-1.5 w-full bg-[var(--root-bg)] rounded-full overflow-hidden border border-[var(--panel-border)]/50">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isPremium ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-blue-500'
              }`}
              style={{ width: isPremium ? '100%' : `${Math.min(100, (exportCount / 30) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Accordion title="Basic" icon={<Sliders className="w-4 h-4 text-blue-500" />} defaultOpen={true}>
          <SectionBasic state={state} onChange={onChange} />
        </Accordion>
        
        <Accordion title="Comment" icon={<MessageSquare className="w-4 h-4 text-emerald-500" />} defaultOpen={true}>
          <SectionComment state={state} onChange={onChange} />
        </Accordion>
        
        <Accordion title="Appearance" icon={<Palette className="w-4 h-4 text-indigo-500" />} defaultOpen={false}>
          <SectionAppearance state={state} onChange={onChange} />
        </Accordion>
        
        <Accordion 
          title={state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live') ? 'Additional Comments' : 'Nested Replies'} 
          icon={<MessageCircle className="w-4 h-4 text-pink-500" />}
          defaultOpen={false}
        >
          <SectionReplies state={state} onChange={onChange} />
        </Accordion>
      </div>
    </div>
  );
}
