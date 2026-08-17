import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INITIAL_CARD_CONFIG, PORTALS, PROFILE } from '../data/profile';

const FORBIDDEN = [
  'carlosvaz.dev',
  '5511999999999',
  'contato.carlosvaz@arcane.dev',
  'oracle.arcane',
  'chronos.arcane',
  'grimoire.arcane',
  'sigilforge.arcane',
  'nexus.arcane',
  'aetheria-oracle',
  'chronos-sanctum',
  'Aetheria Oracle',
  'Chronos Sanctum',
  'Grimoire Narrative',
  'Sigil Forge',
  'Nexus Core',
  '+55 11 99999-9999',
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === 'docs') return [];
      return walk(full);
    }
    if (/\.test\.(ts|tsx)$/i.test(entry)) return [];
    if (/\.(ts|tsx|css|html|json|md)$/i.test(entry)) return [full];
    return [];
  });
}

describe('verified professional identity', () => {
  it('uses the canonical portfolio URL', () => {
    expect(PROFILE.portfolioUrl).toBe('https://portifoleo-carlos-vaz.vercel.app/');
    expect(INITIAL_CARD_CONFIG.targetUrl).toBe(PROFILE.portfolioUrl);
    expect(PORTALS.some((portal) => portal.url === PROFILE.portfolioUrl)).toBe(true);
  });

  it('exposes only verified social destinations', () => {
    expect(PROFILE.githubUrl).toBe('https://github.com/Zavsolrac');
    expect(PORTALS.every((portal) => portal.url.startsWith('https://') || portal.url.startsWith('#'))).toBe(true);
  });

  it('contains no fictional public contact or project data in source', () => {
    const root = join(process.cwd(), 'src');
    const files = [...walk(root), join(process.cwd(), 'README.md'), join(process.cwd(), 'index.html')];
    const hits: string[] = [];

    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const needle of FORBIDDEN) {
        if (text.includes(needle)) {
          hits.push(`${file}: ${needle}`);
        }
      }
    }

    expect(hits).toEqual([]);
  });
});
