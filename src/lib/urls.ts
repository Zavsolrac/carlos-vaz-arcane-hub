const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

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

export function isSafeAssetFilename(value: string): boolean {
  return /^[a-zA-Z0-9._-]+\.(png|jpe?g|webp)$/i.test(value);
}

export function resolveEmbedImageSrc(associatedImageUrl: string, fallbackFilename: string): string {
  if (isSafeAssetFilename(fallbackFilename) === false) {
    throw new Error('Unsafe fallback filename');
  }

  const trimmed = associatedImageUrl.trim();
  if (!trimmed) return fallbackFilename;

  const httpUrl = sanitizeHttpUrl(trimmed);
  if (httpUrl) return httpUrl;

  if (isSafeAssetFilename(trimmed)) return trimmed;

  return fallbackFilename;
}
