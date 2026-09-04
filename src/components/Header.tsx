import React, { useState } from 'react';
import { UserProfile, ViewState } from '../types';
import { Mail, Plus, Sparkles, LogOut, Settings, Clock, Bell } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile | null;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onOpenEmailPreview: () => void;
  onLogout: () => void;
  readyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenSettings,
  onOpenEmailPreview,
  onLogout,
  readyCount,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F4F6F1]/95 backdrop-blur-md border-b border-[#D5DFCE] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <button
          id="header-brand-logo"
          onClick={() => onNavigate(currentUser ? { type: 'dashboard' } : { type: 'landing' })}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#32432A] text-[#F4F6F1] flex items-center justify-center font-serif text-lg font-bold shadow-xs transition-transform group-hover:scale-105">
            L
          </div>
          <div>
            <span className="font-serif text-2xl font-semibold tracking-tight text-[#1F2A1A] block leading-none">
              Later<span className="text-[#557048]">.</span>
            </span>
            <span className="text-[11px] tracking-widest uppercase text-[#6B8A5B] block mt-0.5 font-sans font-medium">
              Time Capsule
            </span>
          </div>
        </button>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {currentUser ? (
            <>
              {/* Ready to open pill if any */}
              {readyCount > 0 && (
                <button
                  id="header-ready-capsules-badge"
                  onClick={() => onNavigate({ type: 'dashboard' })}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E6EEE0] text-[#32432A] border border-[#CCD8C4] animate-pulse hover:bg-[#DCE7D4] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#557048]" />
                  <span>{readyCount} ready to open</span>
                </button>
              )}

              {/* View Dashboard Button */}
              {currentView.type !== 'dashboard' && (
                <button
                  id="nav-my-capsules-btn"
                  onClick={() => onNavigate({ type: 'dashboard' })}
                  className="text-sm font-medium text-[#425838] hover:text-[#1F2A1A] px-3 py-2 rounded-lg hover:bg-[#EBF0E6] transition-colors"
                >
                  My Capsules
                </button>
              )}

              {/* How it works link */}
              <button
                id="nav-how-it-works-btn"
                onClick={() => onNavigate({ type: 'landing' })}
                className="hidden md:inline-flex text-sm font-medium text-[#557048] hover:text-[#1F2A1A] px-3 py-2 rounded-lg hover:bg-[#EBF0E6] transition-colors"
              >
                How it works
              </button>

              {/* Notification Simulator Preview */}
              <button
                id="header-preview-notification-btn"
                onClick={onOpenEmailPreview}
                title="Preview Scheduled Email Notification"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#557048] hover:text-[#1F2A1A] border border-[#D5DFCE] bg-[#FAFBF8] px-2.5 py-1.5 rounded-lg hover:border-[#B7CCA9] transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-[#425838]" />
                <span>Email preview</span>
              </button>

              {/* Write New Capsule CTA */}
              <button
                id="header-write-letter-btn"
                onClick={() => onNavigate({ type: 'create' })}
                className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#273521] active:scale-95 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Write a letter</span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="header-user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full border border-[#D5DFCE] hover:border-[#B7CCA9] bg-[#FAFBF8] focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E6EEE0] text-[#32432A] flex items-center justify-center font-medium text-xs font-serif font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#FAFBF8] border border-[#D5DFCE] shadow-lg py-2 z-50 text-sm animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-[#EBF0E6]">
                      <p className="font-semibold text-[#1F2A1A]">{currentUser.name}</p>
                      <p className="text-xs text-[#557048] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      id="menu-settings-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenSettings();
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 text-[#32432A] hover:bg-[#EBF0E6] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#557048]" />
                      <span>Settings & Preferences</span>
                    </button>

                    <button
                      id="menu-email-preview-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenEmailPreview();
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 text-[#32432A] hover:bg-[#EBF0E6] transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#557048]" />
                      <span>Scheduled Email Architecture</span>
                    </button>

                    <div className="border-t border-[#EBF0E6] my-1"></div>

                    <button
                      id="menu-sign-out-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2.5 text-[#872828] hover:bg-[#FDF2F2] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                id="header-how-it-works-guest"
                onClick={() => onNavigate({ type: 'landing' })}
                className="text-sm font-medium text-[#425838] hover:text-[#1F2A1A] px-3 py-2 rounded-lg hover:bg-[#EBF0E6] transition-colors"
              >
                How it works
              </button>

              <button
                id="header-sign-in-btn"
                onClick={onOpenAuth}
                className="text-sm font-medium text-[#1F2A1A] px-3 py-2 rounded-lg hover:bg-[#EBF0E6] transition-colors"
              >
                Log in
              </button>

              <button
                id="header-get-started-btn"
                onClick={() => onNavigate({ type: 'create' })}
                className="inline-flex items-center gap-1.5 bg-[#32432A] text-[#F4F6F1] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#273521] transition-all shadow-xs"
              >
                <span>Write a letter</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
