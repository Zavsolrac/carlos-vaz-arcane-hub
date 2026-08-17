import { describe, expect, it } from 'vitest';
import { containsUnsupportedColorFunction } from './exportColorGuard';

describe('exportColorGuard', () => {
  it('detects oklab gradients', () => {
    expect(
      containsUnsupportedColorFunction(
        'radial-gradient(oklab(0.829942 0.0141595 0.103177 / 0.15) 0%, transparent 100%)',
      ),
    ).toBe(true);
  });

  it('allows rgba and hex gradients', () => {
    expect(
      containsUnsupportedColorFunction(
        'radial-gradient(circle at 50% 50%, rgba(233, 193, 118, 0.15) 0%, transparent 100%)',
      ),
    ).toBe(false);
    expect(containsUnsupportedColorFunction('linear-gradient(90deg, rgba(0,242,255,0.18), rgba(0,242,255,0.28))')).toBe(
      false,
    );
  });
});
