import React, { useState } from 'react';
import { CommentState } from '../../types';
import { Button, Input, Textarea, Label } from '../ui';
import { Plus, Trash2, Shuffle, ChevronDown, ChevronUp, GripVertical, Copy } from 'lucide-react';
import { maleUsernames, femaleUsernames, getRandomAvatarUrl } from '../../utils';
import { motion, Reorder } from 'motion/react';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
}

export function SectionReplies({ state, onChange }: Props) {
  const isLiveMode = state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live');
  
  // Choose which list to render
  const listKey = isLiveMode ? 'additionalComments' : 'nestedReplies';
  const items = state[listKey] || [];

  const handleAdd = () => {
    const isMale = Math.random() > 0.5;
    const array = isMale ? maleUsernames : femaleUsernames;
    const newName = array[Math.floor(Math.random() * array.length)];
    const newHandle = `@${newName.replace(/\\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 100)}`;
    const id = Math.random().toString(36).substring(7);

    if (isLiveMode) {
      const newComment = {
        id,
        username: newName,
        avatarUrl: getRandomAvatarUrl(isMale ? 'male' : 'female'),
        isVerified: false,
        commentText: 'Komentar tambahan...'
      };
      onChange({ additionalComments: [...(state.additionalComments || []), newComment] });
    } else {
      const newReply = {
        id,
        username: newName,
        handle: newHandle,
        avatarUrl: getRandomAvatarUrl(isMale ? 'male' : 'female'),
        isVerified: false,
        commentText: 'Membalas: setuju banget!',
        timestamp: '1j lalu',
        likeCount: '0',
        creatorLiked: false,
      };
      onChange({ nestedReplies: [...(state.nestedReplies || []), newReply] });
    }
  };

  const handleUpdate = (id: string, updates: any) => {
    if (isLiveMode) {
      const updated = (state.additionalComments || []).map(c => c.id === id ? { ...c, ...updates } : c);
      onChange({ additionalComments: updated });
    } else {
      const updated = (state.nestedReplies || []).map(r => r.id === id ? { ...r, ...updates } : r);
      onChange({ nestedReplies: updated });
    }
  };

  const handleRemove = (id: string) => {
    if (isLiveMode) {
      onChange({ additionalComments: (state.additionalComments || []).filter(c => c.id !== id) });
    } else {
      onChange({ nestedReplies: (state.nestedReplies || []).filter(r => r.id !== id) });
    }
  };

  const handleDuplicate = (item: any) => {
    const newId = Math.random().toString(36).substring(7);
    if (isLiveMode) {
      onChange({ additionalComments: [...(state.additionalComments || []), { ...item, id: newId }] });
    } else {
      onChange({ nestedReplies: [...(state.nestedReplies || []), { ...item, id: newId }] });
    }
  };

  const handleReorder = (newItems: any[]) => {
    onChange({ [listKey]: newItems } as any);
  };

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="secondary" onClick={handleAdd} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add {isLiveMode ? 'Comment' : 'Reply'}
      </Button>

      {items.length === 0 && (
        <div className="text-center py-6 text-xs text-[var(--text-muted)] border border-dashed border-[var(--panel-border)] rounded-lg bg-[var(--root-bg)]">
          No {isLiveMode ? 'comments' : 'replies'} yet.
        </div>
      )}

      {items.length > 0 && (
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="flex flex-col gap-3">
          {items.map((rawItem, index) => {
            const item = rawItem as any;
            const isExpanded = expandedId === item.id;
            return (
              <Reorder.Item key={item.id} value={item} className="bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg overflow-hidden shadow-sm">
                {/* Header / Collapsed View */}
                <div className="flex items-center p-3 gap-3 bg-[var(--panel-bg)] hover:bg-[var(--root-bg)] transition-colors cursor-pointer group" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                  <div className="cursor-grab active:cursor-grabbing p-1 text-[var(--text-muted)] hover:text-[var(--root-fg)]" onPointerDown={(e) => e.stopPropagation()}>
                    <GripVertical className="w-4 h-4" />
                  </div>
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} className="w-6 h-6 rounded-full border border-[var(--panel-border)] object-cover bg-white shrink-0" alt="Avatar" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-dashed border-[var(--panel-border)] shrink-0"></div>
                  )}
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[var(--root-fg)] truncate">{item.username || 'Anonymous'}</span>
                    <span className="text-[10px] text-[var(--text-muted)] truncate">{item.commentText}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-70 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDuplicate(item); }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 rounded-md hover:bg-blue-500/10 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-red-500 rounded-md hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[var(--text-muted)] p-1 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Form */}
                {isExpanded && (
                  <div className="p-4 border-t border-[var(--panel-border)] flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="secondary" 
                        className="text-xs py-1.5 flex-1"
                        onClick={() => {
                          const isMale = Math.random() > 0.5;
                          const array = isMale ? maleUsernames : femaleUsernames;
                          handleUpdate(item.id, { 
                            avatarUrl: getRandomAvatarUrl(isMale ? 'male' : 'female'),
                            username: array[Math.floor(Math.random() * array.length)]
                          });
                        }}
                      >
                        <Shuffle className="w-3.5 h-3.5 mr-1.5" /> Randomize Profile
                      </Button>
                      <Button variant="danger" className="text-xs py-1.5" onClick={() => handleUpdate(item.id, { avatarUrl: '' })}>
                        Clear Avatar
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Label>Username</Label>
                        <Input value={item.username} onChange={e => handleUpdate(item.id, { username: e.target.value })} />
                      </div>
                      
                      {!isLiveMode && (
                        <>
                          <div className="col-span-2">
                            <Label>Handle</Label>
                            <Input value={item.handle || ''} onChange={e => handleUpdate(item.id, { handle: e.target.value })} />
                          </div>
                          <div>
                            <Label>Time</Label>
                            <Input value={item.timestamp || ''} onChange={e => handleUpdate(item.id, { timestamp: e.target.value })} />
                          </div>
                          <div>
                            <Label>Likes</Label>
                            <Input value={item.likeCount || ''} onChange={e => handleUpdate(item.id, { likeCount: e.target.value })} />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={item.isVerified}
                          onChange={e => handleUpdate(item.id, { isVerified: e.target.checked })}
                          className="w-4 h-4 rounded border-[var(--panel-border)] text-blue-600 focus:ring-blue-600 bg-[var(--root-bg)] cursor-pointer"
                        />
                        <span className="text-xs font-medium text-[var(--root-fg)] group-hover:text-blue-500 transition-colors">Verified Badge</span>
                      </label>
                      {!isLiveMode && (
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={item.creatorLiked || false}
                            onChange={e => handleUpdate(item.id, { creatorLiked: e.target.checked })}
                            className="w-4 h-4 rounded border-[var(--panel-border)] text-red-500 focus:ring-red-500 bg-[var(--root-bg)] cursor-pointer"
                          />
                          <span className="text-xs font-medium text-[var(--root-fg)] group-hover:text-red-500 transition-colors">Creator Liked</span>
                        </label>
                      )}
                    </div>

                    <div>
                      <Label>Comment Text</Label>
                      <Textarea 
                        value={item.commentText} 
                        onChange={e => handleUpdate(item.id, { commentText: e.target.value })}
                        className="h-20"
                      />
                    </div>

                    <div className="mt-2 pt-3 border-t border-[var(--panel-border)] flex justify-end">
                      <Button 
                        variant="danger" 
                        onClick={() => handleRemove(item.id)}
                        className="w-full text-xs py-2 gap-1.5 flex items-center justify-center cursor-pointer font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus {isLiveMode ? 'Komentar' : 'Balasan'}
                      </Button>
                    </div>
                  </div>
                )}
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
}
