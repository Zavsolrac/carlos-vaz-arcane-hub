import { ProjectItem, BioLink, SkillRune, PngCardConfig } from '../types';

export const CANONICAL_PORTFOLIO_URL = 'https://portifoleo-carlos-vaz.vercel.app/';
export const GITHUB_URL = 'https://github.com/Zavsolrac';

export const DEFAULT_PROFILE = {
  name: 'CARLOS VAZ',
  title: 'THE ARCANE ARCHITECT',
  role: 'DESENVOLVEDOR WEB • IA • STORYTELLING DIGITAL',
  tagline: 'Transformo ideias em experiências digitais com identidade.',
  portfolioUrl: CANONICAL_PORTFOLIO_URL,
  github: GITHUB_URL,
};

export const DEFAULT_BIO_LINKS: BioLink[] = [
  {
    id: 'link-portfolio',
    title: 'Portfólio Canónico Oficial',
    subtitle: 'Acesse o portfólio completo com ofício, narrativa e contacto',
    url: CANONICAL_PORTFOLIO_URL,
    iconName: 'Sparkles',
    category: 'primary',
    highlight: true,
    customBadge: 'Principal',
  },
  {
    id: 'link-github',
    title: 'GitHub',
    subtitle: '@Zavsolrac — repositórios públicos',
    url: GITHUB_URL,
    iconName: 'Github',
    category: 'social',
  },
  {
    id: 'link-generator',
    title: 'Gerador PNG & HTML',
    subtitle: 'Cartões 9:16 e 1:1, QR real e wrappers clicáveis',
    url: '#gerador-png',
    iconName: 'Compass',
    category: 'service',
  },
];

export const DEFAULT_PROJECTS: ProjectItem[] = [];

export const DEFAULT_SKILLS: SkillRune[] = [
  {
    name: 'Storytelling Digital',
    category: 'Storytelling & Design',
    level: 0,
    iconName: 'Feather',
    description:
      'Transformo páginas em jornadas: cada seção avança um capítulo e cada interação revela o próximo trecho da história.',
    lore: 'Do portfólio canónico.',
  },
  {
    name: 'Direção Artística',
    category: 'Storytelling & Design',
    level: 0,
    iconName: 'Layout',
    description:
      'Paleta, tipografia e luz orquestradas em uma só voz, para que a marca tenha identidade reconhecível à primeira vista.',
    lore: 'Do portfólio canónico.',
  },
  {
    name: 'Experiência do Usuário',
    category: 'Web Architecture',
    level: 0,
    iconName: 'Layout',
    description: 'Hierarquia clara e gestos previsíveis: o visitante encontra o que procura antes mesmo de perguntar.',
    lore: 'Do portfólio canónico.',
  },
  {
    name: 'Desenvolvimento Front-End',
    category: 'Web Architecture',
    level: 0,
    iconName: 'Server',
    description:
      'Interfaces responsivas e acessíveis em HTML, CSS e JavaScript — com código limpo e atenção à performance.',
    lore: 'Do portfólio canónico.',
  },
  {
    name: 'Integração com IA',
    category: 'Inteligência Artificial',
    level: 0,
    iconName: 'Brain',
    description: 'Assistentes, automações e fluxos inteligentes que dão vida ao produto sem perder o toque humano.',
    lore: 'Do portfólio canónico.',
  },
];

export const INITIAL_PNG_CONFIG: PngCardConfig = {
  name: 'CARLOS VAZ',
  title: 'THE ARCANE ARCHITECT',
  tagline: 'DESENVOLVEDOR WEB • IA • STORYTELLING DIGITAL',
  description: 'Transformo ideias em experiências digitais com identidade.',
  ctaText: 'ACESSAR PORTFÓLIO OFICIAL',
  targetUrl: CANONICAL_PORTFOLIO_URL,
  themeStyle: 'dark-arcane',
  showQrCode: true,
  badgeText: 'PORTFÓLIO OFICIAL',
  aspectRatio: 'story',
};
