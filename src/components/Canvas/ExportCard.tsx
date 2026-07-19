import React, { useState } from 'react';
import { Download, CheckCircle2, Loader2, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { Button, Select, Label } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onExport: (scale: number, format: 'png' | 'jpg' | 'webp' | 'transparent') => Promise<void>;
  isExporting: boolean;
}

export function ExportCard({ onExport, isExporting }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState<'png' | 'jpg' | 'webp' | 'transparent'>('png');
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    await onExport(scale, format);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <>
      {/* Collapsible Trigger Button in the Top-Right Corner */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3.5 py-2 bg-[var(--panel-bg)]/90 backdrop-blur-md border border-[var(--panel-border)] hover:border-blue-500/50 hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer select-none"
      >
        <Download className="w-4 h-4 text-blue-500" />
        <span>Export</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Export Options Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-16 right-4 w-[280px] bg-[var(--panel-bg)]/95 backdrop-blur-xl border border-[var(--panel-border)] shadow-xl rounded-2xl p-4 z-30 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-[var(--root-fg)] font-semibold text-sm">
              <ImageIcon className="w-4 h-4 text-blue-500" />
              Export Options
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 text-[10px]">Scale</Label>
                <Select value={scale} onChange={(e) => setScale(Number(e.target.value))} className="py-1.5 text-xs">
                  <option value={1}>1x</option>
                  <option value={2}>2x (Retina)</option>
                  <option value={4}>4x (Ultra)</option>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 text-[10px]">Format</Label>
                <Select value={format} onChange={(e) => setFormat(e.target.value as any)} className="py-1.5 text-xs">
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WEBP</option>
                  <option value="transparent">Transparent PNG</option>
                </Select>
              </div>
            </div>

            <Button 
              variant="primary" 
              onClick={handleExport}
              disabled={isExporting || success}
              className="w-full relative overflow-hidden transition-all duration-300 h-10"
            >
              <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isExporting ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${success ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <CheckCircle2 className="w-4 h-4" /> Exported
              </div>
              <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 ${!isExporting && !success ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <Download className="w-4 h-4" /> Export Asset
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
