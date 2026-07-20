import React, { useState, useEffect } from 'react';
import { CommentState, DraftItem, HistoryItem } from '../../types';
import { 
  Cloud, 
  CloudOff, 
  Trash2, 
  Loader2, 
  Edit2, 
  Plus, 
  Check, 
  FolderOpen, 
  Clock, 
  Sparkles, 
  Zap, 
  RefreshCw 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Props {
  state: CommentState;
  onLoadState: (loaded: CommentState) => void;
  isPremium: boolean;
  onUpgradeClick: () => void;
  drafts: DraftItem[];
  history: HistoryItem[];
  onSaveDraft: (name: string, state: CommentState) => void;
  onDeleteDraft: (id: string) => void;
  onRenameDraft: (id: string, newName: string) => void;
  onClearHistory: () => void;
}

export function SectionDrafts({
  state,
  onLoadState,
  isPremium,
  onUpgradeClick,
  drafts,
  history,
  onSaveDraft,
  onDeleteDraft,
  onRenameDraft,
  onClearHistory
}: Props) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'drafts' | 'history'>('drafts');
  const [newDraftName, setNewDraftName] = useState('');
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [globalSyncing, setGlobalSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Set status message with automatic fadeout
  const triggerStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 2500);
  };

  // Simulate Cloud Sync for premium members
  const simulateSync = (id: string, callback?: () => void) => {
    if (!isPremium) {
      if (callback) callback();
      return;
    }
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      if (callback) callback();
    }, 1200);
  };

  // Simulate global sync on load/refresh if premium
  const triggerGlobalSync = () => {
    if (!isPremium) return;
    setGlobalSyncing(true);
    setTimeout(() => {
      setGlobalSyncing(false);
      triggerStatus(t('drafts.syncSuccess'));
    }, 1500);
  };

  useEffect(() => {
    // Initial sync simulation when opening drafts
    triggerGlobalSync();
  }, []);

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraftName.trim()) return;
    
    const name = newDraftName.trim();
    setNewDraftName('');
    
    // Create draft
    onSaveDraft(name, state);
    triggerStatus(t('drafts.draftSavedLocal', { name }));

    // Simulate Cloud sync
    if (isPremium) {
      simulateSync('global', () => {
        triggerStatus(t('drafts.draftSavedCloud', { name }));
      });
    }
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingDraftId(id);
    setEditingName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (!editingName.trim()) return;
    onRenameDraft(id, editingName.trim());
    setEditingDraftId(null);
    triggerStatus(t('drafts.draftRenamed'));

    if (isPremium) {
      simulateSync(id, () => {
        triggerStatus(language === 'id' ? 'Nama draf diperbarui di cloud!' : 'Draft name updated in the cloud!');
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    onDeleteDraft(id);
    triggerStatus(t('drafts.draftDeleted', { name }));
  };

  const handleLoadDraft = (draft: DraftItem | HistoryItem, label: string) => {
    onLoadState(draft.state);
    triggerStatus(t('drafts.loading', { name: label }));
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' });
    } catch (e) {
      return language === 'id' ? 'Baru saja' : 'Just now';
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 text-xs">
      
      {/* Cloud Sync Status Header Banner */}
      <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
        isPremium 
          ? 'bg-blue-500/5 border-blue-500/15 dark:bg-blue-500/10 dark:border-blue-500/20' 
          : 'bg-[var(--root-bg)]/80 border-[var(--panel-border)]'
      }`}>
        <div className="flex items-center gap-2">
          {isPremium ? (
            globalSyncing || syncingId === 'global' ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
            ) : (
              <Cloud className="w-4 h-4 text-blue-400 shrink-0 fill-blue-400/10" />
            )
          ) : (
            <CloudOff className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          )}
          <div>
            <div className="font-extrabold flex items-center gap-1">
              {isPremium ? t('drafts.cloudSyncActive') : t('drafts.cloudSyncInactive')}
              {isPremium && (
                <span className="text-[9px] bg-blue-500 text-white font-black uppercase px-1 py-0.2 rounded scale-95 origin-left">PRO</span>
              )}
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-normal">
              {isPremium 
                ? (globalSyncing ? (language === 'id' ? 'Menyinkronkan dengan server...' : 'Syncing with server...') : t('drafts.cloudSyncDescActive'))
                : t('drafts.cloudSyncDescInactive')
              }
            </p>
          </div>
        </div>
        
        {isPremium ? (
          <button 
            disabled={globalSyncing}
            onClick={triggerGlobalSync}
            className="w-7 h-7 bg-[var(--panel-bg)] hover:bg-[var(--button-hover)] border border-[var(--panel-border)] rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 text-[var(--root-fg)]"
            title={t('drafts.manualSync')}
          >
            <RefreshCw className={`w-3 h-3 ${globalSyncing ? 'animate-spin text-blue-500' : ''}`} />
          </button>
        ) : (
          <button 
            onClick={onUpgradeClick}
            className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Zap className="w-2.5 h-2.5 fill-white" />
            {t('drafts.proSync')}
          </button>
        )}
      </div>

      {/* Floating Status Toast (Inside Panel) */}
      {statusMessage && (
        <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 dark:border-emerald-500/30 px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 animate-pulse text-[10px] select-none">
          <Check className="w-3.5 h-3.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Sub-Tabs Selector */}
      <div className="grid grid-cols-2 bg-[var(--root-bg)]/80 border border-[var(--panel-border)] p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('drafts')}
          className={`py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'drafts' 
              ? 'bg-[var(--panel-bg)] border border-[var(--panel-border)] text-blue-400 font-extrabold shadow-sm' 
              : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>{t('sidebar.draft.count', { count: drafts.length })}</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-1.5 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'history' 
              ? 'bg-[var(--panel-bg)] border border-[var(--panel-border)] text-indigo-400 font-extrabold shadow-sm' 
              : 'text-[var(--text-muted)] hover:text-[var(--root-fg)]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t('sidebar.history.count', { count: history.length })}</span>
        </button>
      </div>

      {/* Content for Tabs */}
      {activeTab === 'drafts' ? (
        <div className="space-y-3.5">
          {/* Create Draft Form */}
          <form onSubmit={handleCreateDraft} className="flex gap-2">
            <input
              type="text"
              value={newDraftName}
              onChange={(e) => setNewDraftName(e.target.value)}
              placeholder={t('drafts.placeholder')}
              className="flex-1 px-3 py-2 bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-[var(--root-fg)] placeholder:text-[var(--text-muted)]"
              maxLength={40}
            />
            <button
              type="submit"
              disabled={!newDraftName.trim()}
              className="w-9 h-9 shrink-0 bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold cursor-pointer transition-colors"
              title={language === 'id' ? "Simpan Draf" : "Save Draft"}
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* Drafts List */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-0.5">
            {drafts.length === 0 ? (
              <div className="py-8 text-center text-[var(--text-muted)] flex flex-col items-center justify-center gap-1.5 border border-dashed border-[var(--panel-border)] rounded-xl">
                <FolderOpen className="w-6 h-6 opacity-30" />
                <p className="font-semibold">{t('drafts.emptyDrafts')}</p>
                <p className="text-[10px] opacity-80">{t('drafts.emptyDraftsDesc')}</p>
              </div>
            ) : (
              drafts.map((d) => (
                <div 
                  key={d.id} 
                  className="group relative p-2.5 rounded-xl border border-[var(--panel-border)] bg-[var(--root-bg)]/40 hover:bg-[var(--root-bg)]/80 hover:border-blue-500/20 transition-all flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0" onClick={() => handleLoadDraft(d, d.name)}>
                    {editingDraftId === d.id ? (
                      <div className="flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-2 py-0.5 bg-[var(--panel-bg)] border border-blue-500/30 rounded focus:outline-none text-xs"
                          maxLength={40}
                        />
                        <button 
                          onClick={() => handleSaveRename(d.id)}
                          className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center cursor-pointer hover:bg-emerald-500/20"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="cursor-pointer select-none">
                        <div className="font-extrabold text-[var(--root-fg)] hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          <span className="truncate">{d.name}</span>
                          <span className="text-[9px] uppercase px-1 py-0.1 bg-[var(--panel-border)] text-[var(--text-muted)] rounded shrink-0 scale-95">
                            {d.platform === 'kick_live' ? 'Kick' : d.platform}
                          </span>
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
                          <span>{formatTime(d.createdAt)}</span>
                          {isPremium && (
                            <span className="flex items-center gap-0.5 text-blue-400">
                              {syncingId === d.id ? (
                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              ) : (
                                <Cloud className="w-2.5 h-2.5 fill-blue-400/5" />
                              )}
                              <span className="text-[9px]">{syncingId === d.id ? (language === 'id' ? 'Menyinkronkan...' : 'Syncing...') : 'Cloud'}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  {editingDraftId !== d.id && (
                    <div className="flex items-center gap-1 shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartRename(d.id, d.name)}
                        className="w-6 h-6 rounded-lg hover:bg-[var(--button-hover)] border border-[var(--panel-border)]/50 flex items-center justify-center text-[var(--text-muted)] hover:text-blue-400 cursor-pointer"
                        title={t('drafts.rename')}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.name)}
                        className="w-6 h-6 rounded-lg hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 flex items-center justify-center text-red-500 cursor-pointer"
                        title={t('drafts.delete')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* History (Auto Saves) Tab */
        <div className="space-y-3">
          {history.length > 0 && (
            <div className="flex justify-between items-center bg-[var(--root-bg)]/30 p-1.5 rounded-xl border border-[var(--panel-border)]/50">
              <span className="text-[10px] text-[var(--text-muted)] font-semibold pl-1.5">{t('drafts.autoSaveDesc')}</span>
              <button
                onClick={onClearHistory}
                className="px-2.5 py-1 text-[10px] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg border border-red-500/10 cursor-pointer transition-all"
              >
                {t('drafts.clearAll')}
              </button>
            </div>
          )}

          {/* History List */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-0.5">
            {history.length === 0 ? (
              <div className="py-8 text-center text-[var(--text-muted)] flex flex-col items-center justify-center gap-1.5 border border-dashed border-[var(--panel-border)] rounded-xl">
                <Clock className="w-6 h-6 opacity-30 animate-pulse" />
                <p className="font-semibold">{t('drafts.emptyHistory')}</p>
                <p className="text-[10px] opacity-80 leading-normal max-w-[200px] mx-auto">
                  {language === 'id' 
                    ? 'Riwayat akan tersimpan otomatis saat Anda menekan tombol **Randomize**, **Reset**, atau mengunduh hasil ekspor.' 
                    : 'History will be saved automatically when you click the **Randomize**, **Reset**, or download exports buttons.'
                  }
                </p>
              </div>
            ) : (
              history.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => handleLoadDraft(h, `${language === 'id' ? 'Riwayat' : 'History'} ${formatTime(h.createdAt)}`)}
                  className="p-2.5 rounded-xl border border-[var(--panel-border)] bg-[var(--root-bg)]/40 hover:bg-[var(--root-bg)]/80 hover:border-indigo-500/20 cursor-pointer transition-all flex flex-col gap-1 text-left relative overflow-hidden group select-none"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-extrabold text-[var(--root-fg)] group-hover:text-indigo-400 transition-colors capitalize">
                      {h.platform === 'kick_live' ? 'Kick Live Chat' : `${h.platform} Post`}
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)] font-medium">
                      {formatTime(h.createdAt).split(' - ')[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] truncate max-w-full italic">
                    "{h.state.commentText || (language === 'id' ? 'Tanpa teks komentar' : 'No comment text')}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
