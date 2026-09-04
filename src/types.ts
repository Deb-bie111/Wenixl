export type CapsuleType = 'letter' | 'memory' | 'promise' | 'question' | 'reflection';

export type CapsuleStatus = 'draft' | 'sealed' | 'ready' | 'opened';

export interface Attachment {
  id: string;
  capsuleId: string;
  fileUrl: string;
  fileName: string;
  fileType: 'image' | 'audio' | 'video' | 'document';
  caption?: string;
  createdAt: string;
}

export interface Reflection {
  id: string;
  capsuleId: string;
  content: string;
  createdAt: string;
  authorName?: string;
}

export interface Capsule {
  id: string;
  userId: string;
  title: string;
  type: CapsuleType;
  /**
   * For sealed capsules that are still locked, this content is protected
   * and withheld from client payload until unlocked.
   */
  content: string;
  status: CapsuleStatus;
  createdAt: string;
  unlockAt: string;
  openedAt?: string;
  sealedAt?: string;
  isMeaningful?: boolean;
  isFavorite?: boolean;
  letterColor?: string; // e.g. 'ivory' | 'sage' | 'rose' | 'sand' | 'lavender' | 'mist' | 'eucalyptus' | 'obsidian'
  attachments: Attachment[];
  reflections: Reflection[];
  deliveryPreset?: string;
  recipientEmail?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  timezone: string;
  createdAt: string;
  preferences: {
    emailUnlock: boolean;
    reminderBeforeUnlock: boolean;
    monthlyReflectionReminder: boolean;
  };
}

export type ViewState = 
  | { type: 'landing' }
  | { type: 'dashboard' }
  | { type: 'create'; draftId?: string }
  | { type: 'view-capsule'; capsuleId: string; autoOpen?: boolean };
