import {
  escapeHtml,
  escapeMarkdownAlt,
  resolveEmbedImageSrc,
  sanitizeHttpUrl,
} from './urls';

export function buildClickableHtml(options: {
  targetUrl: string;
  imageSrc: string;
  fallbackFilename: string;
  alt: string;
}): string | null {
  const href = sanitizeHttpUrl(options.targetUrl);
  if (!href) return null;

  const src = resolveEmbedImageSrc(options.imageSrc, options.fallbackFilename);
  const alt = escapeHtml(options.alt);

  return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
  <img src="${escapeHtml(src)}" alt="${alt}" />
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
  const alt = escapeMarkdownAlt(options.alt);

  return `[![${alt}](${src})](${href})`;
}
