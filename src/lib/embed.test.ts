import { describe, expect, it } from 'vitest';
import { buildClickableHtml, buildClickableMarkdown } from './embed';
import { sanitizeHttpUrl } from './urls';

describe('sanitizeHttpUrl', () => {
  it('accepts https portfolio URL', () => {
    expect(sanitizeHttpUrl('https://portifoleo-carlos-vaz.vercel.app/')).toBe(
      'https://portifoleo-carlos-vaz.vercel.app/',
    );
  });

  it('rejects javascript and other unsafe protocols', () => {
    expect(sanitizeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeHttpUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(sanitizeHttpUrl('file:///etc/passwd')).toBeNull();
  });
});

describe('embed generators', () => {
  const options = {
    targetUrl: 'https://portifoleo-carlos-vaz.vercel.app/',
    imageSrc: '',
    fallbackFilename: 'carlos-vaz-story-1080x1920.png',
    alt: 'Carlos Vaz — The Arcane Architect',
  };

  it('builds HTML with noopener noreferrer', () => {
    const html = buildClickableHtml(options);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('https://portifoleo-carlos-vaz.vercel.app/');
    expect(html).not.toContain('javascript:');
  });

  it('escapes HTML in alt text', () => {
    const html = buildClickableHtml({
      ...options,
      alt: 'Carlos <script>alert(1)</script>',
    });
    expect(html).toContain('Carlos &lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('builds markdown clickable image', () => {
    const markdown = buildClickableMarkdown(options);
    expect(markdown).toBe(
      '[![Carlos Vaz — The Arcane Architect](carlos-vaz-story-1080x1920.png)](https://portifoleo-carlos-vaz.vercel.app/)',
    );
  });

  it('returns null for unsafe target URLs', () => {
    expect(buildClickableHtml({ ...options, targetUrl: 'javascript:alert(1)' })).toBeNull();
    expect(buildClickableMarkdown({ ...options, targetUrl: 'javascript:alert(1)' })).toBeNull();
  });
});
