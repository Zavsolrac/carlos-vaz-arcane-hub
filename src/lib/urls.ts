const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const DATA_URL_RE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/i;

export function sanitizeHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isAllowedImageDataUrl(value: string): boolean {
  return DATA_URL_RE.test(value.trim());
}

export function sanitizeImageSrc(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (isAllowedImageDataUrl(trimmed)) return trimmed;
  return sanitizeHttpUrl(trimmed);
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function escapeMarkdownAlt(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('[', '\\[').replaceAll(']', '\\]').replaceAll('\n', ' ');
}

export function wrapMarkdownDestination(url: string): string {
  if (/[\s()<>]/.test(url)) {
    return `<${url.replaceAll('<', '%3C').replaceAll('>', '%3E')}>`;
  }
  return url;
}

export function isSafeAssetFilename(value: string): boolean {
  return /^[a-zA-Z0-9._-]+\.(png|jpe?g|webp)$/i.test(value);
}

export function resolveEmbedImageSrc(associatedImageUrl: string, fallbackFilename: string): string {
  if (!isSafeAssetFilename(fallbackFilename)) {
    throw new Error('Unsafe fallback filename');
  }
  const trimmed = associatedImageUrl.trim();
  if (!trimmed) return fallbackFilename;
  const safeImage = sanitizeImageSrc(trimmed);
  if (safeImage) return safeImage;
  if (isSafeAssetFilename(trimmed)) return trimmed;
  return fallbackFilename;
}
