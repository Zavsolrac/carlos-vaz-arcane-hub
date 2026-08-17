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

  it('wraps markdown-sensitive URL characters', () => {
    const markdown = buildClickableMarkdown({
      ...options,
      targetUrl: 'https://example.com/a_(b)',
      imageSrc: 'https://example.com/a%20b.png',
    });
    expect(markdown).toContain('<https://example.com/a_(b)>');
    expect(markdown).toContain('https://example.com/a%20b.png');
  });

  it('rejects unsafe iframe origins', () => {
    expect(buildIframeSnippet('javascript:alert(1)', 'x')).toBeNull();
  });

  it('accepts a GitHub Pages project URL', () => {
    const html = buildIframeSnippet('https://zavsolrac.github.io/carlos-vaz-arcane-hub/', 'Carlos Vaz');
    expect(html).toContain('src="https://zavsolrac.github.io/carlos-vaz-arcane-hub/"');
    expect(html).toContain('sandbox=');
    expect(html).toContain('allow-downloads');
  });
});
