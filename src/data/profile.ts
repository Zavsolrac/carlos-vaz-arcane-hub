export const PROFILE = {
  name: 'Carlos Vaz',
  nameDisplay: 'CARLOS VAZ',
  brand: 'The Arcane Architect',
  brandDisplay: 'THE ARCANE ARCHITECT',
  role: 'Desenvolvedor Web · IA · Storytelling Digital',
  tagline: 'Transformo ideias em experiências digitais com identidade.',
  portfolioUrl: 'https://portifoleo-carlos-vaz.vercel.app/',
  githubUrl: 'https://github.com/Zavsolrac',
  githubHandle: 'Zavsolrac',
} as const;

export type PortalIcon = 'Sparkles' | 'Github' | 'Image';

export interface PortalLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconName: PortalIcon;
  highlight?: boolean;
  badge?: string;
  internalView?: 'hub' | 'generator';
}

export const PORTALS: PortalLink[] = [
  {
    id: 'portfolio',
    title: 'Portfólio completo',
    subtitle: 'Narrativa, ofício e contacto no site canónico',
    url: PROFILE.portfolioUrl,
    iconName: 'Sparkles',
    highlight: true,
    badge: 'Canónico',
  },
  {
    id: 'github',
    title: 'GitHub',
    subtitle: `@${PROFILE.githubHandle} — repositórios públicos`,
    url: PROFILE.githubUrl,
    iconName: 'Github',
  },
  {
    id: 'generator',
    title: 'Gerador PNG & HTML',
    subtitle: 'Imagem estática 9:16 / 1:1 + wrapper clicável',
    url: '#gerador',
    iconName: 'Image',
    internalView: 'generator',
  },
];

export interface Pillar {
  name: string;
  summary: string;
}

export const PILLARS: Pillar[] = [
  {
    name: 'Storytelling Digital',
    summary:
      'Transformo páginas em jornadas: cada seção avança um capítulo e cada interação revela o próximo trecho da história.',
  },
  {
    name: 'Direção Artística',
    summary:
      'Paleta, tipografia e luz orquestradas em uma só voz, para que a marca tenha identidade reconhecível à primeira vista.',
  },
  {
    name: 'Experiência do Usuário',
    summary: 'Hierarquia clara e gestos previsíveis: o visitante encontra o que procura antes mesmo de perguntar.',
  },
  {
    name: 'Desenvolvimento Front-End',
    summary:
      'Interfaces responsivas e acessíveis em HTML, CSS e JavaScript — com código limpo e atenção à performance.',
  },
  {
    name: 'Integração com IA',
    summary: 'Assistentes, automações e fluxos inteligentes que dão vida ao produto sem perder o toque humano.',
  },
];

export interface CardConfig {
  name: string;
  title: string;
  tagline: string;
  description: string;
  ctaText: string;
  targetUrl: string;
  showQrCode: boolean;
  badgeText: string;
  aspectRatio: 'story' | 'square';
  bgImageUrl?: string;
}

export const INITIAL_CARD_CONFIG: CardConfig = {
  name: PROFILE.nameDisplay,
  title: PROFILE.brandDisplay,
  tagline: PROFILE.role.toUpperCase(),
  description: PROFILE.tagline,
  ctaText: 'ACESSAR PORTFÓLIO',
  targetUrl: PROFILE.portfolioUrl,
  showQrCode: true,
  badgeText: 'HUB OFICIAL',
  aspectRatio: 'story',
};
