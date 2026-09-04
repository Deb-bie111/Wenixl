import { CapsuleType } from '../types';

export const WRITING_PROMPTS = [
  "What are you struggling with right now?",
  "What are you excited about?",
  "What do you hope has changed?",
  "What do you never want to forget?",
  "Who matters most to you right now?",
  "What are you afraid of?",
  "What are you proud of?",
  "What do you hope future-you understands?",
  "Describe your life right now.",
  "What would you tell yourself if you knew everything would work out?",
];

export interface CapsuleTypeMeta {
  type: CapsuleType;
  label: string;
  icon: string;
  description: string;
  placeholder: string;
}

export const CAPSULE_TYPES: CapsuleTypeMeta[] = [
  {
    type: 'letter',
    label: 'Letter',
    icon: '💌',
    description: 'An open, honest conversation with the person you will become.',
    placeholder: 'Dear Future Me,\n\nI am writing this from a quiet afternoon. Here is where my mind is today...',
  },
  {
    type: 'memory',
    label: 'Memory',
    icon: '📸',
    description: 'A snapshot of this exact fleeting season of your life.',
    placeholder: 'I want to preserve this moment before time rounds the corners: the smell in the air, the song on repeat, the little details...',
  },
  {
    type: 'promise',
    label: 'Promise',
    icon: '🎯',
    description: 'A commitment you want to keep to yourself, no matter what.',
    placeholder: 'I promise you that I will not abandon what matters most. Remember why we began this...',
  },
  {
    type: 'question',
    label: 'Question',
    icon: '❓',
    description: 'Curiosities and doubts you hope time and wisdom have answered.',
    placeholder: 'Did you ever figure out the answer to the question that keeps me awake tonight? Are you happy with what we chose?',
  },
  {
    type: 'reflection',
    label: 'Reflection',
    icon: '🪞',
    description: 'A thoughtful contemplation of who you are at this crossroad.',
    placeholder: 'Looking in the mirror today, this is who I see, what I carry, and what I am slowly learning to let go of...',
  },
];
