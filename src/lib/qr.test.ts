import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { generateQrDataUrl } from './qr';

const PORTFOLIO_URL = 'https://portifoleo-carlos-vaz.vercel.app/';

function decodeQr(dataUrl: string): string | null {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  const png = PNG.sync.read(Buffer.from(base64, 'base64'));
  const result = jsQR(new Uint8ClampedArray(png.data.buffer), png.width, png.height);
  return result?.data ?? null;
}

describe('QR payload', () => {
  it('encodes the canonical portfolio URL', async () => {
    const dataUrl = await generateQrDataUrl(PORTFOLIO_URL);
    expect(decodeQr(dataUrl)).toBe(PORTFOLIO_URL);
  });

  it('rejects non-http targets', async () => {
    await expect(generateQrDataUrl('javascript:alert(1)')).rejects.toThrow(/http/);
  });
});
