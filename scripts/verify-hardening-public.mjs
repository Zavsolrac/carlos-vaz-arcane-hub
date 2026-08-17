import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import puppeteer from 'puppeteer-core';
import { resolveChromeExecutable } from './resolve-chrome.mjs';

const URL = process.env.PUBLIC_URL || 'https://zavsolrac.github.io/carlos-vaz-arcane-hub/';
const OUT = join(process.cwd(), 'coverage', 'hardening-e2e');
mkdirSync(OUT, { recursive: true });

function readPngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function decodeQr(buf) {
  const png = PNG.sync.read(buf);
  return jsQR(new Uint8ClampedArray(png.data.buffer), png.width, png.height)?.data ?? null;
}

const browser = await puppeteer.launch({
  executablePath: resolveChromeExecutable(),
  headless: true,
  args: ['--no-sandbox'],
});

const page = await browser.newPage();
page.setDefaultTimeout(30000);
const consoleErrors = [];
page.on('pageerror', (err) => consoleErrors.push(String(err)));
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
const home = await page.evaluate(() => ({
  title: document.title,
  portfolioHref: [...document.querySelectorAll('a,button')].find((el) => el.textContent?.includes('Portfólio Canónico'))?.closest('button') ? null : [...document.querySelectorAll('button')].find((b) => b.textContent?.includes('Portfólio Canónico'))?.textContent,
  hasHubText: document.body.innerText.includes('CARLOS VAZ'),
}));

await page.evaluate(() => {
  [...document.querySelectorAll('button')].find((btn) => btn.textContent?.includes('Gerador PNG'))?.click();
});
await page.waitForSelector('#arcane-export-root', { timeout: 15000 });
const quickGenerator = await page.evaluate(() => Boolean(document.getElementById('arcane-export-root')));

await page.goto(`${URL}#gerador-png`, { waitUntil: 'networkidle0' });
await page.waitForSelector('#arcane-export-root', { timeout: 15000 });
const directHash = await page.evaluate(() => Boolean(document.getElementById('arcane-export-root')));

const injectionBlocked = await page.evaluate(() => {
  const sample = `<a href="javascript:alert(1)"><img src=x onerror=alert(1) alt="x"></a>`;
  return !sample.includes('href="javascript:') || sample.includes('&lt;');
});

async function captureExport(format) {
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
    }
  });
  await new Promise((r) => setTimeout(r, 700));
  const el = await page.$('#arcane-export-root');
  const png = await el.screenshot({ type: 'png' });
  writeFileSync(join(OUT, `${format}.png`), png);
  return { ...readPngSize(png), qr: decodeQr(png) };
}

const exports = {
  story: await captureExport('story'),
  square: await captureExport('square'),
};

const ogImageStatus = await page.goto('https://zavsolrac.github.io/carlos-vaz-arcane-hub/og-image.png', { waitUntil: 'networkidle0' }).then((r) => r?.status() ?? 0);

await browser.close();

const report = {
  home,
  quickGenerator,
  directHash,
  injectionBlocked,
  exports,
  ogImageStatus,
  consoleErrors,
};
console.log(JSON.stringify(report, null, 2));

if (!quickGenerator || !directHash) throw new Error('generator navigation failed');
if (!injectionBlocked) throw new Error('injection not blocked');
if (exports.story.width !== 1080 || exports.story.height !== 1920) throw new Error('story export size');
if (exports.square.width !== 1080 || exports.square.height !== 1080) throw new Error('square export size');
if (exports.story.qr !== 'https://portifoleo-carlos-vaz.vercel.app/') throw new Error('qr mismatch');
if (ogImageStatus !== 200) throw new Error('og image not reachable');
