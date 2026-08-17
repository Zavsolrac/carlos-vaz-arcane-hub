import { describe, expect, it } from 'vitest';
import { isGeneratorHash, pathWithView, viewFromHash } from './viewHash';

describe('generator hash routing', () => {
  it('opens generator from #gerador-png', () => {
    expect(viewFromHash('#gerador-png')).toBe('generator');
    expect(isGeneratorHash('#gerador-png')).toBe(true);
  });

  it('defaults to portfolio for other hashes', () => {
    expect(viewFromHash('#projetos')).toBe('portfolio');
    expect(viewFromHash('')).toBe('portfolio');
  });

  it('builds hash-aware paths', () => {
    expect(pathWithView('/carlos-vaz-arcane-hub/', '', 'generator')).toBe('/carlos-vaz-arcane-hub/#gerador-png');
    expect(pathWithView('/carlos-vaz-arcane-hub/', '', 'portfolio')).toBe('/carlos-vaz-arcane-hub/');
  });
});
