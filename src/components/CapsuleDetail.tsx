import React, { useState, useEffect } from 'react';
import { Capsule, UserProfile, Reflection } from '../types';
import { formatDate, formatDateTime, formatTimeAgo, getCountdown, CountdownInfo } from '../utils/date';
import { CAPSULE_TYPES } from '../data/prompts';
import { getStationeryOption, STATIONERY_PALETTES } from '../data/stationery';
import { StorageService } from '../services/storage';
import {
  ArrowLeft,
  Lock,
  Sparkles,
  Heart,
  Star,
  MessageSquare,
  Clock,
  Send,
  Trash2,
  Calendar,
  Share2,
  Check,
  FastForward,
  Image as ImageIcon,
  Palette
} from 'lucide-react';

interface CapsuleDetailProps {
  capsuleId: string;
  user: UserProfile;
  onBack: () => void;
  onDeleted: () => void;
  initialAutoOpen?: boolean;
}

export const CapsuleDetail: React.FC<CapsuleDetailProps> = ({
  capsuleId,
  user,
  onBack,
  onDeleted,
  initialAutoOpen = false,
}) => {
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [countdown, setCountdown] = useState<CountdownInfo | null>(null);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);
  const [isOpenedLetter, setIsOpenedLetter] = useState(false);
  const [reflectionInput, setReflectionInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load capsule safely
  const reloadCapsule = () => {
    const data = StorageService.getCapsuleById(capsuleId, user.id);
    if (data) {
      setCapsule(data);
      setCountdown(getCountdown(data.unlockAt));
      if (data.status === 'opened') {
        // Fetch full unlocked content
        try {
          const unlocked = StorageService.unlockAndGetContent(capsuleId, user.id);
          if (unlocked) {
            setCapsule(unlocked);
            setIsOpenedLetter(true);
          }
        } catch {
          // If sealed, stays sanitized
        }
      }
    }
  };

  useEffect(() => {
    reloadCapsule();
  }, [capsuleId, user.id]);

  // Live countdown loop if sealed
  useEffect(() => {
    if (!capsule || capsule.status === 'opened') return;

    const interval = setInterval(() => {
      const cd = getCountdown(capsule.unlockAt);
      setCountdown(cd);
      if (cd.isUnlocked && capsule.status === 'sealed') {
        // Transition to ready
        reloadCapsule();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [capsule?.status, capsule?.unlockAt]);

  if (!capsule) {
    return (
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-16 text-center">
        <p className="font-serif text-lg text-[#557048]">Time capsule not found or private.</p>
        <button
          onClick={onBack}
          className="mt-4 px-5 py-2 bg-[#32432A] text-[#F4F6F1] rounded-full text-xs font-medium hover:bg-[#273521] transition-colors"
        >
          Return to capsules
        </button>
      </div>
    );
  }

  const typeMeta = CAPSULE_TYPES.find((t) => t.type === capsule.type) || CAPSULE_TYPES[0];
  const isReadyToOpen = capsule.status === 'ready' || (countdown?.isUnlocked && capsule.status === 'sealed');
  const isLocked = capsule.status === 'sealed' && !isReadyToOpen;
  const stationery = getStationeryOption(capsule.letterColor);

  // Change stationery letter color
  const handleChangeColor = (paletteId: string) => {
    const updated = StorageService.updateLetterColor(capsule.id, user.id, paletteId);
    if (updated) {
      setCapsule({ ...capsule, letterColor: paletteId });
    }
  };

  // Handle Unlocking Ceremony
  const handleOpenLetter = () => {
    setIsOpeningAnimation(true);
    setErrorMsg('');

    setTimeout(() => {
      try {
        const opened = StorageService.unlockAndGetContent(capsule.id, user.id);
        if (opened) {
          setCapsule(opened);
          setIsOpenedLetter(true);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Could not unlock capsule yet.');
      }
      setIsOpeningAnimation(false);
    }, 1200);
  };

  // Toggle meaningful / favorite
  const handleToggleMeaningful = () => {
    const newState = StorageService.toggleMeaningful(capsule.id, user.id);
    setCapsule({ ...capsule, isMeaningful: newState });
  };

  const handleToggleFavorite = () => {
    const newState = StorageService.toggleFavorite(capsule.id, user.id);
    setCapsule({ ...capsule, isFavorite: newState });
  };

  // Add reflection response
  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    const ref = StorageService.addReflection(capsule.id, user.id, reflectionInput.trim(), user.name);
    if (ref) {
      setCapsule({
        ...capsule,
        reflections: [...(capsule.reflections || []), ref],
      });
      setReflectionInput('');
    }
  };

  // Quick unlock for testing
  const handleTimeWarpUnlock = () => {
    const updated = StorageService.forceUnlockCapsule(capsule.id, user.id);
    if (updated) {
      setCapsule(updated);
      setCountdown({
        totalMs: 0,
        isUnlocked: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        friendlyText: 'Ready to open',
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this time capsule?')) {
      StorageService.deleteCapsule(capsule.id, user.id);
      onDeleted();
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      {/* Top navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          id="capsule-detail-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#557048] hover:text-[#1F2A1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All capsules</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Change letter paper color button */}
          <div className="relative">
            <button
              id="capsule-change-letter-color-btn"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Customize letter stationery color"
              className="inline-flex items-center gap-1.5 text-xs text-[#32432A] bg-[#FAFBF8] border border-[#D5DFCE] px-3 py-1.5 rounded-full hover:border-[#557048] transition-colors font-medium shadow-2xs"
            >
              <Palette className="w-3.5 h-3.5 text-[#557048]" />
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                style={{ backgroundColor: stationery.swatchHex }}
              />
              <span className="hidden sm:inline">{stationery.name.split(' ')[0]}</span>
            </button>

            {showColorPicker && (
              <div className="absolute right-0 mt-2 p-3 w-64 bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#557048] font-medium">
                    Letter Color
                  </span>
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="text-xs text-[#6B8A5B] hover:text-[#1F2A1A]"
                  >
                    Done
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {STATIONERY_PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      onClick={() => {
                        handleChangeColor(pal.id);
                      }}
                      title={pal.name}
                      className={`h-10 rounded-xl border flex items-center justify-center transition-all ${
                        capsule.letterColor === pal.id
                          ? 'ring-2 ring-[#32432A] scale-105 shadow-xs'
                          : 'hover:scale-102 border-[#D5DFCE]'
                      }`}
                      style={{ backgroundColor: pal.swatchHex }}
                    >
                      {capsule.letterColor === pal.id && (
                        <Check
                          className={`w-4 h-4 ${
                            pal.isDark ? 'text-white' : 'text-[#32432A]'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tester Time Warp Button for locked capsules */}
          {isLocked && (
            <button
              id="capsule-force-unlock-test-btn"
              onClick={handleTimeWarpUnlock}
              title="Tester Mode: Instantly fast-forward time to unlock"
              className="inline-flex items-center gap-1.5 text-xs text-[#32432A] bg-[#E6EEE0] border border-[#CCD8C4] px-3 py-1.5 rounded-full hover:bg-[#D5DFCE] transition-colors font-medium"
            >
              <FastForward className="w-3.5 h-3.5 text-[#557048]" />
              <span>Test Fast-Forward</span>
            </button>
          )}

          <button
            id="capsule-delete-btn"
            onClick={handleDelete}
            title="Delete capsule"
            className="p-2 text-[#6B8A5B] hover:text-[#872828] hover:bg-[#FDF2F2] rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B]">
          {errorMsg}
        </div>
      )}

      {/* VIEW A: LOCKED CAPSULE STATE */}
      {isLocked && (
        <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
          {/* Watermark seal behind */}
          <div className="w-24 h-24 rounded-full wax-seal flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-amber-100" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-[#32432A] bg-[#E6EEE0] border border-[#CCD8C4] mb-4 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#557048]" />
            <span>This capsule is safely sealed</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F2A1A] font-medium mb-3">
            "{capsule.title}"
          </h1>

          <p className="text-sm text-[#557048] font-serif italic max-w-md mx-auto mb-8">
            The words inside are protected on {stationery.name} paper. They will remain intact until the appointed hour.
          </p>

          {/* Live Countdown Display */}
          <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-xs">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B8A5B] block mb-2">
              Time Remaining
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-white rounded-xl border border-[#D5DFCE]">
                <span className="font-mono text-2xl font-bold text-[#1F2A1A]">
                  {countdown?.days ?? 0}
                </span>
                <span className="block text-[9px] uppercase font-mono text-[#6B8A5B] mt-0.5">Days</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-[#D5DFCE]">
                <span className="font-mono text-2xl font-bold text-[#1F2A1A]">
                  {countdown?.hours ?? 0}
                </span>
                <span className="block text-[9px] uppercase font-mono text-[#6B8A5B] mt-0.5">Hours</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-[#D5DFCE]">
                <span className="font-mono text-2xl font-bold text-[#1F2A1A]">
                  {countdown?.minutes ?? 0}
                </span>
                <span className="block text-[9px] uppercase font-mono text-[#6B8A5B] mt-0.5">Mins</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-[#D5DFCE]">
                <span className="font-mono text-2xl font-bold text-[#32432A]">
                  {countdown?.seconds ?? 0}
                </span>
                <span className="block text-[9px] uppercase font-mono text-[#6B8A5B] mt-0.5">Secs</span>
              </div>
            </div>
            <p className="text-xs text-[#557048] font-mono mt-3">
              {countdown?.friendlyText}
            </p>
          </div>

          {/* Sealed Details metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs border-t border-[#EBF0E6] pt-6 max-w-lg mx-auto text-left">
            <div>
              <span className="block text-[10px] uppercase font-mono text-[#6B8A5B]">Type</span>
              <span className="font-medium text-[#1F2A1A]">
                {typeMeta.icon} {typeMeta.label}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono text-[#6B8A5B]">Stationery</span>
              <span className="font-medium text-[#1F2A1A] inline-flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full border border-black/10 inline-block"
                  style={{ backgroundColor: stationery.swatchHex }}
                />
                {stationery.name.split(' ')[0]}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono text-[#6B8A5B]">Sealed on</span>
              <span className="font-medium text-[#1F2A1A]">
                {formatDate(capsule.sealedAt || capsule.createdAt)}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono text-[#6B8A5B]">Unlocks on</span>
              <span className="font-medium text-[#32432A]">
                {formatDate(capsule.unlockAt)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: READY TO OPEN CEREMONY */}
      {isReadyToOpen && !isOpenedLetter && (
        <div className="bg-[#FAFBF8] border-2 border-[#557048]/40 rounded-2xl p-8 sm:p-14 text-center relative overflow-hidden shadow-md animate-in fade-in">
          {/* Gentle glow */}
          <div className="w-24 h-24 rounded-full bg-[#32432A] text-white flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
            <Sparkles className="w-10 h-10 text-amber-200" />
          </div>

          <div className="space-y-3 mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#32432A] font-semibold block">
              💌 A message from the past
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1F2A1A] font-normal tracking-tight">
              "{capsule.title}"
            </h1>
            <p className="font-serif text-lg text-[#425838] italic">
              You wrote this letter on {formatDate(capsule.sealedAt || capsule.createdAt)} on {stationery.name} paper.
            </p>
            <p className="text-xs text-[#557048] font-mono">
              The wait is over. The time capsule is ready to be opened.
            </p>
          </div>

          <button
            id="open-my-letter-btn"
            disabled={isOpeningAnimation}
            onClick={handleOpenLetter}
            className="inline-flex items-center gap-2.5 bg-[#32432A] text-[#F4F6F1] px-8 py-3.5 rounded-full text-base font-semibold hover:bg-[#273521] active:scale-95 transition-all shadow-md group"
          >
            <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 text-[#B7CCA9]" />
            <span>{isOpeningAnimation ? 'Unsealing letter...' : 'Open my letter'}</span>
          </button>
        </div>
      )}

      {/* VIEW C: OPENED LETTER READING EXPERIENCE */}
      {isOpenedLetter && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Main Parchment Letter with Selected Stationery Theme */}
          <article
            className={`border rounded-2xl p-8 sm:p-14 relative overflow-hidden shadow-sm transition-all ${stationery.bgClass} ${stationery.borderClass}`}
          >
            {/* Vintage Postmark Stamp */}
            <div
              className={`flex items-start justify-between border-b pb-6 mb-8 ${
                stationery.isDark ? 'border-white/10' : 'border-[#D5DFCE]/60'
              }`}
            >
              <div>
                <span
                  className={`text-xs font-mono uppercase tracking-widest font-medium block mb-1 ${
                    stationery.isDark ? 'text-[#B7CCA9]' : 'text-[#32432A]'
                  }`}
                >
                  Opened Time Capsule · {typeMeta.label}
                </span>
                <p
                  className={`font-mono text-sm ${
                    stationery.isDark ? 'text-[#C5D3BF]' : 'text-[#557048]'
                  }`}
                >
                  {formatDate(capsule.sealedAt || capsule.createdAt)}
                </p>
                <p
                  className={`text-xs font-serif italic mt-0.5 ${
                    stationery.isDark ? 'text-[#84947D]' : 'text-[#6B8A5B]'
                  }`}
                >
                  {formatTimeAgo(capsule.sealedAt || capsule.createdAt)}
                </p>
              </div>

              {/* Emotional Actions */}
              <div className="flex items-center gap-2">
                <button
                  id="capsule-reaction-meaningful-btn"
                  onClick={handleToggleMeaningful}
                  title="Mark as meaningful"
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    capsule.isMeaningful
                      ? 'bg-[#E6EEE0] border-[#32432A] text-[#32432A]'
                      : stationery.isDark
                      ? 'bg-white/10 border-white/20 text-white/80 hover:text-white'
                      : 'bg-white/70 border-[#D5DFCE] text-[#557048] hover:text-[#1F2A1A]'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      capsule.isMeaningful ? 'fill-[#872828] text-[#872828]' : ''
                    }`}
                  />
                  <span>Meaningful</span>
                </button>

                <button
                  id="capsule-reaction-favorite-btn"
                  onClick={handleToggleFavorite}
                  title="Mark as favorite"
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    capsule.isFavorite
                      ? 'bg-[#FEF9E7] border-amber-400 text-amber-700'
                      : stationery.isDark
                      ? 'bg-white/10 border-white/20 text-white/80 hover:text-white'
                      : 'bg-white/70 border-[#D5DFCE] text-[#557048] hover:text-[#1F2A1A]'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      capsule.isFavorite ? 'fill-amber-500 text-amber-500' : ''
                    }`}
                  />
                  <span>Favorite</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h1
              className={`font-serif text-3xl sm:text-4xl font-medium leading-tight mb-8 ${stationery.textClass}`}
            >
              {capsule.title}
            </h1>

            {/* Letter Body */}
            <div
              className={`font-serif text-lg sm:text-xl leading-[1.8] whitespace-pre-wrap ${stationery.textClass}`}
            >
              {capsule.content}
            </div>

            {/* Photos & Attachments */}
            {capsule.attachments && capsule.attachments.length > 0 && (
              <div
                className={`mt-12 pt-8 border-t ${
                  stationery.isDark ? 'border-white/10' : 'border-[#D5DFCE]/60'
                }`}
              >
                <span
                  className={`text-[11px] font-mono uppercase tracking-wider block mb-4 ${
                    stationery.isDark ? 'text-[#A0AF99]' : 'text-[#557048]'
                  }`}
                >
                  Preserved Memories & Photos
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {capsule.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="rounded-xl overflow-hidden border border-[#D5DFCE] bg-[#FAFBF8] p-2 shadow-xs"
                    >
                      <img
                        src={att.fileUrl}
                        alt={att.fileName}
                        className="w-full h-56 object-cover rounded-lg"
                      />
                      {att.caption && (
                        <p className="text-xs text-[#425838] font-serif italic mt-2 px-1">
                          {att.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Letter Signoff */}
            <div
              className={`mt-12 pt-6 border-t flex items-center justify-between text-xs font-serif italic ${
                stationery.isDark
                  ? 'border-white/10 text-[#A0AF99]'
                  : 'border-[#D5DFCE]/60 text-[#557048]'
              }`}
            >
              <span>Sealed on {formatDate(capsule.sealedAt || capsule.createdAt)}</span>
              <span>Opened on {formatDate(capsule.openedAt || new Date().toISOString())}</span>
            </div>
          </article>

          {/* Conversation between Past-Self and Present-Self: "What would you say back?" */}
          <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-[#32432A] font-semibold mb-2">
              <MessageSquare className="w-4 h-4 text-[#557048]" />
              <span>Dialogue with your past self</span>
            </div>
            <h3 className="font-serif text-2xl text-[#1F2A1A] font-normal mb-2">
              What would you say back?
            </h3>
            <p className="text-xs text-[#557048] font-serif italic mb-6">
              Write a reflection or answer to the person you were when this was sealed.
            </p>

            {/* Existing Reflections History */}
            {capsule.reflections && capsule.reflections.length > 0 && (
              <div className="space-y-4 mb-6">
                {capsule.reflections.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-4 rounded-xl bg-white border border-[#D5DFCE]"
                  >
                    <div className="flex items-center justify-between text-xs text-[#557048] mb-1 font-mono">
                      <span className="font-medium text-[#1F2A1A]">{ref.authorName || 'Present You'}</span>
                      <span>{formatDateTime(ref.createdAt)}</span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-[#1F2A1A] italic leading-relaxed">
                      "{ref.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reflection Input Form */}
            <form onSubmit={handleAddReflection} className="space-y-3">
              <textarea
                id="capsule-reflection-input"
                rows={3}
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder="«Reading this today, I want to tell younger me that...»"
                className="w-full p-3.5 font-serif text-sm sm:text-base bg-white border border-[#D5DFCE] rounded-xl focus:border-[#32432A] focus:outline-none transition-colors placeholder-[#6B8A5B]/70"
              />
              <div className="flex items-center justify-end">
                <button
                  id="capsule-submit-reflection-btn"
                  type="submit"
                  disabled={!reflectionInput.trim()}
                  className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-5 py-2 rounded-full text-xs font-medium hover:bg-[#273521] disabled:opacity-40 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send reply back</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
