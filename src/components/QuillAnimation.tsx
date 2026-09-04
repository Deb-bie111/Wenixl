import React from 'react';
import { motion } from 'motion/react';

interface QuillPenProps {
  isWriting?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * An artistic, meticulously illustrated SVG quill pen with natural feather vanes,
 * quill spine, and ink nib.
 */
export const QuillPen: React.FC<QuillPenProps> = ({
  isWriting = false,
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { width: 36, height: 36, viewBox: '0 0 64 64' },
    md: { width: 56, height: 56, viewBox: '0 0 64 64' },
    lg: { width: 84, height: 84, viewBox: '0 0 64 64' },
  };

  const currentSize = sizeMap[size];

  return (
    <motion.div
      className={`relative inline-block select-none pointer-events-none ${className}`}
      animate={
        isWriting
          ? {
              rotate: [0, -12, -4, -14, 0],
              x: [0, 6, 2, 8, 0],
              y: [0, -4, 2, -2, 0],
            }
          : {
              rotate: [0, -2, 0],
              y: [0, -2, 0],
            }
      }
      transition={
        isWriting
          ? {
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }
      }
      style={{ transformOrigin: '12px 54px' }}
    >
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox={currentSize.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Feather gradient: natural olive & sage tones with warm ivory highlights */}
          <linearGradient id="featherGrad" x1="50" y1="4" x2="16" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A633E" />
            <stop offset="40%" stopColor="#647E56" />
            <stop offset="85%" stopColor="#879E78" />
            <stop offset="100%" stopColor="#C4D4BC" />
          </linearGradient>

          {/* Quill spine gradient */}
          <linearGradient id="rachisGrad" x1="54" y1="6" x2="12" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#222F1D" />
            <stop offset="70%" stopColor="#3C4F33" />
            <stop offset="100%" stopColor="#5E7851" />
          </linearGradient>

          {/* Gold nib gradient */}
          <linearGradient id="nibGrad" x1="10" y1="52" x2="6" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5E08C" />
            <stop offset="100%" stopColor="#997A1E" />
          </linearGradient>
        </defs>

        {/* Back feather fluff / shadow */}
        <path
          d="M48 6C42 12 36 22 28 34C24 40 20 46 16 50C18 46 22 38 28 28C34 18 42 10 48 6Z"
          fill="#3B4F32"
          opacity="0.25"
        />

        {/* Outer feather vane */}
        <path
          d="M52 4C54 8 55 13 52 18C49 23 44 26 47 30C49 33 46 38 42 42C38 46 34 48 31 50C29 51 25 51 21 52C23 48 26 44 28 40C33 34 38 26 44 18C48 12 51 7 52 4Z"
          fill="url(#featherGrad)"
        />

        {/* Delicate feather barbs texture */}
        <path
          d="M50 10L38 20M48 16L34 26M44 23L30 33M40 30L26 39M36 37L22 46"
          stroke="#FAFBF8"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Inner feather vane */}
        <path
          d="M51 5C45 9 39 16 33 24C27 32 21 41 16 50C15 48 16 44 19 40C23 33 28 25 34 18C40 11 46 7 51 5Z"
          fill="#526D45"
        />

        {/* Central quill shaft (rachis) */}
        <path
          d="M52 5C42 17 31 31 16 52L14 54L13 53C28 32 40 18 52 5Z"
          fill="url(#rachisGrad)"
        />

        {/* Metallic Calamus & Nib */}
        <path
          d="M16 52L12 58L9 62L10 59L13 53L16 52Z"
          fill="url(#nibGrad)"
        />

        {/* Nib slit */}
        <path
          d="M12 58L8 62"
          stroke="#1F2A1A"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Ink tip drop */}
        <circle cx="8" cy="62" r="1.2" fill="#1F2A1A" />
      </svg>
    </motion.div>
  );
};

/**
 * Animated Quill Desk Companion
 * Sits quietly on the letter parchment. When typing, it sways gracefully
 * with gentle ink trail ripples and a "Penning your words..." indicator.
 */
interface QuillCompanionProps {
  isTyping: boolean;
  wordCount: number;
}

export const QuillCompanion: React.FC<QuillCompanionProps> = ({ isTyping, wordCount }) => {
  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xs border border-black/5 dark:border-white/10 text-xs font-serif transition-all">
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Inkwell stand */}
        <div className="absolute bottom-0.5 w-3.5 h-2 rounded-b-md bg-[#2B3B24] border border-[#485D3E]/60 shadow-xs" />
        {/* Animated Quill */}
        <QuillPen isWriting={isTyping} size="sm" className="absolute bottom-1 right-0.5" />
      </div>

      <div className="flex items-center gap-2">
        <span className="italic">
          {isTyping ? (
            <motion.span
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
              className="text-[#32432A] dark:text-[#E6EEE0] font-medium"
            >
              Quill is writing...
            </motion.span>
          ) : (
            <span className="opacity-75">Quill poised</span>
          )}
        </span>
        <span className="opacity-30">·</span>
        <span className="font-mono text-[11px] opacity-75">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>
    </div>
  );
};

/**
 * Flowing Calligraphy Signature with Quill for Sealing Letter
 * Smoothly draws a signature stroke before wax seal descends.
 */
interface QuillSealingAnimationProps {
  unlockDateFormatted: string;
}

export const QuillSealingAnimation: React.FC<QuillSealingAnimationProps> = ({
  unlockDateFormatted,
}) => {
  return (
    <div className="py-6 flex flex-col items-center justify-center relative">
      <div className="relative w-72 h-32 flex items-center justify-center">
        {/* Calligraphic cursive line drawn by quill */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 280 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flourish underline */}
          <motion.path
            d="M 20 85 Q 80 100, 140 70 T 260 85"
            stroke="#32432A"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Cursive cursive script text */}
          <motion.text
            x="30"
            y="65"
            fontFamily="Newsreader, serif"
            fontStyle="italic"
            fontSize="22"
            fill="#1F2A1A"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Sealed with care
          </motion.text>
        </svg>

        {/* Quill pen moving along the path */}
        <motion.div
          className="absolute"
          initial={{ x: -100, y: 0, rotate: 10 }}
          animate={{
            x: [ -80, 20, 90, 110 ],
            y: [ 10, -5, 12, 18 ],
            rotate: [ 0, -15, -5, -20 ],
          }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <QuillPen isWriting size="md" />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs font-mono uppercase tracking-widest text-[#557048] mt-2"
      >
        Inscribing unlock date: {unlockDateFormatted}
      </motion.p>
    </div>
  );
};
