import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Check, LogIn, Chrome, ShieldAlert, Sparkles, User, HelpCircle } from 'lucide-react';
import { Button } from './ui';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess, currentUser, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleMockOAuth = (provider: 'google' | 'tiktok') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const mockUser: UserProfile = {
        name: provider === 'google' ? 'Andi Gunawan' : 'UGC Creator Depok',
        email: provider === 'google' ? 'andi.gunawan@gmail.com' : 'ugc.depok@tiktok.com',
        avatar: provider === 'google' 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
        isGuest: false,
      };
      onLoginSuccess(mockUser);
      setSuccessMessage(`Berhasil masuk menggunakan akun ${provider === 'google' ? 'Google' : 'TikTok'}!`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    }, 1500);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const mockUser: UserProfile = {
        name: name || email.split('@')[0],
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        isGuest: false,
      };
      onLoginSuccess(mockUser);
      setSuccessMessage('Berhasil masuk ke akun SocialCanvas Anda!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleGuestLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const guestUser: UserProfile = {
        name: 'Guest Creator',
        email: 'guest@socialcanvas.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        isGuest: true,
      };
      onLoginSuccess(guestUser);
      setSuccessMessage('Masuk sebagai Akun Tamu (Guest)!');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-2xl rounded-3xl overflow-hidden z-10 text-[var(--root-fg)] p-6 sm:p-8 flex flex-col gap-5"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-[var(--button-hover)] text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {successMessage ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-500">Sukses!</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">{successMessage}</p>
              </div>
            </div>
          ) : currentUser ? (
            <div className="flex flex-col gap-5 text-center">
              <div className="mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-md">
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{currentUser.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{currentUser.email}</p>
                <div className="mt-2.5 inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/10 uppercase tracking-wider">
                  {currentUser.isGuest ? 'Akun Tamu (Guest)' : 'Akun Terdaftar'}
                </div>
              </div>

              <div className="p-4 bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-2xl text-left text-xs space-y-2">
                <p className="font-semibold text-[var(--root-fg)]">Informasi Sesi Akun</p>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Semua komentar mockup yang Anda edit akan otomatis disimpan ke penyimpanan lokal Anda agar tidak hilang saat halaman disegarkan.
                </p>
              </div>

              <div className="flex gap-2.5 mt-2">
                <Button variant="secondary" onClick={onClose} className="flex-1 h-10 text-xs font-bold rounded-xl">
                  Tutup
                </Button>
                <Button variant="danger" onClick={() => { onLogout(); onClose(); }} className="flex-1 h-10 text-xs font-bold rounded-xl">
                  Keluar Akun
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-blue-500/15 text-blue-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-500/10 mb-2 uppercase tracking-wider">
                  <User className="w-3 h-3" /> Akun SocialCanvas
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">Masuk atau Daftar</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Pilih metode masuk akun Anda untuk mengaktifkan batas ekspor harian.
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[var(--panel-border)]">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'login' 
                      ? 'border-blue-500 text-blue-400' 
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)]'
                  }`}
                >
                  Metode Masuk Instan
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'register' 
                      ? 'border-blue-500 text-blue-400' 
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)]'
                  }`}
                >
                  Custom Email
                </button>
              </div>

              {activeTab === 'login' ? (
                <div className="flex flex-col gap-3">
                  {/* Google OAuth mock */}
                  <button
                    onClick={() => handleMockOAuth('google')}
                    disabled={isSubmitting}
                    className="flex items-center justify-between px-4 py-3 bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl hover:border-blue-500/50 hover:bg-[var(--button-hover)] transition-all text-xs font-bold cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Chrome className="w-4 h-4 text-red-500" />
                      <span>Masuk dengan Google</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] group-hover:text-blue-400 transition-colors">Instant</span>
                  </button>

                  {/* TikTok OAuth mock */}
                  <button
                    onClick={() => handleMockOAuth('tiktok')}
                    disabled={isSubmitting}
                    className="flex items-center justify-between px-4 py-3 bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl hover:border-pink-500/50 hover:bg-[var(--button-hover)] transition-all text-xs font-bold cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogIn className="w-4 h-4 text-pink-500" />
                      <span>Masuk dengan TikTok</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] group-hover:text-pink-400 transition-colors">UGC Link</span>
                  </button>

                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--panel-border)]"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-[var(--panel-bg)] px-2 text-[var(--text-muted)]">Atau</span></div>
                  </div>

                  {/* Guest Login */}
                  <button
                    onClick={handleGuestLogin}
                    disabled={isSubmitting}
                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/10 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/10 transition-all text-xs font-bold cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                      <div className="text-left">
                        <div>Gunakan Akun Tamu (Guest)</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-normal mt-0.5">Bagus untuk uji coba instan cepat</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-400">Gratis</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomLogin} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Nama Kreator</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Andi Wijaya"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-500 text-[var(--root-fg)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Alamat Email</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-500 text-[var(--root-fg)]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !email}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-sm font-bold gap-2 rounded-xl mt-1"
                  >
                    {isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar & Mulai Sekarang'}
                  </Button>
                </form>
              )}

              <p className="text-[10px] text-center text-[var(--text-muted)] leading-relaxed">
                Dengan masuk akun, Anda menyetujui Ketentuan Layanan SocialCanvas. Batas ekspor harian Free adalah 30 screenshot komentar per hari.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
