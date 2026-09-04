export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export interface CountdownInfo {
  totalMs: number;
  isUnlocked: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  friendlyText: string;
}

export function getCountdown(unlockAt: string, nowMs = Date.now()): CountdownInfo {
  const targetMs = new Date(unlockAt).getTime();
  const diff = targetMs - nowMs;

  if (diff <= 0) {
    return {
      totalMs: 0,
      isUnlocked: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      friendlyText: 'Ready to open',
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  let friendlyText = '';
  if (days >= 365) {
    const years = (days / 365.25).toFixed(days > 730 ? 0 : 1);
    friendlyText = `${years} ${Number(years) === 1 ? 'year' : 'years'} remaining`;
  } else if (days > 30) {
    const months = Math.floor(days / 30);
    friendlyText = `${months} ${months === 1 ? 'month' : 'months'} remaining`;
  } else if (days > 1) {
    friendlyText = `${days} days remaining`;
  } else if (days === 1) {
    friendlyText = '1 day remaining';
  } else if (hours > 0) {
    friendlyText = `${hours}h ${minutes}m remaining`;
  } else if (minutes > 0) {
    friendlyText = `${minutes}m ${seconds}s remaining`;
  } else {
    friendlyText = `${seconds}s remaining`;
  }

  return {
    totalMs: diff,
    isUnlocked: false,
    days,
    hours,
    minutes,
    seconds,
    friendlyText,
  };
}

export function formatTimeAgo(dateString: string, baseDate = new Date()): string {
  try {
    const past = new Date(dateString).getTime();
    const now = baseDate.getTime();
    const diff = Math.max(0, now - past);

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years >= 1) {
      return `Written ${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
    if (days >= 30) {
      const months = Math.floor(days / 30);
      return `Written ${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    if (days >= 1) {
      return `Written ${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    if (hours >= 1) {
      return `Written ${hours}h ago`;
    }
    return 'Written today';
  } catch {
    return 'Written in the past';
  }
}
