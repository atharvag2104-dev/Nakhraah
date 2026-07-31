import { chromium } from 'playwright';
import { mkdirSync, copyFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.DEMO_URL || 'http://localhost:4200';
const OUTPUT_DIR = join(__dirname, '..', 'demo');
const VIDEO_DIR = join(OUTPUT_DIR, 'recordings');

mkdirSync(VIDEO_DIR, { recursive: true });

const pause = (page, ms = 1800) => page.waitForTimeout(ms);

async function scrollPage(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(window.innerHeight * 0.55, 320);
    let y = 0;
    const limit = document.body.scrollHeight - window.innerHeight;
    while (y < limit) {
      y = Math.min(y + step, limit);
      window.scrollTo({ top: y, behavior: 'smooth' });
      await wait(700);
    }
  });
}

async function visitPage(page, route, { scroll = true } = {}) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await pause(page, 2200);
  if (scroll) {
    await scrollPage(page);
    await pause(page, 1200);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await pause(page, 900);
  }
}

async function safeClick(page, selector) {
  const el = page.locator(selector).first();
  if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
    await el.click();
    return true;
  }
  return false;
}

async function main() {
  console.log('Recording demo from', BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 720 } },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // ── Home ──
  await visitPage(page, '/');
  await safeClick(page, '.slide-nav.next');
  await pause(page, 1600);
  await safeClick(page, '.slide-nav.next');
  await pause(page, 1600);

  // Dark mode preview
  await safeClick(page, '.theme-toggle');
  await pause(page, 2500);
  await scrollPage(page);
  await pause(page, 1200);
  await safeClick(page, '.theme-toggle');
  await pause(page, 1200);

  // ── Public pages ──
  await visitPage(page, '/about');
  await visitPage(page, '/services');
  await visitPage(page, '/gallery', { scroll: false });
  await pause(page, 2000);
  for (let i = 0; i < 4; i++) {
    await safeClick(page, '.nav-btn.next');
    await pause(page, 1400);
  }
  await scrollPage(page);
  await pause(page, 1000);

  await visitPage(page, '/contact');

  // End on home
  await visitPage(page, '/', { scroll: false });
  await pause(page, 2500);

  const video = page.video();
  await context.close();
  await browser.close();

  if (!video) {
    console.error('No video recorded.');
    process.exit(1);
  }

  const rawPath = await video.path();
  const finalPath = join(OUTPUT_DIR, 'nakhraah-client-demo.webm');
  copyFileSync(rawPath, finalPath);
  console.log('\nDemo video saved to:', finalPath);

  const files = readdirSync(VIDEO_DIR);
  console.log('Raw recording folder:', VIDEO_DIR, `(${files.length} file(s))`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
