import { GENERATOR_HASH } from './site';

export type HubView = 'portfolio' | 'generator';

export function viewFromHash(hash: string): HubView {
  const normalized = hash.trim().toLowerCase();
  if (normalized === GENERATOR_HASH || normalized === '#generator') return 'generator';
  return 'portfolio';
}

export function pathWithView(pathname: string, search: string, view: HubView): string {
  const path = `${pathname}${search}`;
  return view === 'generator' ? `${path}${GENERATOR_HASH}` : path;
}

export function isGeneratorHash(hash: string): boolean {
  return viewFromHash(hash) === 'generator';
}
