import React, { useState } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storage';
import { X, Bell, User, Clock, Shield, Trash2, Check, RefreshCw } from 'lucide-react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  onResetSeedData: () => void;
  onOpenEmailPreview: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onResetSeedData,
  onOpenEmailPreview,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [timezone, setTimezone] = useState(user.timezone || 'America/Los_Angeles');
  const [emailUnlock, setEmailUnlock] = useState(user.preferences.emailUnlock);
  const [reminderBeforeUnlock, setReminderBeforeUnlock] = useState(user.preferences.reminderBeforeUnlock);
  const [monthlyReflection, setMonthlyReflection] = useState(user.preferences.monthlyReflectionReminder);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      timezone,
      preferences: {
        emailUnlock,
        reminderBeforeUnlock,
        monthlyReflectionReminder: monthlyReflection,
      },
    };

    StorageService.saveUser(updated);
    onUserUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          id="profile-settings-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6B8A5B] hover:text-[#1F2A1A] p-1.5 rounded-full hover:bg-[#E6EEE0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#E6EEE0] text-[#32432A] border border-[#CCD8C4] flex items-center justify-center font-serif text-lg font-semibold shadow-2xs">
            {name.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#1F2A1A]">Settings & Profile</h3>
            <p className="text-xs text-[#557048]">Manage delivery preferences & time capsule account</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-2.5 rounded-xl bg-[#E6EEE0] border border-[#B7CCA9] text-xs text-[#1F2A1A] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#32432A]" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Account Profile Fields */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#6B8A5B]">
              Personal Information
            </label>
            <div>
              <label className="block text-xs text-[#425838] mb-1">Your Name</label>
              <input
                id="settings-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D5DFCE] rounded-xl focus:border-[#32432A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#425838] mb-1">Email Address</label>
              <input
                id="settings-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D5DFCE] rounded-xl focus:border-[#32432A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#425838] mb-1">Your Timezone</label>
              <select
                id="settings-timezone-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D5DFCE] rounded-xl focus:border-[#32432A] focus:outline-none"
              >
                <option value="America/Los_Angeles">America/Los_Angeles (Pacific)</option>
                <option value="America/New_York">America/New_York (Eastern)</option>
                <option value="America/Chicago">America/Chicago (Central)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Europe/Paris">Europe/Paris (CET)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="UTC">UTC Universal</option>
              </select>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-3 pt-4 border-t border-[#EBF0E6]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#6B8A5B]">
                Notification Preferences
              </label>
              <button
                type="button"
                onClick={onOpenEmailPreview}
                className="text-[11px] text-[#32432A] hover:underline font-medium"
              >
                Preview scheduled email →
              </button>
            </div>

            {/* Preference 1 */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#D5DFCE] cursor-pointer hover:border-[#B7CCA9]">
              <input
                id="pref-email-unlock-checkbox"
                type="checkbox"
                checked={emailUnlock}
                onChange={(e) => setEmailUnlock(e.target.checked)}
                className="mt-0.5 accent-[#32432A]"
              />
              <div className="text-xs">
                <span className="font-medium text-[#1F2A1A] block">Unlock Email Notification</span>
                <span className="text-[#557048] block mt-0.5">
                  Receive a discreet notification email when a capsule reaches its delivery date.
                </span>
              </div>
            </label>

            {/* Preference 2 */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#D5DFCE] cursor-pointer hover:border-[#B7CCA9]">
              <input
                id="pref-reminder-checkbox"
                type="checkbox"
                checked={reminderBeforeUnlock}
                onChange={(e) => setReminderBeforeUnlock(e.target.checked)}
                className="mt-0.5 accent-[#32432A]"
              />
              <div className="text-xs">
                <span className="font-medium text-[#1F2A1A] block">Upcoming Delivery Reminder</span>
                <span className="text-[#557048] block mt-0.5">
                  A gentle note 24 hours before a capsule unlocks, to prepare your heart.
                </span>
              </div>
            </label>

            {/* Preference 3 */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#D5DFCE] cursor-pointer hover:border-[#B7CCA9]">
              <input
                id="pref-monthly-checkbox"
                type="checkbox"
                checked={monthlyReflection}
                onChange={(e) => setMonthlyReflection(e.target.checked)}
                className="mt-0.5 accent-[#32432A]"
              />
              <div className="text-xs">
                <span className="font-medium text-[#1F2A1A] block">Monthly Reflection Prompt</span>
                <span className="text-[#557048] block mt-0.5">
                  A monthly quiet invitation to capture this month's thoughts before they fade.
                </span>
              </div>
            </label>
          </div>

          {/* Database Reset / Maintenance */}
          <div className="pt-4 border-t border-[#EBF0E6] space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#6B8A5B]">
              Demo & Reset Utilities
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#E6EEE0]/60 border border-[#CCD8C4]">
              <div className="text-xs">
                <span className="font-medium text-[#1F2A1A] block">Reset to Seed Capsules</span>
                <span className="text-[#557048] block mt-0.5">
                  Restores default example capsules for testing.
                </span>
              </div>
              <button
                id="settings-reset-seed-btn"
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all capsules back to default demo seeds?')) {
                    onResetSeedData();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-[#CCD8C4] rounded-lg text-[#32432A] hover:bg-[#E6EEE0] transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBF0E6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#557048] hover:text-[#1F2A1A]"
            >
              Cancel
            </button>
            <button
              id="settings-save-btn"
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#32432A] text-[#F4F6F1] rounded-full hover:bg-[#273521] transition-colors shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
