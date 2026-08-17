export type RarityLevel = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export type ProjectCategory = 'all' | 'web' | 'ai' | 'storytelling' | 'fullstack';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'web' | 'ai' | 'storytelling' | 'fullstack';
  rarity: RarityLevel;
  imageUrl: string;
  customImageData?: string;
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  featured?: boolean;
  stats?: {
    label: string;
    value: string;
  }[];
}

export interface BioLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconName: string;
  category: 'primary' | 'social' | 'contact' | 'service';
  highlight?: boolean;
  customBadge?: string;
}

export interface SkillRune {
  name: string;
  category: 'Web Architecture' | 'Inteligência Artificial' | 'Storytelling & Design' | 'DevOps & Cloud';
  level: number; // 0 to 100
  iconName: string;
  description: string;
  lore: string;
}

export interface PngCardConfig {
  name: string;
  title: string;
  tagline: string;
  description: string;
  ctaText: string;
  targetUrl: string;
  themeStyle: 'dark-arcane' | 'gold-relic' | 'cyan-cyber' | 'minimal-void';
  showQrCode: boolean;
  bgImageUrl?: string;
  badgeText?: string;
  aspectRatio: 'story' | 'square';
}
