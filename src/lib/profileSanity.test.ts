import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CANONICAL_PORTFOLIO_URL, DEFAULT_PROJECTS, DEFAULT_PROFILE } from '../data/defaultData';

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
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === 'docs') return [];
      return walk(full);
    }
    if (/\.test\.(ts|tsx)$/i.test(entry)) return [];
    if (/\.(ts|tsx|css|html|json|md)$/i.test(entry)) return [full];
    return [];
  });
}

describe('verified identity', () => {
  it('uses the canonical portfolio and verified GitHub', () => {
    expect(CANONICAL_PORTFOLIO_URL).toBe('https://portifoleo-carlos-vaz.vercel.app/');
    expect(DEFAULT_PROFILE.portfolioUrl).toBe(CANONICAL_PORTFOLIO_URL);
    expect(DEFAULT_PROFILE.github).toBe('https://github.com/Zavsolrac');
    expect(DEFAULT_PROJECTS).toEqual([]);
  });

  it('contains no fictional public data in product source', () => {
    const files = [...walk(join(process.cwd(), 'src')), join(process.cwd(), 'README.md'), join(process.cwd(), 'index.html')];
    const hits: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const needle of FORBIDDEN) {
        if (text.includes(needle)) hits.push(`${file}: ${needle}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
