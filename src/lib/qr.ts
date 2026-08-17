import QRCode from 'qrcode';
import { sanitizeHttpUrl } from './urls';

export async function generateQrDataUrl(rawUrl: string): Promise<string> {
  const url = sanitizeHttpUrl(rawUrl);
  if (!url) throw new Error('QR target must be an http(s) URL');
  return QRCode.toDataURL(url, {
    width: 320,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#071018', light: '#f4fffe' },
  });
}
