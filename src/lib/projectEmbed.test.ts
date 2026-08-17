import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildProjectClickableHtml } from './projectEmbed';

const baseProject = {
  liveUrl: 'https://portifoleo-carlos-vaz.vercel.app/',
  imageUrl: 'https://example.com/preview.png',
  title: 'Projeto Seguro',
  subtitle: 'Subtítulo',
};

describe('buildProjectClickableHtml', () => {
  it('rejects javascript URLs', () => {
    const result = buildProjectClickableHtml({ ...baseProject, liveUrl: 'javascript:alert(1)' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/inválida/i);
  });

  it('rejects data:text/html image sources', () => {
    const result = buildProjectClickableHtml({
      ...baseProject,
      imageUrl: 'data:text/html,<script>alert(1)</script>',
    });
    expect(result.ok).toBe(false);
  });

  it('escapes malicious title attributes', () => {
    const result = buildProjectClickableHtml({
      ...baseProject,
      title: '"><img src=x onerror=alert(1)>',
      subtitle: '<script>alert(1)</script>',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.html).toContain('&quot;&gt;&lt;img');
      expect(result.html).toContain('&lt;script&gt;');
      expect(result.html).not.toContain('<img src=x onerror=alert(1)>');
      expect(result.html).not.toContain('<script>');
    }
  });

  it('rejects credential URLs', () => {
    const result = buildProjectClickableHtml({
      ...baseProject,
      liveUrl: 'https://user:pass@example.com/',
    });
    expect(result.ok).toBe(false);
  });

  it('escapes attribute-breaking destination URLs', () => {
    const result = buildProjectClickableHtml({
      ...baseProject,
      liveUrl: 'https://example.com/" onclick="alert(1)',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.html).toContain('href="https://example.com/%22%20onclick=%22alert(1)"');
      expect(result.html).not.toMatch(/href="https:\/\/example\.com\/" onclick=/);
    }
  });
});

describe('social metadata completeness', () => {
  it('includes og and twitter image tags', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    expect(html).toContain('property="og:url"');
    expect(html).toContain('property="og:image"');
    expect(html).toContain('property="og:image:width"');
    expect(html).toContain('property="og:image:height"');
    expect(html).toContain('name="twitter:image"');
    expect(html).toContain('og-image.png');
  });
});
