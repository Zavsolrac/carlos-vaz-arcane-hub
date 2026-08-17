import { describe, expect, it } from 'vitest';
import {
  ALLOWED_IMAGE_MIME,
  assertImageDimensions,
  extractImageSrcFromMarkup,
  validateImageFileMeta,
} from './imageInput';

describe('image input guards', () => {
  it('accepts allowed MIME types only', () => {
    expect(ALLOWED_IMAGE_MIME).toEqual(['image/png', 'image/jpeg', 'image/webp']);
    expect(validateImageFileMeta({ type: 'image/gif', size: 1000 })).toMatch(/Formato/);
    expect(validateImageFileMeta({ type: 'image/png', size: 1000 })).toBeNull();
  });

  it('rejects oversized byte input', () => {
    expect(validateImageFileMeta({ type: 'image/png', size: 11 * 1024 * 1024 })).toMatch(/10 MiB/);
  });

  it('rejects oversized dimensions', () => {
    expect(assertImageDimensions(9000, 1000)).toMatch(/8192/);
  });

  it('rejects unsupported remote markup sources', () => {
    expect(extractImageSrcFromMarkup('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(extractImageSrcFromMarkup('javascript:alert(1)')).toBeNull();
  });

  it('accepts safe https image URLs from markup', () => {
    expect(extractImageSrcFromMarkup('https://example.com/a.png')).toBe('https://example.com/a.png');
  });
});
