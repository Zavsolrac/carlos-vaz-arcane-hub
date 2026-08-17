function decodeDataUrl(dataUrl: string): Uint8Array {
  const match = dataUrl.match(/^data:image\/png;base64,(.+)$/);
  if (!match) {
    throw new Error('Expected a PNG data URL');
  }

  if (typeof atob === 'function') {
    const binary = atob(match[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  return Uint8Array.from(Buffer.from(match[1], 'base64'));
}

export function readPngSize(dataUrl: string): { width: number; height: number } {
  const bytes = decodeDataUrl(dataUrl);
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[i] !== signature[i]) {
      throw new Error('Invalid PNG signature');
    }
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  return { width, height };
}
