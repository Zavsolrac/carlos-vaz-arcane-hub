import { escapeHtml, escapeMarkdownAlt, resolveEmbedImageSrc, sanitizeHttpUrl, wrapMarkdownDestination } from './urls';

export function buildClickableHtml(options: {
  targetUrl: string;
  imageSrc: string;
  fallbackFilename: string;
  alt: string;
}): string | null {
  const href = sanitizeHttpUrl(options.targetUrl);
  if (!href) return null;
  const src = resolveEmbedImageSrc(options.imageSrc, options.fallbackFilename);
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
  <img src="${escapeHtml(src)}" alt="${escapeHtml(options.alt)}" />
</a>`;
}

export function buildClickableMarkdown(options: {
  targetUrl: string;
  imageSrc: string;
  fallbackFilename: string;
  alt: string;
}): string | null {
  const href = sanitizeHttpUrl(options.targetUrl);
  if (!href) return null;
  const src = resolveEmbedImageSrc(options.imageSrc, options.fallbackFilename);
  return `[![${escapeMarkdownAlt(options.alt)}](${wrapMarkdownDestination(src)})](${wrapMarkdownDestination(href)})`;
}

export function buildIframeSnippet(origin: string, title: string): string | null {
  const href = sanitizeHttpUrl(origin);
  if (!href) return null;
  return `<iframe src="${escapeHtml(href)}" width="380" height="620" title="${escapeHtml(title)}" sandbox="allow-scripts allow-same-origin allow-popups allow-downloads" allow="clipboard-write" referrerpolicy="no-referrer"></iframe>`;
}
