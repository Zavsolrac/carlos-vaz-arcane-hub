import { describe, expect, it } from 'vitest';
import { buildClickableHtml, buildClickableMarkdown, buildIframeSnippet } from './embed';
import { sanitizeHttpUrl } from './urls';

describe('sanitizeHttpUrl', () => {
  it('accepts the canonical portfolio URL', () => {
    expect(sanitizeHttpUrl('https://portifoleo-carlos-vaz.vercel.app/')).toBe(
      'https://portifoleo-carlos-vaz.vercel.app/',
    );
  });

  it('rejects javascript and other unsafe protocols', () => {
    expect(sanitizeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeHttpUrl('data:text/html,hi')).toBeNull();
  });
});

describe('embed generators', () => {
  const options = {
    targetUrl: 'https://portifoleo-carlos-vaz.vercel.app/',
    imageSrc: '',
    fallbackFilename: 'carlos-vaz-arcane-card-story.png',
    alt: 'Carlos Vaz — The Arcane Architect',
  };

  it('builds HTML with noopener noreferrer', () => {
    const html = buildClickableHtml(options);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain('javascript:');
  });

  it('escapes HTML in alt text', () => {
    const html = buildClickableHtml({ ...options, alt: 'Carlos <script>alert(1)</script>' });
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('builds markdown clickable image', () => {
    expect(buildClickableMarkdown(options)).toContain('](https://portifoleo-carlos-vaz.vercel.app/)');
  });

  it('rejects unsafe iframe origins', () => {
    expect(buildIframeSnippet('javascript:alert(1)', 'x')).toBeNull();
  });
});
