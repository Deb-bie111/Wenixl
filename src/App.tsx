/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Capsule, UserProfile, ViewState } from './types';
import { StorageService, DEFAULT_USER } from './services/storage';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { CreateCapsule } from './components/CreateCapsule';
import { CapsuleDetail } from './components/CapsuleDetail';
import { AuthModal } from './components/AuthModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { EmailPreviewModal } from './components/EmailPreviewModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return StorageService.getCurrentUser() || DEFAULT_USER;
  });

  const [currentView, setCurrentView] = useState<ViewState>({ type: 'dashboard' });
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  // Load capsules for active user
  const loadUserData = (user: UserProfile) => {
    const userCapsules = StorageService.getCapsulesForUser(user.id);
    setCapsules(userCapsules);
  };

  useEffect(() => {
    if (currentUser) {
      loadUserData(currentUser);
    } else {
      setCapsules([]);
    }
  }, [currentUser]);

  // Handle user authentication
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    loadUserData(user);
    setCurrentView({ type: 'dashboard' });
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setCapsules([]);
    setCurrentView({ type: 'landing' });
  };

  const handleUserUpdated = (updated: UserProfile) => {
    setCurrentUser(updated);
  };

  const handleResetSeedData = () => {
    StorageService.resetToSeedData();
    const user = StorageService.getCurrentUser() || DEFAULT_USER;
    setCurrentUser(user);
    loadUserData(user);
    setCurrentView({ type: 'dashboard' });
  };

  const handleCapsuleSealed = (capsuleId: string) => {
    if (currentUser) {
      loadUserData(currentUser);
    }
    setCurrentView({ type: 'view-capsule', capsuleId });
  };

  const handleCapsuleDeleted = () => {
    if (currentUser) {
      loadUserData(currentUser);
    }
    setCurrentView({ type: 'dashboard' });
  };

  const readyCapsulesCount = capsules.filter((c) => c.status === 'ready').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F5] text-[#1F2A1A] selection:bg-[#CCD8C4] selection:text-[#1F2A1A]">
      {/* Primary Navigation Header */}
      <Header
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenEmailPreview={() => setIsEmailPreviewOpen(true)}
        onLogout={handleLogout}
        readyCount={readyCapsulesCount}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView.type === 'landing' && (
          <LandingPage
            onNavigate={(view) => setCurrentView(view)}
            onOpenAuth={() => setIsAuthOpen(true)}
            isLoggedIn={!!currentUser}
          />
        )}

        {currentView.type === 'dashboard' && currentUser && (
          <Dashboard
            user={currentUser}
            capsules={capsules}
            onSelectCapsule={(capsuleId) =>
              setCurrentView({ type: 'view-capsule', capsuleId })
            }
            onNewCapsule={() => setCurrentView({ type: 'create' })}
            onRefresh={() => loadUserData(currentUser)}
          />
        )}

        {currentView.type === 'create' && (
          <CreateCapsule
            user={currentUser || DEFAULT_USER}
            onClose={() => setCurrentView(currentUser ? { type: 'dashboard' } : { type: 'landing' })}
            onSealed={handleCapsuleSealed}
            draftCapsule={
              currentView.draftId
                ? capsules.find((c) => c.id === currentView.draftId) || null
                : null
            }
          />
        )}

        {currentView.type === 'view-capsule' && currentUser && (
          <CapsuleDetail
            capsuleId={currentView.capsuleId}
            user={currentUser}
            onBack={() => setCurrentView({ type: 'dashboard' })}
            onDeleted={handleCapsuleDeleted}
            initialAutoOpen={currentView.autoOpen}
          />
        )}
      </main>

      {/* Quiet Timeless Footer */}
      <footer className="border-t border-[#D5DFCE] bg-[#F7F9F5] py-8 text-center text-xs text-[#557048] font-serif">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="italic text-[#425838]">
            “Write something today that your future self will receive later.”
          </p>
          <p className="font-mono text-[11px] text-[#6B8A5B]">
            Later. — A private digital time capsule. All letters safely encrypted & sealed.
          </p>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Profile & Notification Settings Modal */}
      {currentUser && (
        <ProfileSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          user={currentUser}
          onUserUpdated={handleUserUpdated}
          onResetSeedData={handleResetSeedData}
          onOpenEmailPreview={() => {
            setIsSettingsOpen(false);
            setIsEmailPreviewOpen(true);
          }}
        />
      )}

      {/* Email Notification Architecture Preview Modal */}
      <EmailPreviewModal
        isOpen={isEmailPreviewOpen}
        onClose={() => setIsEmailPreviewOpen(false)}
        onOpenCapsule={() => {
          // If there's a ready capsule, jump straight to it!
          const ready = capsules.find((c) => c.status === 'ready');
          if (ready) {
            setCurrentView({ type: 'view-capsule', capsuleId: ready.id, autoOpen: true });
          } else {
            setCurrentView({ type: 'dashboard' });
          }
        }}
      />
    </div>
  );
}
