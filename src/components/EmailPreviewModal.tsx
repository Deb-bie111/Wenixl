import React from 'react';
import { X, Mail, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCapsule?: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  onOpenCapsule,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          id="email-preview-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#6B8A5B] hover:text-[#1F2A1A] p-1.5 rounded-full hover:bg-[#E6EEE0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#32432A] text-white flex items-center justify-center shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#1F2A1A]">Scheduled Notification</h3>
            <p className="text-xs text-[#557048]">
              Preview of the automated email dispatched when your capsule unlocks
            </p>
          </div>
        </div>

        {/* Security Highlight */}
        <div className="mb-6 p-3 rounded-xl bg-[#E6EEE0] border border-[#CCD8C4] flex items-center gap-2.5 text-xs text-[#32432A]">
          <ShieldCheck className="w-4 h-4 text-[#557048] shrink-0" />
          <span>
            <strong>Privacy Guarantee:</strong> Capsule contents are never exposed in email notifications. Only a discreet opening invitation is delivered.
          </span>
        </div>

        {/* Realistic Email Client Frame */}
        <div className="border border-[#D5DFCE] rounded-xl overflow-hidden shadow-xs bg-white text-left font-sans">
          {/* Email header bar */}
          <div className="bg-[#FAFBF8] border-b border-[#D5DFCE] p-4 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#557048]">
              <span><strong>From:</strong> Later. &lt;letters@later.app&gt;</span>
              <span className="font-mono">Today, 09:00 AM</span>
            </div>
            <div className="text-[#557048]">
              <span><strong>To:</strong> Debbie Maurice &lt;debbiemaurice87@gmail.com&gt;</span>
            </div>
            <div className="text-[#1F2A1A] font-semibold pt-1 text-sm font-serif">
              Subject: A message from your past is waiting.
            </div>
          </div>

          {/* Email Body matching exact prompt copy */}
          <div className="p-8 sm:p-10 bg-[#FAFBF8] text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-[#32432A] text-white flex items-center justify-center font-serif text-xl font-bold mx-auto shadow-xs">
              L
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1F2A1A] font-normal tracking-tight">
                A message from your past is waiting.
              </h2>
              <p className="text-base text-[#425838] font-serif italic leading-relaxed">
                You wrote something for yourself a while ago.
              </p>
              <p className="text-sm text-[#557048]">
                It’s ready to be opened.
              </p>
            </div>

            <div className="pt-2 pb-4">
              <button
                id="email-preview-open-capsule-btn"
                onClick={() => {
                  onClose();
                  if (onOpenCapsule) onOpenCapsule();
                }}
                className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#273521] transition-all shadow-xs"
              >
                <span>Open your capsule</span>
                <ArrowRight className="w-4 h-4 text-[#B7CCA9]" />
              </button>
            </div>

            <div className="border-t border-[#D5DFCE] pt-6 text-[11px] text-[#6B8A5B] font-serif italic">
              Sent with care by Later. — A digital time capsule for your future self.<br />
              Until then, your words stay safely sealed.
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-medium bg-[#1C1917] text-[#FAF8F5] hover:bg-[#2E2925] transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
