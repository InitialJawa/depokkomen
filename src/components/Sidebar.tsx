import React from 'react';
import { CommentState } from '../types';
import { Accordion } from './Sidebar/Accordion';
import { SectionBasic } from './Sidebar/SectionBasic';
import { SectionComment } from './Sidebar/SectionComment';
import { SectionAppearance } from './Sidebar/SectionAppearance';
import { SectionReplies } from './Sidebar/SectionReplies';
import { Shuffle, RotateCcw, Sliders, MessageSquare, Palette, MessageCircle } from 'lucide-react';
import { Button } from './ui';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
  onRandomize: () => void;
  onReset?: () => void;
}

export function Sidebar({ state, onChange, onRandomize, onReset }: Props) {
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
