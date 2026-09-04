export interface StationeryOption {
  id: string;
  name: string;
  description: string;
  swatchHex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  mutedClass: string;
  accentClass: string;
  placeholderClass: string;
  badgeBg: string;
  badgeText: string;
  isDark: boolean;
}

export const STATIONERY_PALETTES: StationeryOption[] = [
  {
    id: 'sage',
    name: 'Sage Olive',
    description: 'Fresh botanical parchment with gentle leaf undertones',
    swatchHex: '#D8E2D1',
    bgClass: 'bg-[#F2F6EF]',
    borderClass: 'border-[#CFDDC6]',
    textClass: 'text-[#1E281A]',
    mutedClass: 'text-[#586A51]',
    accentClass: 'text-[#3E5234]',
    placeholderClass: 'placeholder-[#586A51]/60',
    badgeBg: 'bg-[#E3EDDD]',
    badgeText: 'text-[#2E3E24]',
    isDark: false,
  },
  {
    id: 'ivory',
    name: 'Antique Ivory',
    description: 'Classic warm cotton rag paper with timeless texture',
    swatchHex: '#F6EFE5',
    bgClass: 'bg-[#FCFAF6]',
    borderClass: 'border-[#EAE3D5]',
    textClass: 'text-[#231F1A]',
    mutedClass: 'text-[#6D6357]',
    accentClass: 'text-[#48593E]',
    placeholderClass: 'placeholder-[#6D6357]/60',
    badgeBg: 'bg-[#F3ECE0]',
    badgeText: 'text-[#3D3528]',
    isDark: false,
  },
  {
    id: 'rose',
    name: 'Dusty Rose',
    description: 'Poetic pressed petals with a delicate warm tint',
    swatchHex: '#EED9D5',
    bgClass: 'bg-[#FAF2F0]',
    borderClass: 'border-[#E8D4D0]',
    textClass: 'text-[#2B1B1B]',
    mutedClass: 'text-[#745555]',
    accentClass: 'text-[#7A3636]',
    placeholderClass: 'placeholder-[#745555]/60',
    badgeBg: 'bg-[#F3DFDB]',
    badgeText: 'text-[#552727]',
    isDark: false,
  },
  {
    id: 'sand',
    name: 'Warm Kraft',
    description: 'Sun-dried earthy sand with artisan fiber warmth',
    swatchHex: '#E5D6C1',
    bgClass: 'bg-[#F7EFE4]',
    borderClass: 'border-[#DECDB4]',
    textClass: 'text-[#282119]',
    mutedClass: 'text-[#6D5D48]',
    accentClass: 'text-[#5C452C]',
    placeholderClass: 'placeholder-[#6D5D48]/60',
    badgeBg: 'bg-[#EDE1CD]',
    badgeText: 'text-[#473620]',
    isDark: false,
  },
  {
    id: 'lavender',
    name: 'Dusk Lavender',
    description: 'Serene twilight haze for contemplative memories',
    swatchHex: '#DDD5E7',
    bgClass: 'bg-[#F5F2F9]',
    borderClass: 'border-[#DCD1EB]',
    textClass: 'text-[#221B2B]',
    mutedClass: 'text-[#635575]',
    accentClass: 'text-[#503E68]',
    placeholderClass: 'placeholder-[#635575]/60',
    badgeBg: 'bg-[#EBE2F5]',
    badgeText: 'text-[#3B2C4E]',
    isDark: false,
  },
  {
    id: 'mist',
    name: 'Morning Mist',
    description: 'Soft glacial river slate with quiet clarity',
    swatchHex: '#D1DEE3',
    bgClass: 'bg-[#F1F6F8]',
    borderClass: 'border-[#C8DCE3]',
    textClass: 'text-[#182329]',
    mutedClass: 'text-[#4D6570]',
    accentClass: 'text-[#34515E]',
    placeholderClass: 'placeholder-[#4D6570]/60',
    badgeBg: 'bg-[#E1EDF1]',
    badgeText: 'text-[#223945]',
    isDark: false,
  },
  {
    id: 'terracotta',
    name: 'Earthen Clay',
    description: 'Rich terracotta warmth reminiscent of baked Tuscan brick',
    swatchHex: '#EBCBBE',
    bgClass: 'bg-[#FAF1EC]',
    borderClass: 'border-[#E6CEC0]',
    textClass: 'text-[#2B1B15]',
    mutedClass: 'text-[#7A5445]',
    accentClass: 'text-[#7D3E24]',
    placeholderClass: 'placeholder-[#7A5445]/60',
    badgeBg: 'bg-[#F3DDD2]',
    badgeText: 'text-[#542817]',
    isDark: false,
  },
  {
    id: 'obsidian',
    name: 'Deep Forest Night',
    description: 'Velvet dark pine with moonlight cream script',
    swatchHex: '#253225',
    bgClass: 'bg-[#1C251C]',
    borderClass: 'border-[#2F402F]',
    textClass: 'text-[#F3F6F1]',
    mutedClass: 'text-[#9DB39A]',
    accentClass: 'text-[#C5D8C1]',
    placeholderClass: 'placeholder-white/40',
    badgeBg: 'bg-[#2A372A]',
    badgeText: 'text-[#E1ECE0]',
    isDark: true,
  },
];

export const DEFAULT_STATIONERY_ID = 'sage';

export function getStationeryOption(id?: string): StationeryOption {
  if (!id) return STATIONERY_PALETTES[0]; // sage is default
  const found = STATIONERY_PALETTES.find((p) => p.id === id);
  return found || STATIONERY_PALETTES[0];
}
