import { buildClickableHtml } from './embed';
import { sanitizeHttpUrl, sanitizeImageSrc } from './urls';

export type ProjectEmbedInput = {
  liveUrl: string;
  imageUrl: string;
  title: string;
  subtitle: string;
};

export type ProjectEmbedResult =
  | { ok: true; html: string; href: string; imageSrc: string }
  | { ok: false; error: string };

export function sanitizeProjectDestination(raw: string): string | null {
  return sanitizeHttpUrl(raw);
}

export function buildProjectClickableHtml(project: ProjectEmbedInput): ProjectEmbedResult {
  const href = sanitizeProjectDestination(project.liveUrl);
  if (!href) {
    return { ok: false, error: 'URL de destino inválida. Use http ou https sem credenciais.' };
  }

  const trimmedImage = project.imageUrl.trim();
  if (trimmedImage && !sanitizeImageSrc(trimmedImage)) {
    return { ok: false, error: 'Imagem inválida. Use http/https ou um PNG/JPEG/WebP local.' };
  }

  const html = buildClickableHtml({
    targetUrl: href,
    imageSrc: trimmedImage,
    fallbackFilename: 'carlos-vaz-arcane-card-story.png',
    alt: `${project.title} — ${project.subtitle}`,
  });

  if (!html) {
    return { ok: false, error: 'Não foi possível gerar HTML seguro para este projecto.' };
  }

  if (!html.includes('target="_blank"') || !html.includes('rel="noopener noreferrer"')) {
    return { ok: false, error: 'HTML gerado sem atributos de ligação segura.' };
  }

  return { ok: true, html, href, imageSrc: trimmedImage || 'carlos-vaz-arcane-card-story.png' };
}
