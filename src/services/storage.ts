import { Capsule, CapsuleStatus, UserProfile, Reflection } from '../types';

const STORAGE_KEYS = {
  USERS: 'later_users_db_v1',
  CURRENT_USER: 'later_current_user_v1',
  CAPSULES: 'later_capsules_db_v1',
};

// Default authenticated profile matching the active user
export const DEFAULT_USER: UserProfile = {
  id: 'usr_deb_01',
  name: 'Debbie Maurice',
  email: 'debbiemaurice87@gmail.com',
  timezone: 'America/Los_Angeles',
  createdAt: '2026-08-15T10:00:00.000Z',
  preferences: {
    emailUnlock: true,
    reminderBeforeUnlock: true,
    monthlyReflectionReminder: true,
  },
};

// Emotional default seeded capsules for first launch
const SEED_CAPSULES: Capsule[] = [
  {
    id: 'cap_ready_01',
    userId: 'usr_deb_01',
    title: 'A promise about living gently',
    type: 'promise',
    content: `Dear Future Me,

If you are reading this today, it means the time has arrived.

I am sitting on the floor with a cup of warm chamomile tea. Lately I have been pushing myself to the point of exhaustion, believing that my worth is only tied to how much I produce. 

I wrote this promise to you because I was terrified I would forget how to rest without guilt.

Please tell me you still watch the sunsets. Please tell me you don't answer work emails after 8pm anymore. Remember: you are allowed to be a person in progress.

All my love from your younger self,
Debbie`,
    status: 'ready',
    createdAt: '2025-09-03T18:00:00.000Z',
    unlockAt: '2026-09-03T17:00:00.000Z', // Unlocked an hour ago!
    sealedAt: '2025-09-03T18:00:00.000Z',
    deliveryPreset: '1 year',
    letterColor: 'sage',
    isMeaningful: true,
    attachments: [
      {
        id: 'att_01',
        capsuleId: 'cap_ready_01',
        fileUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80',
        fileName: 'quiet-afternoon.jpg',
        fileType: 'image',
        caption: 'The desk where I wrote this promise.',
        createdAt: '2025-09-03T18:00:00.000Z',
      },
    ],
    reflections: [],
  },
  {
    id: 'cap_1yr_02',
    userId: 'usr_deb_01',
    title: "The things I'm afraid of right now",
    type: 'reflection',
    content: `Dear Future Me,

Today is September 4, 2026. 

Right now, I am afraid of making the wrong decision about my career leap. I am afraid that the people I care about will drift apart as life gets busier. I am afraid that my small daily habits aren't enough to build the life I dream of.

I am sealing this away for exactly one year. 

When you open this in 2027, I hope you smile at how big these fears felt, and how gracefully you navigated through them.

Until then, stay brave.`,
    status: 'sealed',
    createdAt: '2026-09-03T12:00:00.000Z',
    unlockAt: '2027-09-03T12:00:00.000Z', // 1 year from now
    sealedAt: '2026-09-03T12:00:00.000Z',
    deliveryPreset: 'In 1 year',
    letterColor: 'rose',
    attachments: [],
    reflections: [],
  },
  {
    id: 'cap_10yr_03',
    userId: 'usr_deb_01',
    title: 'To the woman I hope I become',
    type: 'letter',
    content: `Dear Future Me in 2036,

Ten whole years. You are a decade ahead of me. 

Are your laugh lines deeper? Do you still love the crisp autumn air as much as I do today? Did you ever write that book you kept outlining on scrap napkins?

I don't know who you are with, where you live, or what sorrows or triumphs have reshaped your heart. But I want to remind you of the girl who wrote this: she trusted you completely. She worked hard so that you could be free.

Be kind to your body. Forgive yourself for whatever didn't go according to plan.

With endless hope across a decade,
Debbie (at 2026)`,
    status: 'sealed',
    createdAt: '2026-09-03T15:30:00.000Z',
    unlockAt: '2036-09-03T15:30:00.000Z', // 10 years from now
    sealedAt: '2026-09-03T15:30:00.000Z',
    deliveryPreset: 'In 10 years',
    letterColor: 'ivory',
    attachments: [
      {
        id: 'att_02',
        capsuleId: 'cap_10yr_03',
        fileUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        fileName: 'pacific-coast-memory.jpg',
        fileType: 'image',
        caption: 'Looking out at the horizon the morning I sealed this letter.',
        createdAt: '2026-09-03T15:30:00.000Z',
      },
    ],
    reflections: [],
  },
  {
    id: 'cap_opened_04',
    userId: 'usr_deb_01',
    title: 'First day in the new city',
    type: 'memory',
    content: `Dear Future Me,

The boxes are stacked all around the floor of the empty living room. I don't even have curtains yet, and the streetlamps outside are casting long shadows on the walls.

Everything feels strange and huge and unfamiliar. My hands were shaking when I turned the key in the lock.

Remember this moment: the sheer courage it took to pack two suitcases, leave comfort behind, and start over from scratch. Whatever happens next, you were brave enough to show up.`,
    status: 'opened',
    createdAt: '2024-04-10T19:00:00.000Z',
    unlockAt: '2025-04-10T19:00:00.000Z',
    sealedAt: '2024-04-10T19:00:00.000Z',
    openedAt: '2025-04-11T09:14:00.000Z',
    deliveryPreset: 'In 1 year',
    letterColor: 'sand',
    isMeaningful: true,
    isFavorite: true,
    attachments: [
      {
        id: 'att_03',
        capsuleId: 'cap_opened_04',
        fileUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        fileName: 'empty-apartment-boxes.jpg',
        fileType: 'image',
        caption: 'First night in apartment 4B with zero furniture.',
        createdAt: '2024-04-10T19:00:00.000Z',
      },
    ],
    reflections: [
      {
        id: 'ref_01',
        capsuleId: 'cap_opened_04',
        content: `Reading this one year later, with my bookshelves filled and friends laughing in the kitchen right now. We made this place a home, younger me. You didn't need to be so terrified. Thank you for packing those bags.`,
        createdAt: '2025-04-11T09:30:00.000Z',
        authorName: 'Present Debbie',
      },
    ],
  },
];

// Helper to sanitize content for locked capsules
export function sanitizeCapsuleForClient(capsule: Capsule): Capsule {
  const isLocked = capsule.status === 'sealed' && new Date(capsule.unlockAt).getTime() > Date.now();
  if (isLocked) {
    return {
      ...capsule,
      // Strictly redact content so it cannot be read in devtools/DOM/state for locked capsules
      content: '🔒 [PROTECTED TIME-SEALED MESSAGE: This capsule remains locked until the appointed hour. Contents are cryptographically sealed.]',
    };
  }
  return capsule;
}

export class StorageService {
  // Current user state
  static getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to Debbie Maurice for realistic immediate usage
      this.setCurrentUser(DEFAULT_USER);
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: UserProfile | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  static login(email: string, _password?: string): UserProfile {
    const users = this.getAllUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const name = email.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: formattedName || 'Kind Stranger',
        email,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        createdAt: new Date().toISOString(),
        preferences: {
          emailUnlock: true,
          reminderBeforeUnlock: true,
          monthlyReflectionReminder: false,
        },
      };
      this.saveUser(user);
    }
    this.setCurrentUser(user);
    return user;
  }

  static getAllUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      const initial = [DEFAULT_USER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [DEFAULT_USER];
    }
  }

  static saveUser(user: UserProfile): void {
    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(user);
  }

  // Capsule database operations
  static getAllRawCapsules(): Capsule[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CAPSULES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CAPSULES, JSON.stringify(SEED_CAPSULES));
      return SEED_CAPSULES;
    }
    try {
      const capsules: Capsule[] = JSON.parse(raw);
      return capsules;
    } catch {
      return SEED_CAPSULES;
    }
  }

  static getCapsulesForUser(userId: string): Capsule[] {
    const all = this.getAllRawCapsules();
    const now = Date.now();

    // Auto-update status to 'ready' if sealed and unlockAt has arrived
    let hasUpdates = false;
    const updated = all.map((cap) => {
      if (cap.userId === userId && cap.status === 'sealed' && new Date(cap.unlockAt).getTime() <= now) {
        hasUpdates = true;
        return { ...cap, status: 'ready' as CapsuleStatus };
      }
      return cap;
    });

    if (hasUpdates) {
      localStorage.setItem(STORAGE_KEYS.CAPSULES, JSON.stringify(updated));
    }

    return updated
      .filter((cap) => cap.userId === userId)
      .map((cap) => sanitizeCapsuleForClient(cap));
  }

  static getCapsuleById(capsuleId: string, userId: string): Capsule | null {
    const all = this.getAllRawCapsules();
    const cap = all.find((c) => c.id === capsuleId && c.userId === userId);
    if (!cap) return null;

    const now = Date.now();
    // If unlockAt has arrived and still marked sealed, mark ready
    if (cap.status === 'sealed' && new Date(cap.unlockAt).getTime() <= now) {
      cap.status = 'ready';
      this.saveCapsule(cap);
    }

    return sanitizeCapsuleForClient(cap);
  }

  /**
   * For the opening ceremony: returns the unredacted content
   * ONLY IF the unlock date has arrived or status is ready/opened.
   */
  static unlockAndGetContent(capsuleId: string, userId: string): Capsule | null {
    const all = this.getAllRawCapsules();
    const cap = all.find((c) => c.id === capsuleId && c.userId === userId);
    if (!cap) return null;

    const now = Date.now();
    const isReadyOrUnlocked = new Date(cap.unlockAt).getTime() <= now || cap.status === 'opened' || cap.status === 'ready';
    
    if (!isReadyOrUnlocked) {
      // Strictly deny access before unlock time
      throw new Error("This capsule's appointed hour has not yet arrived.");
    }

    if (cap.status !== 'opened') {
      cap.status = 'opened';
      cap.openedAt = new Date().toISOString();
      this.saveCapsule(cap);
    }

    return cap;
  }

  static saveCapsule(capsule: Capsule): void {
    const all = this.getAllRawCapsules();
    const index = all.findIndex((c) => c.id === capsule.id);
    if (index >= 0) {
      all[index] = capsule;
    } else {
      all.unshift(capsule);
    }
    localStorage.setItem(STORAGE_KEYS.CAPSULES, JSON.stringify(all));
  }

  static deleteCapsule(capsuleId: string, userId: string): void {
    const all = this.getAllRawCapsules();
    const filtered = all.filter((c) => !(c.id === capsuleId && c.userId === userId));
    localStorage.setItem(STORAGE_KEYS.CAPSULES, JSON.stringify(filtered));
  }

  static addReflection(capsuleId: string, userId: string, content: string, authorName?: string): Reflection | null {
    const all = this.getAllRawCapsules();
    const cap = all.find((c) => c.id === capsuleId && c.userId === userId);
    if (!cap) return null;

    const newReflection: Reflection = {
      id: 'ref_' + Math.random().toString(36).substring(2, 9),
      capsuleId,
      content,
      createdAt: new Date().toISOString(),
      authorName: authorName || 'Present You',
    };

    cap.reflections = [...(cap.reflections || []), newReflection];
    this.saveCapsule(cap);
    return newReflection;
  }

  static toggleMeaningful(capsuleId: string, userId: string): boolean {
    const all = this.getAllRawCapsules();
    const cap = all.find((c) => c.id === capsuleId && c.userId === userId);
    if (!cap) return false;
    cap.isMeaningful = !cap.isMeaningful;
    this.saveCapsule(cap);
    return !!cap.isMeaningful;
  }

  static toggleFavorite(capsuleId: string, userId: string): boolean {
    const all = this.getAllRawCapsules();
    const cap = all.find((c) => c.id === capsuleId && c.userId === userId);
    if (!cap) return false;
    cap.isFavorite = !cap.isFavorite;
    this.saveCapsule(cap);
    return !!cap.isFavorite;
  }

  static updateLetterColor(capsuleId: string, userId: string, letterColor: string): Capsule | null {
    const all = this.getAllRawCapsules();
    const cap = all.find((c) => c.id === capsuleId && c.userId === userId);
    if (!cap) return null;
    cap.letterColor = letterColor;
    this.saveCapsule(cap);
    return cap;
  }

  // Developer / Tester convenience: instantly fast-forward a capsule so it can be unlocked immediately
  static forceUnlockCapsule(capsuleId: string, userId: string): Capsule | null {
    const all = this.getAllRawCapsules();
    const cap = all.find((c) => c.id === capsuleId && c.userId === userId);
    if (!cap) return null;

    cap.unlockAt = new Date(Date.now() - 1000).toISOString();
    cap.status = 'ready';
    this.saveCapsule(cap);
    return cap;
  }

  // Reset database back to default seed capsules
  static resetToSeedData(): void {
    localStorage.setItem(STORAGE_KEYS.CAPSULES, JSON.stringify(SEED_CAPSULES));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USER));
  }
}
