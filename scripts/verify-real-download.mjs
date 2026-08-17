import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import puppeteer from 'puppeteer-core';
import { resolveChromeExecutable } from './resolve-chrome.mjs';

const BASE = process.env.EXPORT_BASE || '/carlos-vaz-arcane-hub';
const START_URL = process.env.PUBLIC_URL || `http://127.0.0.1:4177${BASE}/#gerador-png`;
const DIST = join(process.cwd(), 'dist');
const OUT = join(process.cwd(), 'coverage', 'real-download-audit');
const DOWNLOAD_DIR = join(OUT, 'downloads');
const PORTFOLIO_QR = 'https://portifoleo-carlos-vaz.vercel.app/';
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
};

function readPngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function decodeQr(buf) {
  const png = PNG.sync.read(buf);
  return jsQR(new Uint8ClampedArray(png.data.buffer), png.width, png.height)?.data ?? null;
}

function waitForDownload(dir, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const poll = () => {
      const files = existsSync(dir)
        ? readdirSync(dir).filter((name) => name.endsWith('.png') && !name.endsWith('.crdownload'))
        : [];
      if (files.length > 0) {
        resolve(join(dir, files.at(-1)));
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error('Timed out waiting for downloaded PNG'));
        return;
      }
      setTimeout(poll, 250);
    };
    poll();
  });
}

let server;
if (START_URL.includes('127.0.0.1')) {
  server = createServer((req, res) => {
    let url = req.url?.split('?')[0] ?? '/';
    if (url.startsWith(BASE)) url = url.slice(BASE.length);
    if (!url || url === '/') url = '/index.html';
    try {
      const file = join(DIST, decodeURIComponent(url));
      const body = readFileSync(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('not found');
    }
  });
  await new Promise((resolve) => server.listen(4177, resolve));
}

mkdirSync(DOWNLOAD_DIR, { recursive: true });
rmSync(DOWNLOAD_DIR, { recursive: true, force: true });
mkdirSync(DOWNLOAD_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: resolveChromeExecutable(),
  headless: true,
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  const client = await page.createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_DIR,
  });

  page.setDefaultTimeout(30000);
  const consoleErrors = [];
  page.on('pageerror', (err) => consoleErrors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(START_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('#arcane-export-root');

  const unsupportedBefore = await page.evaluate(() => {
    const root = document.getElementById('arcane-export-root');
    if (!root) return -1;
    const props = ['color', 'backgroundColor', 'backgroundImage', 'boxShadow'];
    let count = 0;
    for (const node of [root, ...root.querySelectorAll('*')]) {
      for (const prop of props) {
        const value = getComputedStyle(node)[prop];
        if (/oklab\(|oklch\(|lab\(|lch\(|color\(/i.test(value ?? '')) count += 1;
      }
    }
    return count;
  });

  await page.evaluate(() => {
    const name = document.querySelector('input[value="CARLOS VAZ"]');
    const title = [...document.querySelectorAll('input')].find((input) => input.value === 'THE ARCANE ARCHITECT');
    if (title) {
      title.value = 'ARCANE TEST BRAND';
      title.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  async function downloadFormat(format) {
    rmSync(DOWNLOAD_DIR, { recursive: true, force: true });
    mkdirSync(DOWNLOAD_DIR, { recursive: true });

    if (format === 'square') {
      await page.evaluate(() => {
        [...document.querySelectorAll('button')].find((btn) => btn.textContent?.includes('1:1'))?.click();
      });
      await page.waitForFunction(() => document.getElementById('arcane-export-root')?.dataset.exportFormat === 'square');
      await new Promise((r) => setTimeout(r, 500));
    }

    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find((btn) => btn.textContent?.includes('Baixar PNG'))?.click();
    });

    await new Promise((r) => setTimeout(r, 1500));
    const exportError = await page.evaluate(() => {
      return [...document.querySelectorAll('p')].find((el) => el.className.includes('rose-300'))?.textContent ?? null;
    });
    if (exportError) {
      throw new Error(`Export UI error (${format}): ${exportError}`);
    }

    const downloadedPath = await waitForDownload(DOWNLOAD_DIR);
    const png = readFileSync(downloadedPath);
    writeFileSync(join(OUT, `${format}-real-download.png`), png);
    return { ...readPngSize(png), qr: decodeQr(png), path: downloadedPath };
  }

  const results = {
    unsupportedBefore,
    story: await downloadFormat('story'),
    square: await downloadFormat('square'),
    consoleErrors,
    realHtml2CanvasPath: true,
  };

  console.log(JSON.stringify(results, null, 2));

  if (unsupportedBefore !== 0) throw new Error(`unsupported colors before export: ${unsupportedBefore}`);
  if (results.story.width !== 1080 || results.story.height !== 1920) {
    throw new Error(`story download size ${results.story.width}x${results.story.height}`);
  }
  if (results.square.width !== 1080 || results.square.height !== 1080) {
    throw new Error(`square download size ${results.square.width}x${results.square.height}`);
  }
  if (results.story.qr !== PORTFOLIO_QR) throw new Error(`QR ${results.story.qr}`);
} finally {
  await browser.close();
  if (server) server.close();
}
