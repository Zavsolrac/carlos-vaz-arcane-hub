import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { platform } from 'node:os';

const WINDOWS_CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function firstExisting(paths) {
  return paths.find((path) => existsSync(path)) ?? null;
}

function discoverLinuxChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
  ].filter(Boolean);

  const existing = firstExisting(candidates);
  if (existing) return existing;

  for (const command of ['google-chrome-stable', 'google-chrome', 'chromium-browser', 'chromium']) {
    try {
      const resolved = execSync(`command -v ${command}`, { encoding: 'utf8' }).trim();
      if (resolved && existsSync(resolved)) return resolved;
    } catch {
      // continue
    }
  }

  return null;
}

export function resolveChromeExecutable() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const system = platform();
  if (system === 'win32') {
    const win = firstExisting([
      WINDOWS_CHROME,
      process.env.LOCALAPPDATA ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe` : null,
    ].filter(Boolean));
    if (win) return win;
  }

  if (system === 'darwin') {
    const mac = firstExisting([MAC_CHROME]);
    if (mac) return mac;
  }

  if (system === 'linux') {
    const linux = discoverLinuxChrome();
    if (linux) return linux;
  }

  throw new Error(
    'Chrome/Chromium executable not found. Set CHROME_PATH to a valid browser binary for optional Puppeteer scripts.',
  );
}
