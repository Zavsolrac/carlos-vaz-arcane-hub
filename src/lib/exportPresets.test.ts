import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { assertExportSize, EXPORT_PRESETS } from './exportPresets';
import { readPngSize } from './png';

function pngDataUrl(width: number, height: number): string {
  const png = new PNG({ width, height });
  const buffer = PNG.sync.write(png);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

describe('export presets', () => {
  it('defines exact 9:16 story size', () => {
    expect(EXPORT_PRESETS.story).toMatchObject({ width: 1080, height: 1920 });
    expect(EXPORT_PRESETS.story.width / EXPORT_PRESETS.story.height).toBeCloseTo(9 / 16, 10);
  });

  it('defines exact 1:1 square size', () => {
    expect(EXPORT_PRESETS.square).toMatchObject({ width: 1080, height: 1080 });
  });

  it('accepts matching sizes and rejects distorted sizes', () => {
    expect(() => assertExportSize(1080, 1920, 'story')).not.toThrow();
    expect(() => assertExportSize(1080, 1080, 'square')).not.toThrow();
    expect(() => assertExportSize(360, 580, 'story')).toThrow(/mismatch/);
    expect(() => assertExportSize(1080, 1920, 'square')).toThrow(/mismatch/);
  });
});

describe('PNG dimension reader', () => {
  it('reads 1080×1920 from a real PNG buffer', () => {
    expect(readPngSize(pngDataUrl(1080, 1920))).toEqual({ width: 1080, height: 1920 });
  });

  it('reads 1080×1080 from a real PNG buffer', () => {
    expect(readPngSize(pngDataUrl(1080, 1080))).toEqual({ width: 1080, height: 1080 });
  });
});
