import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, Lock, Clock, Sparkles } from 'lucide-react';
import { QuillPen } from './QuillAnimation';

interface LandingPageProps {
  onNavigate: (view: ViewState) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenAuth,
  isLoggedIn,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartWriting = () => {
    if (isLoggedIn) {
      onNavigate({ type: 'create' });
    } else {
      onNavigate({ type: 'create' });
    }
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Subtle timeless badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6EEE0] border border-[#CCD8C4] text-xs font-medium text-[#32432A] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#557048]"></span>
            <span>A private digital time capsule</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1F2A1A] tracking-tight leading-[1.12] mb-6">
            Write something your future self should remember.
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl text-[#425838] max-w-2xl mx-auto font-serif italic leading-relaxed mb-10">
            A thought. A promise. A question. A memory.<br className="hidden sm:inline" />
            Seal it away and we'll give it back to you when the time is right.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              id="hero-write-letter-cta"
              onClick={handleStartWriting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#32432A] text-[#F4F6F1] px-7 py-3.5 rounded-full text-base font-medium hover:bg-[#273521] active:scale-98 transition-all shadow-sm group"
            >
              <span>Write a letter</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#B7CCA9]" />
            </button>

            <button
              id="hero-how-it-works-cta"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAFBF8] border border-[#D5DFCE] text-[#425838] hover:text-[#1F2A1A] hover:border-[#557048] px-6 py-3.5 rounded-full text-base font-medium transition-colors"
            >
              How it works
            </button>
          </div>

          {/* Subtle visual representation of sealed letter/time capsule */}
          <div className="relative max-w-md mx-auto">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[#D5DFCE]/40 blur-2xl -z-10 rounded-3xl transform -rotate-1"></div>

            <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-6 sm:p-8 text-left relative overflow-hidden transition-transform duration-300 hover:scale-[1.01] shadow-xs">
              {/* Postage stamp & animated quill */}
              <div className="absolute top-6 right-6 flex items-center gap-3">
                <QuillPen size="sm" isWriting={false} className="opacity-90" />
                <div className="border border-dashed border-[#B7CCA9] p-1.5 rounded bg-white/70 text-center">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#557048] block leading-none">
                    SEPT 2026
                  </span>
                  <span className="text-[9px] text-[#6B8A5B] block mt-0.5">AIRMAIL</span>
                </div>
              </div>

              {/* Wax Seal icon */}
              <div className="w-12 h-12 rounded-full wax-seal flex items-center justify-center text-white mb-6 shadow-md">
                <Lock className="w-5 h-5 text-amber-100" />
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest font-mono text-[#32432A] font-medium">
                  Sealed Time Capsule
                </p>
                <h3 className="font-serif text-xl sm:text-2xl text-[#1F2A1A] font-medium">
                  "To the woman I hope I've become."
                </h3>
                <p className="text-sm text-[#557048] font-serif italic pt-1">
                  «Dear Future Me in 2036... I don't know where you are when you're reading this...»
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EBF0E6] flex items-center justify-between text-xs text-[#557048] font-mono">
                <div>
                  <span className="block text-[#6B8A5B] text-[10px] uppercase">Sealed</span>
                  <span>September 4, 2026</span>
                </div>
                <div className="text-right">
                  <span className="block text-[#6B8A5B] text-[10px] uppercase">Unlocks in</span>
                  <span className="text-[#32432A] font-semibold">10 years</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#6B8A5B] font-serif italic mt-4 text-center">
              Today you write it. Tomorrow you discover it.
            </p>
          </div>
        </div>
      </section>

      {/* Three Step Explanation */}
      <section id="how-it-works-section" className="py-20 bg-[#E6EEE0]/40 border-y border-[#D5DFCE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#32432A] font-medium block mb-2">
              The Journey of a Letter
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A1A] font-normal">
              How Later works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Step 01 */}
            <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-8 relative flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-2xl font-light text-[#32432A]">01</span>
                  <div className="w-10 h-10 rounded-full bg-[#E6EEE0] flex items-center justify-center text-[#32432A] overflow-hidden">
                    <QuillPen size="sm" isWriting={false} />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1F2A1A] mb-3">
                  Write
                </h3>
                <p className="text-sm text-[#425838] leading-relaxed">
                  Tell your future self something worth remembering. An unfiltered reflection, a burning question, or a secret hope you hold close today.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D5DFCE]/60 text-xs font-serif italic text-[#557048]">
                Customizable stationery & thoughtful prompts
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-8 relative flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-2xl font-light text-[#32432A]">02</span>
                  <div className="w-10 h-10 rounded-full bg-[#E6EEE0] flex items-center justify-center text-[#32432A]">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1F2A1A] mb-3">
                  Seal
                </h3>
                <p className="text-sm text-[#425838] leading-relaxed">
                  Choose when the capsule should unlock: tomorrow, in one year, on your birthday, or a decade from now. Once sealed, it stays locked.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D5DFCE]/60 text-xs font-serif italic text-[#557048]">
                Safely protected until the appointed hour
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-8 relative flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-2xl font-light text-[#32432A]">03</span>
                  <div className="w-10 h-10 rounded-full bg-[#E6EEE0] flex items-center justify-center text-[#32432A]">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1F2A1A] mb-3">
                  Return
                </h3>
                <p className="text-sm text-[#425838] leading-relaxed">
                  We'll bring it back when the time arrives. Read the words of who you were, experience the nostalgia, and write a reply back across the years.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#D5DFCE]/60 text-xs font-serif italic text-[#557048]">
                An intimate dialogue between selves
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Showcase Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-8 sm:p-12 text-center shadow-xs">
          <span className="text-xs font-mono uppercase tracking-widest text-[#557048] font-medium block mb-3">
            An example from our community
          </span>

          <div className="max-w-xl mx-auto my-6">
            <blockquote className="font-serif text-2xl sm:text-3xl text-[#1F2A1A] italic leading-snug">
              “To the woman I hope I've become.”
            </blockquote>
            <p className="mt-4 text-sm text-[#6B8A5B] font-mono">
              Sealed September 4, 2026 · Opens September 4, 2036
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="showcase-start-writing-btn"
              onClick={handleStartWriting}
              className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#273521] transition-colors shadow-xs"
            >
              <span>Write your first capsule</span>
              <ArrowRight className="w-4 h-4 text-[#B7CCA9]" />
            </button>
            {!isLoggedIn && (
              <button
                id="showcase-login-btn"
                onClick={onOpenAuth}
                className="text-sm text-[#425838] hover:text-[#1F2A1A] px-4 py-2 underline underline-offset-4"
              >
                Already have an account? Log in
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
