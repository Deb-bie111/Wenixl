import React, { useState, useRef, useEffect } from 'react';
import { Capsule, CapsuleType, Attachment, UserProfile } from '../types';
import { WRITING_PROMPTS } from '../data/prompts';
import { formatDate, getCountdown } from '../utils/date';
import { StorageService } from '../services/storage';
import { getStationeryOption, STATIONERY_PALETTES } from '../data/stationery';
import { QuillPen, QuillCompanion, QuillSealingAnimation } from './QuillAnimation';
import {
  ArrowLeft,
  Lock,
  Calendar,
  Image as ImageIcon,
  X,
  Shuffle,
  Check,
  Upload,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateCapsuleProps {
  user: UserProfile;
  onClose: () => void;
  onSealed: (capsuleId: string) => void;
  draftCapsule?: Capsule | null;
}

export const CreateCapsule: React.FC<CreateCapsuleProps> = ({
  user,
  onClose,
  onSealed,
  draftCapsule,
}) => {
  // Letter content state
  const [title, setTitle] = useState(draftCapsule?.title || '');
  const [content, setContent] = useState(draftCapsule?.content || '');
  const [letterColor, setLetterColor] = useState<string>(draftCapsule?.letterColor || 'sage');
  const [attachments, setAttachments] = useState<Attachment[]>(draftCapsule?.attachments || []);
  const [type] = useState<CapsuleType>(draftCapsule?.type || 'letter');

  // Interactive typing & quill state
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Delivery date & preset selection
  const [deliveryPreset, setDeliveryPreset] = useState<string>('In 1 year');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customDate, setCustomDate] = useState<string>(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().slice(0, 16);
  });
  const [calculatedUnlockAt, setCalculatedUnlockAt] = useState<string>(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString();
  });

  // Prompt drawer state (minimal inline)
  const [showPrompt, setShowPrompt] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string>(
    () => WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)]
  );

  // Sealing flow state
  const [isSealing, setIsSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [sealedCapsule, setSealedCapsule] = useState<Capsule | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stationery = getStationeryOption(letterColor);

  // Handle typing detection to activate quill pen animation
  const registerTyping = () => {
    setIsTyping(true);
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1400);
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  // Preset date calculator
  const calculateDateForPreset = (preset: string): string => {
    const now = new Date();
    switch (preset) {
      case 'Tonight': {
        const tonight = new Date(now);
        tonight.setHours(23, 0, 0, 0);
        if (tonight.getTime() <= now.getTime()) {
          tonight.setDate(tonight.getDate() + 1);
        }
        return tonight.toISOString();
      }
      case 'Tomorrow': {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.toISOString();
      }
      case 'Next week': {
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(9, 0, 0, 0);
        return nextWeek.toISOString();
      }
      case 'In 1 year': {
        const oneYear = new Date(now);
        oneYear.setFullYear(oneYear.getFullYear() + 1);
        return oneYear.toISOString();
      }
      case 'In 5 years': {
        const fiveYears = new Date(now);
        fiveYears.setFullYear(fiveYears.getFullYear() + 5);
        return fiveYears.toISOString();
      }
      case 'In 10 years': {
        const tenYears = new Date(now);
        tenYears.setFullYear(tenYears.getFullYear() + 10);
        return tenYears.toISOString();
      }
      case 'Custom date': {
        return new Date(customDate).toISOString();
      }
      default:
        return new Date(now.getTime() + 365 * 24 * 3600 * 1000).toISOString();
    }
  };

  const handleSelectPreset = (preset: string) => {
    setDeliveryPreset(preset);
    if (preset !== 'Custom date') {
      const computed = calculateDateForPreset(preset);
      setCalculatedUnlockAt(computed);
      setIsDatePickerOpen(false);
    } else {
      setCalculatedUnlockAt(new Date(customDate).toISOString());
    }
  };

  const handleCustomDateChange = (val: string) => {
    setCustomDate(val);
    if (val) {
      setCalculatedUnlockAt(new Date(val).toISOString());
    }
  };

  const handleRandomPrompt = () => {
    const unusedPrompts = WRITING_PROMPTS.filter((p) => p !== activePrompt);
    const random = unusedPrompts[Math.floor(Math.random() * unusedPrompts.length)];
    setActivePrompt(random);
  };

  const handleInsertPrompt = () => {
    const addition = content.trim() ? `\n\n${activePrompt}\n` : `${activePrompt}\n`;
    setContent(content + addition);
    registerTyping();
  };

  // Attachments
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const newAttachment: Attachment = {
        id: 'att_' + Math.random().toString(36).substring(2, 9),
        capsuleId: draftCapsule?.id || 'temp',
        fileUrl: reader.result as string,
        fileName: file.name,
        fileType: 'image',
        createdAt: new Date().toISOString(),
      };
      setAttachments([...attachments, newAttachment]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSamplePhoto = (url: string, name: string) => {
    const newAttachment: Attachment = {
      id: 'att_' + Math.random().toString(36).substring(2, 9),
      capsuleId: draftCapsule?.id || 'temp',
      fileUrl: url,
      fileName: name,
      fileType: 'image',
      createdAt: new Date().toISOString(),
    };
    setAttachments([...attachments, newAttachment]);
    setShowPhotoModal(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  // Sealing action with Quill animation
  const handleSeal = () => {
    if (!content.trim()) return;

    setIsSealing(true);

    setTimeout(() => {
      const nowIso = new Date().toISOString();
      const capsuleToSave: Capsule = {
        id: draftCapsule?.id || 'cap_' + Math.random().toString(36).substring(2, 9),
        userId: user.id,
        title: title.trim() || 'To my future self',
        type,
        content: content.trim(),
        letterColor,
        status: 'sealed',
        createdAt: draftCapsule?.createdAt || nowIso,
        unlockAt: calculatedUnlockAt,
        sealedAt: nowIso,
        deliveryPreset,
        attachments,
        reflections: [],
      };

      StorageService.saveCapsule(capsuleToSave);
      setSealedCapsule(capsuleToSave);
      setIsSealing(false);
      setIsSealed(true);
    }, 1800);
  };

  const handleSaveDraft = () => {
    const nowIso = new Date().toISOString();
    const draft: Capsule = {
      id: draftCapsule?.id || 'draft_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      title: title.trim() || 'Untitled Draft',
      type,
      content,
      letterColor,
      status: 'draft',
      createdAt: draftCapsule?.createdAt || nowIso,
      unlockAt: calculatedUnlockAt,
      deliveryPreset,
      attachments,
      reflections: [],
    };
    StorageService.saveCapsule(draft);
    onClose();
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // ==========================================
  // VIEW: SEALED CONFIRMATION SCREEN
  // ==========================================
  if (isSealed && sealedCapsule) {
    return (
      <div className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-12 text-center animate-in fade-in">
        {/* Wax seal stamping effect */}
        <motion.div
          initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 120 }}
          className="w-24 h-24 rounded-full bg-[#32432A] border-4 border-[#273521] flex items-center justify-center text-white mx-auto shadow-xl mb-6 relative"
        >
          <div className="text-center font-serif">
            <span className="block text-2xl font-bold tracking-tighter text-[#F4F6F1]">L</span>
            <span className="block text-[9px] uppercase tracking-widest text-[#B7CCA9]">SEALED</span>
          </div>
          <div className="absolute -top-1 -right-1">
            <QuillPen size="sm" isWriting={false} />
          </div>
        </motion.div>

        <div className="space-y-3 mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#557048] font-semibold">
            Time Capsule Sealed
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A1A] font-normal tracking-tight">
            Your letter is quietly resting.
          </h2>
          <p className="text-base text-[#425838] font-serif italic">
            Appointed to be returned on:
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-[#32432A] font-medium">
            {formatDate(sealedCapsule.unlockAt)}
          </p>
          <p className="text-sm text-[#557048] font-serif max-w-md mx-auto pt-1">
            Until the appointed hour arrives, your words stay safely locked away.
          </p>
        </div>

        {/* Countdown card */}
        <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-6 max-w-sm mx-auto shadow-xs mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B8A5B] block mb-1">
            Time Until Unlock
          </span>
          <p className="font-mono text-xl text-[#32432A] font-semibold">
            {getCountdown(sealedCapsule.unlockAt).friendlyText}
          </p>
        </div>

        <button
          id="sealed-return-to-dashboard-btn"
          onClick={() => onSealed(sealedCapsule.id)}
          className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-7 py-3 rounded-full text-sm font-medium hover:bg-[#273521] transition-all shadow-xs"
        >
          <span>Return to capsules</span>
        </button>
      </div>
    );
  }

  // ==========================================
  // VIEW: SEALING IN PROGRESS (QUILL ANIMATION)
  // ==========================================
  if (isSealing) {
    return (
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-20 flex flex-col items-center justify-center text-center animate-in fade-in">
        <QuillSealingAnimation unlockDateFormatted={formatDate(calculatedUnlockAt)} />
        <div className="mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#557048]">
          <span className="w-2 h-2 rounded-full bg-[#557048] animate-ping" />
          <span>Inscribing & pressing seal...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: SIMPLIFIED DISTRACTION-FREE DESK
  // ==========================================
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
      {/* Top minimal bar: clean & uncluttered */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            id="create-capsule-back-btn"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs text-[#557048] hover:text-[#1F2A1A] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-[#E6EEE0]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            id="create-capsule-save-draft-btn"
            onClick={handleSaveDraft}
            className="text-xs text-[#6B8A5B] hover:text-[#1F2A1A] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-[#E6EEE0]"
          >
            Save draft
          </button>
        </div>

        {/* Center: Delivery Horizon Selector Pill */}
        <div className="relative">
          <button
            id="create-capsule-horizon-btn"
            type="button"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6EEE0] border border-[#CCD8C4] text-xs font-medium text-[#32432A] hover:bg-[#D5DFCE] transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-[#557048]" />
            <span>Unlocks: {deliveryPreset}</span>
            <ChevronDown className="w-3 h-3 text-[#557048]" />
          </button>

          {/* Quick Date Presets Dropdown */}
          <AnimatePresence>
            {isDatePickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute right-0 sm:left-0 mt-2 w-64 bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-3 shadow-lg z-30 space-y-1"
              >
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#6B8A5B] px-2 py-1">
                  Choose unlock moment
                </div>
                {[
                  'Tonight',
                  'Tomorrow',
                  'Next week',
                  'In 1 year',
                  'In 5 years',
                  'In 10 years',
                  'Custom date',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-xl transition-colors flex items-center justify-between ${
                      deliveryPreset === preset
                        ? 'bg-[#32432A] text-[#F4F6F1] font-medium'
                        : 'text-[#425838] hover:bg-[#E6EEE0]'
                    }`}
                  >
                    <span>{preset}</span>
                    {deliveryPreset === preset && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}

                {deliveryPreset === 'Custom date' && (
                  <div className="pt-2 mt-1 border-t border-[#D5DFCE]">
                    <input
                      type="datetime-local"
                      value={customDate}
                      onChange={(e) => handleCustomDateChange(e.target.value)}
                      className="w-full text-xs p-1.5 border border-[#D5DFCE] rounded-lg bg-white focus:outline-none"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Seal Button */}
        <button
          id="create-capsule-seal-header-btn"
          disabled={!content.trim()}
          onClick={handleSeal}
          className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-5 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#273521] disabled:opacity-35 disabled:pointer-events-none transition-all shadow-xs"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Seal Letter</span>
        </button>
      </div>

      {/* Simplified Stationery Swatch Dots */}
      <div className="flex items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B8A5B]">
            Paper:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATIONERY_PALETTES.map((pal) => (
              <button
                key={pal.id}
                type="button"
                onClick={() => setLetterColor(pal.id)}
                title={pal.name}
                className={`w-6 h-6 rounded-full border transition-all ${
                  letterColor === pal.id
                    ? 'ring-2 ring-[#32432A] ring-offset-2 scale-110'
                    : 'opacity-80 hover:opacity-100 hover:scale-105'
                }`}
                style={{
                  backgroundColor: pal.swatchHex,
                  borderColor: pal.isDark ? '#4A633E' : '#CCD8C4',
                }}
              />
            ))}
          </div>
        </div>

        {/* Minimal inline prompt toggle */}
        <button
          type="button"
          onClick={() => setShowPrompt(!showPrompt)}
          className="inline-flex items-center gap-1 text-xs text-[#557048] hover:text-[#1F2A1A] transition-colors font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showPrompt ? 'Hide prompt' : 'Inspire me'}</span>
        </button>
      </div>

      {/* Inline Minimal Prompt Banner (Collapsible) */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-3.5 rounded-2xl bg-[#E6EEE0] border border-[#CCD8C4] flex items-center justify-between gap-3">
              <p className="font-serif italic text-xs sm:text-sm text-[#1F2A1A]">
                «{activePrompt}»
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleRandomPrompt}
                  title="Another prompt"
                  className="p-1.5 text-[#557048] hover:text-[#1F2A1A] rounded-lg hover:bg-white/50 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleInsertPrompt}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#32432A] text-[#F4F6F1] font-medium hover:bg-[#273521] transition-colors"
                >
                  Use this
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE LETTER SHEET (Pure writing canvas with Quill Companion) */}
      <div
        className={`rounded-2xl border p-6 sm:p-10 shadow-sm transition-all duration-300 relative overflow-hidden ${stationery.bgClass} ${stationery.borderClass}`}
      >
        {/* Letter Top Details Bar */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] uppercase font-mono tracking-widest ${
                stationery.isDark ? 'text-[#A0AF99]' : 'text-[#6B8A5B]'
              }`}
            >
              Airmail · {formatDate(new Date().toISOString())}
            </span>
          </div>

          {/* Quill Desk Companion Animation */}
          <QuillCompanion isTyping={isTyping} wordCount={wordCount} />
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <input
            id="create-capsule-title-input"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              registerTyping();
            }}
            placeholder="To my future self..."
            className={`w-full font-serif text-2xl sm:text-3xl bg-transparent border-b pb-2 focus:outline-none transition-colors ${stationery.textClass} ${stationery.borderClass}`}
          />
        </div>

        {/* Body Textarea with Lined / Natural Letter Flow */}
        <div className="relative mb-6">
          <textarea
            id="create-capsule-content-input"
            rows={14}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              registerTyping();
            }}
            placeholder="Write what you are feeling today... Your hopes, quiet questions, what the morning felt like, or a promise you don't want to forget."
            className={`w-full font-serif text-base sm:text-lg bg-transparent leading-relaxed focus:outline-none resize-y transition-all min-h-[340px] ${stationery.textClass} ${stationery.placeholderClass}`}
          />
        </div>

        {/* Attachments Section */}
        <div
          className={`pt-5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            stationery.isDark ? 'border-white/10' : 'border-black/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              id="create-capsule-upload-photo-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
                stationery.isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-black/5 hover:bg-black/10 text-[#32432A]'
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>Attach photo</span>
            </button>

            <button
              id="create-capsule-sample-photo-btn"
              type="button"
              onClick={() => setShowPhotoModal(true)}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                stationery.isDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-[#557048] hover:text-[#1F2A1A]'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Sample memory</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="create-capsule-seal-bottom-btn"
              type="button"
              disabled={!content.trim()}
              onClick={handleSeal}
              className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#273521] active:scale-98 disabled:opacity-35 disabled:pointer-events-none transition-all shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Seal Letter</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Preview of Attachments */}
        {attachments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-black/5">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="relative group rounded-xl overflow-hidden border border-[#D5DFCE] bg-[#FAFBF8]"
              >
                <img
                  src={att.fileUrl}
                  alt={att.fileName}
                  className="w-full h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(att.id)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-[10px] text-[#557048] p-1 truncate">{att.fileName}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset Sample Photo Picker Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-[#1F2A1A]">Select a memory photo</h3>
              <button onClick={() => setShowPhotoModal(false)} className="text-[#557048]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#557048] mb-4">
              Choose a sample memory image to preserve with this capsule:
            </p>
            <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {[
                {
                  url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
                  name: 'Quiet desk with tea',
                },
                {
                  url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
                  name: 'Pacific horizon sunrise',
                },
                {
                  url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
                  name: 'New apartment keys',
                },
                {
                  url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
                  name: 'Old journal notebook',
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSamplePhoto(item.url, item.name)}
                  className="rounded-xl overflow-hidden border border-[#D5DFCE] hover:border-[#32432A] text-left transition-colors group"
                >
                  <img src={item.url} alt={item.name} className="w-full h-24 object-cover" />
                  <p className="text-[11px] font-medium text-[#1F2A1A] p-2 truncate group-hover:text-[#32432A]">
                    {item.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
