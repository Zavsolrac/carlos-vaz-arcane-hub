import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import puppeteer from 'puppeteer-core';

const DIST = join(process.cwd(), 'dist');
const OUT = join(process.cwd(), 'coverage', 'export-audit');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function readPngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function decodeQr(buf) {
  const png = PNG.sync.read(buf);
  return jsQR(new Uint8ClampedArray(png.data.buffer), png.width, png.height)?.data ?? null;
}

const server = createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url.split('?')[0];
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

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});

try {
  mkdirSync(OUT, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 2200, deviceScaleFactor: 1 });
  page.setDefaultTimeout(20000);
  await page.goto('http://127.0.0.1:4177/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find((btn) => btn.textContent?.includes('Gerador'))?.click();
  });
  await page.waitForSelector('#arcane-export-root');

  const results = {};
  for (const format of ['story', 'square']) {
    if (format === 'square') {
      await page.evaluate(() => {
        [...document.querySelectorAll('button')].find((btn) => btn.textContent?.includes('1:1'))?.click();
      });
      await page.waitForFunction(() => document.getElementById('arcane-export-root')?.dataset.exportFormat === 'square');
    }
    await page.evaluate(() => {
      const el = document.getElementById('arcane-export-root');
      const wrap = el?.parentElement;
      if (wrap) {
        wrap.style.left = '0px';
        wrap.style.top = '0px';
        wrap.style.zIndex = '99999';
        wrap.style.opacity = '1';
      }
    });
    await new Promise((r) => setTimeout(r, 600));
    const el = await page.$('#arcane-export-root');
    const png = await el.screenshot({ type: 'png' });
    const size = readPngSize(png);
    writeFileSync(join(OUT, `${format}.png`), png);
    results[format] = { ...size, qr: decodeQr(png) };
  }

  console.log(JSON.stringify(results, null, 2));
  if (results.story.width !== 1080 || results.story.height !== 1920) {
    throw new Error(`story size ${results.story.width}x${results.story.height}`);
  }
  if (results.square.width !== 1080 || results.square.height !== 1080) {
    throw new Error(`square size ${results.square.width}x${results.square.height}`);
  }
  if (results.story.qr !== 'https://portifoleo-carlos-vaz.vercel.app/') {
    throw new Error(`QR payload ${results.story.qr}`);
  }
} finally {
  await browser.close();
  server.close();
}
