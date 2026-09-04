import React, { useState } from 'react';
import { UserProfile } from '../types';
import { StorageService, DEFAULT_USER } from '../services/storage';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'reset') {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      setResetSent(true);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    // Authenticate / Save user
    const user = StorageService.login(email.trim(), password);
    if (mode === 'signup' && name.trim()) {
      user.name = name.trim();
      StorageService.saveUser(user);
    }
    onSuccess(user);
    onClose();
  };

  const handleQuickDemo = () => {
    const user = StorageService.login(DEFAULT_USER.email);
    user.name = DEFAULT_USER.name;
    StorageService.saveUser(user);
    onSuccess(user);
    onClose();
  };

  const handleGoogleAuthSimulation = () => {
    // Standard OAuth client-side handoff simulation
    const user = StorageService.login(DEFAULT_USER.email);
    user.name = DEFAULT_USER.name;
    StorageService.saveUser(user);
    onSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in-95">
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6B8A5B] hover:text-[#1F2A1A] p-1.5 rounded-full hover:bg-[#E6EEE0] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#32432A] text-[#F4F6F1] flex items-center justify-center font-serif text-xl font-bold mx-auto mb-3 shadow-xs">
            L
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#1F2A1A]">
            {mode === 'login' && 'Welcome back to Later.'}
            {mode === 'signup' && 'Begin your time capsule'}
            {mode === 'reset' && 'Reset your password'}
          </h3>
          <p className="text-xs text-[#557048] mt-1 font-serif italic">
            {mode === 'login' && 'Your sealed letters are waiting quietly.'}
            {mode === 'signup' && 'Write thoughts today that your future self will receive.'}
            {mode === 'reset' && "We'll send you a recovery link to restore access."}
          </p>
        </div>

        {/* Quick Demo One-Click Access */}
        <div className="mb-6 p-3 rounded-xl bg-[#E6EEE0] border border-[#CCD8C4] flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs font-semibold text-[#1F2A1A] block">One-click Demo</span>
            <span className="text-[11px] text-[#557048] block">Continue as Debbie Maurice</span>
          </div>
          <button
            id="auth-quick-demo-btn"
            type="button"
            onClick={handleQuickDemo}
            className="px-3 py-1.5 text-xs font-medium bg-[#32432A] text-[#F4F6F1] rounded-lg hover:bg-[#273521] transition-colors"
          >
            Enter Now
          </button>
        </div>

        {/* Google Auth button */}
        <button
          id="auth-google-sso-btn"
          type="button"
          onClick={handleGoogleAuthSimulation}
          className="w-full mb-4 flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-[#D5DFCE] rounded-xl text-sm font-medium text-[#32432A] hover:bg-[#E6EEE0] hover:border-[#CCD8C4] transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#D5DFCE]"></div>
          <span className="text-xs text-[#6B8A5B] uppercase font-mono">or with email</span>
          <div className="flex-1 h-px bg-[#D5DFCE]"></div>
        </div>

        {resetSent ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-10 h-10 text-[#32432A] mx-auto mb-2" />
            <p className="font-serif text-base text-[#1F2A1A] font-medium">Recovery email sent</p>
            <p className="text-xs text-[#557048] mt-1">
              If an account exists for {email}, instructions to reset your password have been sent.
            </p>
            <button
              type="button"
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="mt-5 text-xs font-semibold text-[#32432A] underline underline-offset-4"
            >
              Return to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B]">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-[#425838] mb-1">Your name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B8A5B] absolute left-3 top-3" />
                  <input
                    id="auth-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Debbie"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D5DFCE] rounded-xl focus:border-[#32432A] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#425838] mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B8A5B] absolute left-3 top-3" />
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D5DFCE] rounded-xl focus:border-[#32432A] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#425838]">Password</label>
                  {mode === 'login' && (
                    <button
                      id="auth-forgot-password-link"
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-[11px] text-[#557048] hover:text-[#1F2A1A] underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B8A5B] absolute left-3 top-3" />
                  <input
                    id="auth-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D5DFCE] rounded-xl focus:border-[#32432A] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#32432A] text-[#F4F6F1] py-2.5 rounded-xl text-sm font-medium hover:bg-[#273521] active:scale-98 transition-all shadow-xs"
            >
              <span>
                {mode === 'login' && 'Sign in'}
                {mode === 'signup' && 'Create account'}
                {mode === 'reset' && 'Send recovery email'}
              </span>
              <ArrowRight className="w-4 h-4 text-[#B7CCA9]" />
            </button>
          </form>
        )}

        {/* Toggle mode */}
        <div className="mt-5 pt-4 border-t border-[#D5DFCE] text-center text-xs text-[#557048]">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                id="auth-switch-to-signup"
                type="button"
                onClick={() => {
                  setError('');
                  setMode('signup');
                }}
                className="font-semibold text-[#32432A] hover:underline"
              >
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                id="auth-switch-to-login"
                type="button"
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                className="font-semibold text-[#32432A] hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
