import React from 'react';
import { CommentState, DraftItem, HistoryItem } from '../types';
import { Accordion } from './Sidebar/Accordion';
import { SectionAppearance } from './Sidebar/SectionAppearance';
import { SectionReplies } from './Sidebar/SectionReplies';
import { SectionDrafts } from './Sidebar/SectionDrafts';
import { Label, Input, Textarea, Button, Select } from './ui';
import { 
  Shuffle, RotateCcw, Sliders, MessageSquare, Palette, MessageCircle, 
  Sparkles, FolderHeart, Image, Highlighter, EyeOff, Scissors, Trash2,
  Heart, Pin, BadgeCheck, HelpCircle, User, Type, Clock
} from 'lucide-react';
import { maleUsernames, femaleUsernames, getRandomAvatarUrl } from '../utils';

interface Props {
  state: CommentState;
  onChange: (updates: Partial<CommentState>) => void;
  onReset?: () => void;
  isPremium: boolean;
  exportCount: number;
  onUpgradeClick: () => void;
  drafts: DraftItem[];
  history: HistoryItem[];
  onSaveDraft: (name: string, state: CommentState) => void;
  onDeleteDraft: (id: string) => void;
  onRenameDraft: (id: string, newName: string) => void;
  onClearHistory: () => void;
  onEditReply?: (id: string) => void;
  onAddReply?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  snapshots: {id: string, url: string, timestamp: string}[];
  onDeleteSnapshot: (id: string) => void;
}

export function Sidebar({ 
  state, 
  onChange, 
  onReset, 
  isPremium, 
  exportCount, 
  onUpgradeClick,
  drafts,
  history,
  onSaveDraft,
  onDeleteDraft,
  onRenameDraft,
  onClearHistory,
  onEditReply,
  onAddReply,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  snapshots,
  onDeleteSnapshot
}: Props) {
  const [activeTab, setActiveTab] = React.useState<'comment' | 'engagement' | 'advanced' | 'gallery'>('comment');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const applyFormat = (tag: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = state.commentText;
    if (start !== end) {
      const selectedText = text.substring(start, end);
      const newText = text.substring(0, start) + `[${tag}]` + selectedText + `[/${tag}]` + text.substring(end);
      onChange({ commentText: newText });
      
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start, start + tag.length * 2 + 5 + selectedText.length);
      }, 0);
    } else {
      alert('Tandai / blok teks komentar terlebih dahulu!');
    }
  };

  const resetFormat = () => {
    const newText = state.commentText.replace(/\[\/?(highlight|blur|cut)\]/g, '');
    onChange({ commentText: newText });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomAvatar = () => {
    const isMale = Math.random() > 0.5;
    const array = isMale ? maleUsernames : femaleUsernames;
    const newName = array[Math.floor(Math.random() * array.length)];
    const newHandle = `@${newName.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 100)}`;
    onChange({ 
      avatarUrl: getRandomAvatarUrl(isMale ? 'male' : 'female'),
      username: newName,
      handle: newHandle
    });
  };

  const handleQuickSave = () => {
    const formattedDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const defaultName = `Draf ${state.platform.toUpperCase()} - ${formattedDate}`;
    const name = window.prompt('Masukkan nama draf Anda:', defaultName);
    if (name !== null) {
      onSaveDraft(name.trim() || defaultName, state);
    }
  };

  const presets = [
    { icon: "🔥", category: "Viral", label: "Kawal FYP", text: "Kawal sampai tembus fyp 🔥🚀" },
    { icon: "😂", category: "Funny", label: "Relate", text: "Agak laen emang, tapi relate banget woy 😭😭" },
    { icon: "🙏", category: "Spill", label: "Spill", text: "Spill produknya dung kak 🙏" },
    { icon: "🩴", category: "Wait", label: "Nitip", text: "Nitip sendal, kalo rame kabarin 🩴" }
  ];

  return (
    <div className="flex flex-col md:h-full glass-panel rounded-2xl md:overflow-hidden w-full md:w-[320px] lg:w-[365px] shrink-0 shadow-lg">
      <div className="p-4 border-b border-[var(--panel-border)] flex items-center justify-between bg-[var(--panel-bg-translucent)] backdrop-blur-md z-10 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--root-fg)] opacity-90">Properties</h2>
        <div className="flex items-center gap-1.5">
          <Button 
            variant="ghost" 
            onClick={handleQuickSave} 
            title="Simpan Draf Cepat" 
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--button-hover)] text-blue-500 hover:text-blue-400 transition-all cursor-pointer"
          >
            <FolderHeart className="w-4 h-4" />
          </Button>
          {onReset && (
            <Button variant="ghost" onClick={onReset} title="Reset" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--button-hover)] transition-all cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5 text-[var(--root-fg)]" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Scrollable area for properties */}
      <div className="md:flex-1 md:overflow-y-auto custom-scrollbar flex flex-col">
        {/* TAB NAVIGATION */}
        <div className="flex border-b border-[var(--panel-border)] bg-[var(--panel-bg-translucent)] sticky top-0 z-20">
          <button 
            onClick={() => setActiveTab('comment')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'comment' ? 'border-blue-500 text-[var(--root-fg)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--panel-border)]'}`}
          >
            Comment
          </button>
          <button 
            onClick={() => setActiveTab('engagement')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'engagement' ? 'border-emerald-500 text-[var(--root-fg)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--panel-border)]'}`}
          >
            Engagement
          </button>
          <button 
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'advanced' ? 'border-pink-500 text-[var(--root-fg)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--panel-border)]'}`}
          >
            Advanced
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'gallery' ? 'border-purple-500 text-[var(--root-fg)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--panel-border)]'}`}
          >
            Gallery
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 flex flex-col">
          {/* COMMENT TAB */}
          {activeTab === 'comment' && (
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* TEMPLATE (Visible only for TikTok/Instagram) */}
              {(state.platform === 'tiktok' || state.platform === 'instagram') && (
                <div className="p-4.5 border-b border-[var(--panel-border)] flex flex-col gap-3">
                  {state.platform === 'tiktok' && (
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-[var(--root-fg)] mb-2 block">Template TikTok</Label>
                      <div className="flex bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
                        <button
                          onClick={() => onChange({ tiktokTemplate: 'video' })}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.tiktokTemplate === 'video' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--root-fg)]'}`}
                        >
                          Video Comment
                        </button>
                        <button
                          onClick={() => onChange({ tiktokTemplate: 'reply' })}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.tiktokTemplate === 'reply' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--root-fg)]'}`}
                        >
                          Reply Bubble
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {state.platform === 'instagram' && (
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-[var(--root-fg)] mb-2 block">Template Instagram</Label>
                      <div className="flex bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
                        <button
                          onClick={() => onChange({ instagramTemplate: 'comment' })}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.instagramTemplate === 'comment' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--root-fg)]'}`}
                        >
                          Post Comment
                        </button>
                        <button
                          onClick={() => onChange({ instagramTemplate: 'live' })}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${state.instagramTemplate === 'live' ? 'bg-[var(--panel-bg)] shadow text-[var(--root-fg)]' : 'text-[var(--text-muted)] cursor-pointer hover:text-[var(--root-fg)]'}`}
                        >
                          Live Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AVATAR */}
              <div className="p-4.5 border-b border-[var(--panel-border)] flex flex-col gap-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-[var(--root-fg)]">Avatar</Label>
                <div className="flex items-center gap-4">
                  <div className="shrink-0 relative group">
                    {state.avatarUrl ? (
                      <img src={state.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-[var(--panel-border)] bg-[var(--root-bg)] shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full border border-dashed border-[var(--text-muted)] bg-[var(--root-bg)] flex items-center justify-center">
                        <Image className="w-5 h-5 text-[var(--text-muted)] opacity-50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        id="sidebar-avatar-upload" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload} 
                      />
                      <label 
                        htmlFor="sidebar-avatar-upload" 
                        className="flex-1 cursor-pointer inline-flex items-center justify-center px-3 py-1.5 bg-[var(--root-bg)] hover:bg-[var(--panel-border)] border border-[var(--panel-border)] rounded-lg text-xs text-[var(--root-fg)] font-semibold transition-all shadow-sm"
                      >
                        Upload
                      </label>
                      <Button variant="secondary" onClick={handleRandomAvatar} className="flex-1 text-xs py-1.5 px-3 rounded-lg cursor-pointer font-semibold" title="Acak Profil">
                        Random
                      </Button>
                    </div>
                    {state.avatarUrl && (
                      <Button variant="danger" onClick={() => onChange({ avatarUrl: '' })} className="w-full text-xs py-1 h-auto cursor-pointer font-semibold">
                        Hapus Avatar
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* USERNAME */}
              <div className="p-4.5 border-b border-[var(--panel-border)] flex flex-col gap-3">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-[var(--root-fg)] mb-1.5">Username</Label>
                  <Input 
                    value={state.username} 
                    onChange={e => onChange({ username: e.target.value })}
                    placeholder="John Doe"
                    className="w-full text-xs"
                  />
                </div>
                
                {state.platform === 'twitter' && (
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-[var(--root-fg)] mb-1.5">@Handle</Label>
                    <Input 
                      value={state.handle} 
                      onChange={e => onChange({ handle: e.target.value })}
                      placeholder="@johndoe"
                      className="w-full text-xs"
                    />
                  </div>
                )}
              </div>

              {/* COMMENT TEXT */}
              <div className="p-4.5 border-b border-[var(--panel-border)] flex flex-col gap-2.5">
                <div className="flex justify-between items-end mb-1">
                  <Label className="mb-0 text-xs font-bold uppercase tracking-wider text-[var(--root-fg)]">Comment Text</Label>
                  <div className="flex gap-1 bg-[var(--root-bg)] p-0.5 rounded border border-[var(--panel-border)]">
                    {['👍', '❤️', '😂', '🔥', '😭'].map(emoji => (
                      <button 
                        key={emoji}
                        onClick={() => onChange({ commentText: state.commentText + emoji })}
                        className="text-xs hover:bg-[var(--panel-border)] w-5.5 h-5.5 rounded flex items-center justify-center transition-colors cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea 
                  ref={textareaRef}
                  value={state.commentText} 
                  onChange={e => onChange({ commentText: e.target.value })}
                  className="h-28 text-xs"
                  placeholder="Type your comment..."
                />
                
                {/* Advanced Formatting Toolbar */}
                <div className="flex items-center justify-between bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-lg p-1">
                  <div className="flex gap-1">
                    <button title="Highlight" type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('highlight'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-yellow-500 transition-colors cursor-pointer">
                      <Highlighter className="w-4 h-4" />
                    </button>
                    <button title="Blur" type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('blur'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-blue-500 transition-colors cursor-pointer">
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button title="Cut" type="button" onMouseDown={(e) => { e.preventDefault(); applyFormat('cut'); }} className="w-8 h-8 rounded-md hover:bg-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer">
                      <Scissors className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-[1px] h-4 bg-[var(--panel-border)] mx-1" />
                  <button title="Reset Formatting" type="button" onClick={resetFormat} className="w-8 h-8 rounded-md hover:bg-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-colors cursor-pointer">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ENGAGEMENT TAB */}
          {activeTab === 'engagement' && (
            <div className="flex flex-col p-4.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Likes</Label>
                  <Input 
                    value={state.likeCount} 
                    onChange={e => onChange({ likeCount: e.target.value })}
                    placeholder="1.2K"
                    className="text-xs"
                  />
                </div>

                <div>
                  <Label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Waktu</Label>
                  <Input 
                    value={state.timestamp} 
                    onChange={e => onChange({ timestamp: e.target.value })}
                    placeholder="2j lalu"
                    className="text-xs"
                  />
                </div>

                {state.platform === 'twitter' && (
                  <>
                    <div>
                      <Label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Retweets</Label>
                      <Input 
                        value={state.retweetCount} 
                        onChange={e => onChange({ retweetCount: e.target.value })}
                        placeholder="800"
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Views</Label>
                      <Input 
                        value={state.viewCount} 
                        onChange={e => onChange({ viewCount: e.target.value })}
                        placeholder="1.2M"
                        className="text-xs"
                      />
                    </div>
                  </>
                )}

                {state.platform === 'youtube' && (
                  <div>
                    <Label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">Replies</Label>
                    <Input 
                      value={state.replyCount} 
                      onChange={e => onChange({ replyCount: e.target.value })}
                      placeholder="24"
                      className="text-xs"
                    />
                  </div>
                )}

                {/* Checkboxes */}
                <div className="col-span-2 flex flex-col gap-2 mt-2 pt-4 border-t border-[var(--panel-border)]">
                  <Label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase mb-2">Tanda / Lencana</Label>
                  <label className="flex items-center gap-2 cursor-pointer group select-none bg-[var(--panel-bg-translucent)] p-2 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--panel-border)] transition-colors">
                    <input 
                      type="checkbox" 
                      checked={state.isVerified}
                      onChange={e => onChange({ isVerified: e.target.checked })}
                      className="w-4 h-4 rounded border-[var(--panel-border)] text-blue-600 focus:ring-blue-600 bg-[var(--root-bg)] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[var(--root-fg)] group-hover:text-blue-500 transition-colors">Verified Badge</span>
                  </label>
                  
                  {(state.platform === 'tiktok' || state.platform === 'youtube' || state.platform === 'instagram') && (
                    <>
                      <label className="flex items-center gap-2 cursor-pointer group select-none bg-[var(--panel-bg-translucent)] p-2 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--panel-border)] transition-colors">
                        <input 
                          type="checkbox" 
                          checked={state.creatorLiked}
                          onChange={e => onChange({ creatorLiked: e.target.checked })}
                          className="w-4 h-4 rounded border-[var(--panel-border)] text-red-500 focus:ring-red-500 bg-[var(--root-bg)] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-[var(--root-fg)] group-hover:text-red-500 transition-colors">Creator Liked</span>
                      </label>

                      {!(state.platform === 'tiktok' && state.tiktokTemplate === 'reply') && !(state.platform === 'instagram' && state.instagramTemplate === 'live') && (
                        <label className="flex items-center gap-2 cursor-pointer group select-none bg-[var(--panel-bg-translucent)] p-2 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--panel-border)] transition-colors">
                          <input 
                            type="checkbox" 
                            checked={state.isPinned}
                            onChange={e => onChange({ isPinned: e.target.checked })}
                            className="w-4 h-4 rounded border-[var(--panel-border)] text-[var(--text-muted)] focus:ring-gray-500 bg-[var(--root-bg)] cursor-pointer"
                          />
                          <span className="text-xs font-semibold text-[var(--root-fg)] group-hover:text-[var(--text-muted)] transition-colors">Pinned Comment</span>
                        </label>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-4.5 border-b border-[var(--panel-border)]">
                <Label className="text-xs font-semibold mb-1.5 block">Platform</Label>
                <Select 
                  value={state.platform}
                  onChange={e => onChange({ platform: e.target.value as any })}
                  className="w-full text-xs"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="kick_live">Kick Live</option>
                </Select>
              </div>

              {/* NESTED REPLIES */}
              <div className="p-4.5 border-b border-[var(--panel-border)]">
                <div className="flex items-center justify-between mb-3.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-[var(--root-fg)] mb-0 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                    {state.platform === 'kick_live' || (state.platform === 'instagram' && state.instagramTemplate === 'live') ? 'Komentar Live' : 'Nested Replies'}
                  </Label>
                </div>
                <SectionReplies state={state} onChange={onChange} onEditReply={onEditReply} onAddReply={onAddReply} />
              </div>

              {/* APPEARANCE */}
              <div className="p-4.5 border-b border-[var(--panel-border)]">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-[var(--root-fg)] mb-3.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-500" />
                  Appearance & Watermark
                </Label>
                <SectionAppearance state={state} onChange={onChange} />
              </div>

              {/* ANIMATION FUTURE */}
              <div className="p-4.5 border-b border-[var(--panel-border)]">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Animation (Segera Hadir)</Label>
                <div className="text-[10px] text-[var(--text-muted)] bg-[var(--root-bg)] border border-dashed border-[var(--panel-border)] rounded-xl p-3 leading-relaxed">
                  Efek transisi masuk dinamis, animasi fade-in, dan kustomisasi waktu rendering frame.
                </div>
              </div>

              {/* CUSTOM CSS FUTURE */}
              <div className="p-4.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Custom CSS (Segera Hadir)</Label>
                <div className="text-[10px] text-[var(--text-muted)] bg-[var(--root-bg)] border border-dashed border-[var(--panel-border)] rounded-xl p-3 leading-relaxed">
                  Tulis kode style kustom untuk override elemen card secara penuh.
                </div>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="flex flex-col p-4.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-[var(--root-fg)] mb-3 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-purple-500" />
                Snapshot Gallery
              </Label>
              {snapshots.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-[var(--root-bg)] border border-dashed border-[var(--panel-border)] rounded-2xl">
                  <Image className="w-8 h-8 text-[var(--text-muted)] opacity-50 mb-3" />
                  <p className="text-xs text-[var(--text-muted)] text-center font-medium">Belum ada snapshot.</p>
                  <p className="text-[10px] text-[var(--text-muted)] text-center opacity-60 mt-1">Gunakan tombol Snapshot di area Preview untuk membandingkan desain.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {snapshots.map(snap => (
                    <div key={snap.id} className="relative group rounded-xl overflow-hidden border border-[var(--panel-border)] bg-[var(--root-bg)]">
                      <img src={snap.url} alt="Snapshot" className="w-full h-auto object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">{snap.timestamp}</span>
                          <button 
                            onClick={() => onDeleteSnapshot(snap.id)}
                            className="p-1 rounded hover:bg-red-500/80 text-white transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <a 
                          href={snap.url} 
                          download={`snapshot-${snap.id}.png`}
                          className="text-[10px] font-bold text-white text-center py-1 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer transition-colors"
                        >
                          Simpan
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom area with Undo, Redo, and Drafts */}
      <div className="p-4 border-t border-[var(--panel-border)] bg-[var(--panel-bg-translucent)] backdrop-blur-md shrink-0 flex flex-col gap-3.5 z-10">
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${canUndo ? 'text-blue-400 hover:text-blue-300' : 'text-zinc-600 cursor-not-allowed'}`}
          >
            <RotateCcw className="w-3.5 h-3.5 -scale-x-100" />
            Undo
          </button>
          <div className="w-[1px] h-3.5 bg-zinc-800" />
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${canRedo ? 'text-blue-400 hover:text-blue-300' : 'text-zinc-600 cursor-not-allowed'}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Redo
          </button>
        </div>

        {/* ☁ Drafts list as Accordion */}
        <Accordion 
          title={`Draft (${drafts.length})`} 
          icon={<FolderHeart className="w-3.5 h-3.5 text-amber-500" />} 
          defaultOpen={false}
          className="border border-[var(--panel-border)] bg-[var(--root-bg)] rounded-xl shadow-inner overflow-hidden"
        >
          <SectionDrafts
            state={state}
            onLoadState={(loadedState) => onChange(loadedState)}
            isPremium={isPremium}
            onUpgradeClick={onUpgradeClick}
            drafts={drafts}
            history={history}
            onSaveDraft={onSaveDraft}
            onDeleteDraft={onDeleteDraft}
            onRenameDraft={onRenameDraft}
            onClearHistory={onClearHistory}
          />
        </Accordion>
      </div>
    </div>
  );
}
