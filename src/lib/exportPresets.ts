export type ExportFormat = 'story' | 'square';

export const EXPORT_PRESETS = {
  story: {
    width: 1080,
    height: 1920,
    ratioLabel: '9:16',
    filenameSuffix: 'story-1080x1920',
  },
  square: {
    width: 1080,
    height: 1080,
    ratioLabel: '1:1',
    filenameSuffix: 'square-1080x1080',
  },
} as const;

export const PREVIEW_WIDTH = 360;

export function getPreviewScale(format: ExportFormat): number {
  return PREVIEW_WIDTH / EXPORT_PRESETS[format].width;
}

export function assertExportSize(
  width: number,
  height: number,
  format: ExportFormat,
): void {
  const expected = EXPORT_PRESETS[format];
  if (width !== expected.width || height !== expected.height) {
    throw new Error(
      `Export size mismatch: got ${width}×${height}, expected ${expected.width}×${expected.height} (${expected.ratioLabel}).`,
    );
  }
}

export function cardFilename(name: string, format: ExportFormat): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'arcane-card';

  return `${slug}-${EXPORT_PRESETS[format].filenameSuffix}.png`;
}
