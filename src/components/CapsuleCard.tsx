import React, { useEffect, useState } from 'react';
import { Capsule } from '../types';
import { formatDate, getCountdown, CountdownInfo } from '../utils/date';
import { CAPSULE_TYPES } from '../data/prompts';
import { getStationeryOption } from '../data/stationery';
import { Lock, Sparkles, CheckCheck, Clock, FileEdit, Heart, Star, Image as ImageIcon } from 'lucide-react';

interface CapsuleCardProps {
  capsule: Capsule;
  onClick: () => void;
  onQuickUnlock?: (capsuleId: string) => void;
}

export const CapsuleCard: React.FC<CapsuleCardProps> = ({
  capsule,
  onClick,
  onQuickUnlock,
}) => {
  const [countdown, setCountdown] = useState<CountdownInfo>(() => getCountdown(capsule.unlockAt));

  useEffect(() => {
    // Only tick live if sealed and not yet unlocked
    if (capsule.status === 'sealed') {
      const interval = setInterval(() => {
        setCountdown(getCountdown(capsule.unlockAt));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [capsule.status, capsule.unlockAt]);

  const typeMeta = CAPSULE_TYPES.find((t) => t.type === capsule.type) || CAPSULE_TYPES[0];
  const stationery = getStationeryOption(capsule.letterColor);

  // Status visual attributes
  const isReady = capsule.status === 'ready' || (capsule.status === 'sealed' && countdown.isUnlocked);
  const isOpened = capsule.status === 'opened';
  const isDraft = capsule.status === 'draft';
  const isSealed = capsule.status === 'sealed' && !countdown.isUnlocked;

  return (
    <div
      id={`capsule-card-${capsule.id}`}
      onClick={onClick}
      className={`group letter-sheet border rounded-2xl p-6 relative flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
        isReady
          ? 'border-[#557048] bg-[#FAFBF8] ring-2 ring-[#557048]/30 shadow-sm'
          : isOpened
          ? `${stationery.borderClass} ${stationery.bgClass}`
          : isDraft
          ? 'border-dashed border-[#B7CCA9] bg-[#FAFBF8]'
          : 'border-[#D5DFCE] bg-[#FAFBF8]'
      }`}
    >
      <div>
        {/* Header row: Type & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E6EEE0] text-[#32432A]">
              <span>{typeMeta.icon}</span>
              <span>{typeMeta.label}</span>
            </div>

            {/* Stationery Paper Color Tag */}
            <div
              title={`Letter written on ${stationery.name}`}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                stationery.isDark
                  ? 'bg-[#273521] text-[#E6EEE0] border-[#32432A]'
                  : 'bg-white/80 text-[#32432A] border-[#D5DFCE]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: stationery.swatchHex }}
              />
              <span className="truncate max-w-[80px]">{stationery.name.split(' ')[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {capsule.isMeaningful && (
              <span title="Meaningful" className="text-[#872828] text-xs">
                <Heart className="w-3.5 h-3.5 fill-[#872828]" />
              </span>
            )}
            {capsule.isFavorite && (
              <span title="Favorite" className="text-amber-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
              </span>
            )}
            {capsule.attachments && capsule.attachments.length > 0 && (
              <span title={`${capsule.attachments.length} photo attached`} className="text-[#6B8A5B] text-xs flex items-center gap-0.5">
                <ImageIcon className="w-3.5 h-3.5" />
              </span>
            )}

            {/* Status indicator tag */}
            {isReady && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6EEE0] text-[#32432A] border border-[#CCD8C4] animate-pulse">
                <Sparkles className="w-3 h-3 text-[#557048]" />
                Ready to open
              </span>
            )}
            {isOpened && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E6EEE0] text-[#32432A] border border-[#CCD8C4]">
                <CheckCheck className="w-3 h-3 text-[#557048]" />
                Opened
              </span>
            )}
            {isDraft && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBF0E6] text-[#557048]">
                <FileEdit className="w-3 h-3" />
                Draft
              </span>
            )}
            {isSealed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBF0E6] text-[#425838]">
                <Lock className="w-3 h-3 text-[#557048]" />
                Sealed
              </span>
            )}
          </div>
        </div>

        {/* Preset pill if applicable */}
        {capsule.deliveryPreset && (
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#557048] font-medium mb-1">
            🌿 {capsule.deliveryPreset}
          </p>
        )}

        {/* Title */}
        <h3
          className={`font-serif text-xl sm:text-2xl font-medium line-clamp-2 mb-2 group-hover:text-[#557048] transition-colors leading-snug ${
            isOpened && stationery.isDark ? stationery.textClass : 'text-[#1F2A1A]'
          }`}
        >
          "{capsule.title}"
        </h3>

        {/* Subtitle / Excerpt preview or sealed notice */}
        {isOpened ? (
          <p
            className={`text-xs font-serif italic line-clamp-2 mb-4 ${
              stationery.isDark ? stationery.mutedClass : 'text-[#425838]'
            }`}
          >
            {capsule.content}
          </p>
        ) : isDraft ? (
          <p className="text-xs text-[#6B8A5B] font-serif italic line-clamp-2 mb-4">
            {capsule.content || 'Draft in progress... Click to continue writing.'}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[#557048] font-serif italic mb-4">
            <span className="w-2 h-2 rounded-full bg-[#557048]/60 inline-block"></span>
            <span>Words sealed safely until appointed hour</span>
          </div>
        )}
      </div>

      {/* Footer info: Sealed Date & Countdown */}
      <div className={`pt-4 border-t flex items-center justify-between text-xs ${
        isOpened && stationery.isDark ? `${stationery.borderClass} ${stationery.mutedClass}` : 'border-[#EBF0E6] text-[#557048]'
      }`}>
        <div>
          <span className="block text-[10px] uppercase font-mono tracking-wider opacity-75">
            {isDraft ? 'Created' : 'Sealed'}
          </span>
          <span className="font-medium">
            {formatDate(capsule.sealedAt || capsule.createdAt)}
          </span>
        </div>

        <div className="text-right">
          {isReady ? (
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-[#32432A] font-semibold">
                Action
              </span>
              <span className="font-medium text-[#32432A] font-serif underline underline-offset-2 flex items-center gap-1 justify-end">
                Open letter →
              </span>
            </div>
          ) : isOpened ? (
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider opacity-75">
                Opened on
              </span>
              <span className="font-medium">
                {formatDate(capsule.openedAt || capsule.unlockAt)}
              </span>
            </div>
          ) : isDraft ? (
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider opacity-75">
                Target
              </span>
              <span className="font-medium">
                {formatDate(capsule.unlockAt)}
              </span>
            </div>
          ) : (
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider opacity-75">
                Countdown
              </span>
              <span className="font-medium text-[#32432A] font-mono flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-[#557048]" />
                {countdown.friendlyText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
