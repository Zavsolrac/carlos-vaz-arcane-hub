const UNSUPPORTED_COLOR_RE = /oklab\(|oklch\(|(?:^|[\s,(])lab\(|(?:^|[\s,(])lch\(|color\(/i;

export function containsUnsupportedColorFunction(value: string): boolean {
  return UNSUPPORTED_COLOR_RE.test(value);
}

const EXPORT_COLOR_PROPERTIES = [
  'color',
  'backgroundColor',
  'backgroundImage',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'boxShadow',
  'textShadow',
  'fill',
  'stroke',
] as const;

export type UnsupportedExportColor = {
  property: string;
  value: string;
};

export function findUnsupportedExportColors(root: HTMLElement): UnsupportedExportColor[] {
  const hits: UnsupportedExportColor[] = [];
  const nodes = [root, ...root.querySelectorAll('*')];

  for (const node of nodes) {
    if (!(node instanceof HTMLElement) && !(node instanceof SVGElement)) continue;
    const styles = getComputedStyle(node);
    for (const property of EXPORT_COLOR_PROPERTIES) {
      const value = styles[property];
      if (value && containsUnsupportedColorFunction(value)) {
        hits.push({ property, value });
      }
    }
  }

  return hits;
}

export function assertExportColorsSafe(root: HTMLElement): void {
  const hits = findUnsupportedExportColors(root);
  if (hits.length > 0) {
    throw new Error(`Export subtree contains unsupported color functions (${hits.length}).`);
  }
}
