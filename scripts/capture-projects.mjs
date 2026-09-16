import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const projects = [
  ['mallorca-cycling-lab', 'https://mallorcacyclinglab.com/en'],
  ['nus-mallorca', 'https://nusmallorca.com'],
  ['shitbox-garage', 'https://shitboxgarage.com'],
];
await mkdir('public/images', { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const [slug, url] of projects) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const reject = page.getByRole('button', { name: /^(Reject all|Reject analytics)$/ });
    const hadCookieBanner = (await reject.count()) > 0;
    if (hadCookieBanner) await reject.first().click();
    await page.waitForTimeout(250);
    const file = `public/images/${slug}.webp`;
    const screenshot = join(tmpdir(), `llucmatas-${slug}.png`);
    await page.screenshot({ path: screenshot, animations: 'disabled' });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', screenshot, '-c:v', 'libwebp', '-quality', '84', file]);
    const provenance = `Real browser screenshot of ${page.url()}, captured ${new Date().toISOString()} with Playwright Chromium at 1440x900 CSS pixels, device pixel ratio 1, reduced motion. ${hadCookieBanner ? 'Optional analytics rejected through the live cookie banner before capture.' : 'No cookie banner needed dismissal.'} Encoded WebP quality 84. No generated imagery or invented interface. Portfolio project preview for the approved personal studio composition. HTTP ${response.status()}. Page title: ${await page.title()}.`;
    execFileSync('node', ['/home/lluc/.agents/skills/impeccable/scripts/embed-prompt.mjs', file, '--prompt', provenance], { stdio: 'inherit' });
    console.log(JSON.stringify({ file, url: page.url(), status: response.status(), title: await page.title(), text: (await page.locator('body').innerText()).slice(0, 800) }));
    await page.close();
  }
} finally {
  await browser.close();
}
