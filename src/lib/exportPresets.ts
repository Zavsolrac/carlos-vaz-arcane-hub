export type ExportFormat = 'story' | 'square';

export const EXPORT_PRESETS = {
  story: { width: 1080, height: 1920, ratioLabel: '9:16' },
  square: { width: 1080, height: 1080, ratioLabel: '1:1' },
} as const;

export const PREVIEW_WIDTH = 360;

export function getPreviewScale(format: ExportFormat): number {
  return PREVIEW_WIDTH / EXPORT_PRESETS[format].width;
}

export function assertExportSize(width: number, height: number, format: ExportFormat): void {
  const expected = EXPORT_PRESETS[format];
  if (width !== expected.width || height !== expected.height) {
    throw new Error(
      `Export size mismatch: got ${width}×${height}, expected ${expected.width}×${expected.height}.`,
    );
  }
}
