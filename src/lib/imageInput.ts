import { sanitizeImageSrc, isAllowedImageDataUrl } from './urls';

export const ALLOWED_IMAGE_MIME = ['image/png', 'image/jpeg', 'image/webp'] as const;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_EDGE = 8192;

export type ImageFileMeta = {
  type: string;
  size: number;
};

export function isAllowedImageMime(type: string): boolean {
  return (ALLOWED_IMAGE_MIME as readonly string[]).includes(type);
}

export function validateImageFileMeta(file: ImageFileMeta): string | null {
  if (!isAllowedImageMime(file.type)) {
    return 'Formato não suportado. Use PNG, JPEG ou WebP.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'A imagem excede 10 MiB.';
  }
  return null;
}

export function extractImageSrcFromMarkup(input: string, parseHtml?: (html: string) => string | null): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  ) {
    return sanitizeImageSrc(trimmed);
  }

  if (parseHtml) {
    const fromDom = parseHtml(trimmed);
    if (fromDom) return sanitizeImageSrc(fromDom);
  }

  const match = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  return match ? sanitizeImageSrc(match[1]) : null;
}

export function extractImageSrcInBrowser(input: string): string | null {
  return extractImageSrcFromMarkup(input, (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.querySelector('img')?.getAttribute('src') ?? null;
  });
}

export function readPngIhderSize(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 24) return null;
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[i] !== signature[i]) return null;
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

export function assertImageDimensions(width: number, height: number): string | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    return 'Dimensões de imagem inválidas.';
  }
  if (width > MAX_IMAGE_EDGE || height > MAX_IMAGE_EDGE) {
    return `A imagem excede ${MAX_IMAGE_EDGE}×${MAX_IMAGE_EDGE} pixels.`;
  }
  return null;
}

export function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Falha ao ler o ficheiro.'));
    };
    reader.onerror = () => reject(new Error('Falha ao ler o ficheiro.'));
    reader.readAsDataURL(file);
  });
}

export function measureImageElement(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error('Não foi possível ler as dimensões da imagem.'));
    image.src = dataUrl;
  });
}

export async function acceptLocalImageFile(file: File): Promise<{ ok: true; dataUrl: string } | { ok: false; error: string }> {
  const metaError = validateImageFileMeta(file);
  if (metaError) return { ok: false, error: metaError };

  let dataUrl: string;
  try {
    dataUrl = await readFileAsDataUrl(file);
  } catch {
    return { ok: false, error: 'Falha ao ler o ficheiro.' };
  }

  if (!isAllowedImageDataUrl(dataUrl)) {
    return { ok: false, error: 'Formato não suportado. Use PNG, JPEG ou WebP.' };
  }

  try {
    const size = await measureImageElement(dataUrl);
    const dimensionError = assertImageDimensions(size.width, size.height);
    if (dimensionError) return { ok: false, error: dimensionError };
  } catch {
    return { ok: false, error: 'Não foi possível validar as dimensões da imagem.' };
  }

  return { ok: true, dataUrl };
}
