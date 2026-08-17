import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const OUT_DIR = join(process.cwd(), 'public');
const OUT_FILE = join(OUT_DIR, 'og-image.png');

if (process.env.CI === 'true' && existsSync(OUT_FILE)) {
  console.log(`CI: reusing committed ${OUT_FILE}`);
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <style>
      html, body {
        margin: 0;
        width: 1200px;
        height: 630px;
        background: #0a0a0a;
        color: #e5e2e1;
        font-family: Georgia, 'Times New Roman', serif;
      }
      .frame {
        box-sizing: border-box;
        width: 1200px;
        height: 630px;
        padding: 72px 88px;
        background:
          radial-gradient(circle at 18% 18%, rgba(0, 242, 255, 0.12), transparent 34%),
          radial-gradient(circle at 82% 22%, rgba(233, 193, 118, 0.12), transparent 30%),
          linear-gradient(135deg, #0d1117 0%, #0a0a0a 55%, #13171f 100%);
        border: 1px solid rgba(0, 77, 77, 0.65);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 18px;
      }
      .badge {
        display: inline-block;
        width: fit-content;
        padding: 8px 16px;
        border-radius: 999px;
        border: 1px solid rgba(0, 242, 255, 0.35);
        color: #00f2ff;
        letter-spacing: 0.22em;
        font-size: 16px;
        text-transform: uppercase;
      }
      .name {
        font-size: 84px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        background: linear-gradient(135deg, #fff2cc 0%, #e9c176 40%, #c5a059 70%, #8c6e2d 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1;
        margin: 0;
      }
      .title {
        margin: 0;
        font-size: 34px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: #d1c5b4;
      }
      .role {
        margin: 0;
        font-size: 22px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #00f2ff;
      }
      .footer {
        margin-top: 18px;
        font-size: 18px;
        color: rgba(209, 197, 180, 0.75);
      }
    </style>
  </head>
  <body>
    <div class="frame">
      <div class="badge">Arcane Professional Hub</div>
      <h1 class="name">Carlos Vaz</h1>
      <p class="title">The Arcane Architect</p>
      <p class="role">Desenvolvedor Web • IA • Storytelling Digital</p>
      <p class="footer">Hub profissional · gerador social · portfólio canónico</p>
    </div>
  </body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const png = await page.screenshot({ type: 'png' });
  writeFileSync(OUT_FILE, png);
  console.log(`Wrote ${OUT_FILE} (${png.length} bytes)`);
} finally {
  await browser.close();
}
