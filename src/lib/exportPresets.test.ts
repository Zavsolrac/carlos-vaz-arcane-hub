import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { assertExportSize, EXPORT_PRESETS } from './exportPresets';
import { readPngSize } from './png';

function pngDataUrl(width: number, height: number): string {
  const png = new PNG({ width, height });
  return `data:image/png;base64,${PNG.sync.write(png).toString('base64')}`;
}

describe('export presets', () => {
  it('defines exact 9:16 and 1:1 sizes', () => {
    expect(EXPORT_PRESETS.story).toMatchObject({ width: 1080, height: 1920 });
    expect(EXPORT_PRESETS.square).toMatchObject({ width: 1080, height: 1080 });
  });

  it('rejects distorted sizes', () => {
    expect(() => assertExportSize(360, 580, 'story')).toThrow(/mismatch/);
    expect(() => assertExportSize(1080, 1920, 'story')).not.toThrow();
    expect(() => assertExportSize(1080, 1080, 'square')).not.toThrow();
  });
});

describe('PNG reader', () => {
  it('reads 1080×1920 and 1080×1080', () => {
    expect(readPngSize(pngDataUrl(1080, 1920))).toEqual({ width: 1080, height: 1920 });
    expect(readPngSize(pngDataUrl(1080, 1080))).toEqual({ width: 1080, height: 1080 });
  });
});
