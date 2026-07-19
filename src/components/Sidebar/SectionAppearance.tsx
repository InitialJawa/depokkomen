import React from 'react';
import { CommentState } from '../../types';
import { Label, Select } from '../ui';
import { Sun, Moon } from 'lucide-react';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
}

export function SectionAppearance({ state, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label>Font Family</Label>
        <Select 
          value={state.fontFamily || 'san-francisco'}
          onChange={(e) => onChange({ fontFamily: e.target.value as any })}
        >
          <option value="san-francisco">San Francisco (System iOS)</option>
          <option value="roboto">Roboto (Android)</option>
          <option value="inter">Inter (Modern Sans)</option>
          <option value="space-grotesk">Space Grotesk (Tech Display)</option>
          <option value="poppins">Poppins (Clean Round)</option>
          <option value="playfair-display">Playfair Display (Serif)</option>
          <option value="jetbrains-mono">JetBrains Mono (Code)</option>
        </Select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="mb-0">Font Size</Label>
          <span className="text-xs font-mono bg-[var(--root-bg)] border border-[var(--panel-border)] px-2 py-0.5 rounded text-[var(--text-muted)]">{state.fontSize || 15}px</span>
        </div>
        <input 
          type="range" 
          min="12" max="24" step="1"
          value={state.fontSize || 15}
          onChange={e => onChange({ fontSize: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="mb-0">Padding</Label>
          <span className="text-xs font-mono bg-[var(--root-bg)] border border-[var(--panel-border)] px-2 py-0.5 rounded text-[var(--text-muted)]">{state.padding ?? 16}px</span>
        </div>
        <input 
          type="range" 
          min="8" max="32" step="1"
          value={state.padding ?? 16}
          onChange={e => onChange({ padding: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="mb-0">Border Radius</Label>
          <span className="text-xs font-mono bg-[var(--root-bg)] border border-[var(--panel-border)] px-2 py-0.5 rounded text-[var(--text-muted)]">{state.borderRadius ?? 12}px</span>
        </div>
        <input 
          type="range" 
          min="0" max="48" step="1"
          value={state.borderRadius ?? 12}
          onChange={e => onChange({ borderRadius: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="mb-0">Lebar Kartu (Width)</Label>
          <span className="text-xs font-mono bg-[var(--root-bg)] border border-[var(--panel-border)] px-2 py-0.5 rounded text-[var(--text-muted)]">
            {(state.autoWidth ?? true) ? 'Otomatis' : `${state.cardWidth ?? 480}px`}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mb-2.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={state.autoWidth ?? true}
              onChange={e => onChange({ autoWidth: e.target.checked })}
              className="w-4 h-4 rounded border-[var(--panel-border)] text-blue-600 focus:ring-blue-600 bg-[var(--root-bg)] cursor-pointer"
            />
            <span className="text-xs font-semibold text-[var(--root-fg)] group-hover:text-blue-500 transition-colors">Lebar Otomatis (Auto Adjust)</span>
          </label>
        </div>

        {!(state.autoWidth ?? true) && (
          <input 
            type="range" 
            min="280" max="650" step="10"
            value={state.cardWidth ?? 480}
            onChange={e => onChange({ cardWidth: parseInt(e.target.value) })}
            className="w-full accent-blue-500"
          />
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={state.hasDropShadow ?? true}
            onChange={e => onChange({ hasDropShadow: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--panel-border)] text-blue-600 focus:ring-blue-600 bg-[var(--root-bg)] cursor-pointer"
          />
          <span className="text-xs font-medium text-[var(--root-fg)] group-hover:text-blue-500 transition-colors">Drop Shadow</span>
        </label>
      </div>

      {state.platform === 'tiktok' && state.tiktokTemplate === 'reply' && (
        <div className="pt-2 border-t border-[var(--panel-border)]">
          <Label>Reply Bubble Color</Label>
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--panel-border)] shrink-0">
              <input 
                type="color" 
                value={state.replyBubbleColor || '#ffffff'}
                onChange={e => onChange({ replyBubbleColor: e.target.value })}
                className="absolute -inset-2 w-12 h-12 cursor-pointer"
              />
            </div>
            <div className="flex-1">
               <span className="text-xs font-mono text-[var(--text-muted)] uppercase">{state.replyBubbleColor || 'Default'}</span>
            </div>
            <button 
              onClick={() => onChange({ replyBubbleColor: '' })}
              className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {(state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live')) && (
         <div className="pt-2 border-t border-[var(--panel-border)]">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={state.hideLiveBackground || false}
                onChange={e => onChange({ hideLiveBackground: e.target.checked })}
                className="w-4 h-4 rounded border-[var(--panel-border)] text-blue-600 focus:ring-blue-600 bg-[var(--root-bg)] cursor-pointer"
              />
              <span className="text-xs font-medium text-[var(--root-fg)] group-hover:text-blue-500 transition-colors">Transparent Background</span>
            </label>
         </div>
      )}
    </div>
  );
}
