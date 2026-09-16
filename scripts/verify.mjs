import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const baseURL = process.env.BASE_URL || 'http://localhost:4321';
const browser = await chromium.launch({ headless: true });
const capture = process.argv.includes('--capture');
if (capture) await mkdir('.impeccable/review', { recursive: true });
try {
  for (const viewport of [{ name: 'desktop', width: 1536, height: 1024 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').innerText(), 'Lluc Matas');
    assert.equal(await page.locator('.project').count(), 3);
    assert.equal(await page.locator('.project img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true, 'Project images load');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'No document overflow');
    if (capture) {
      await page.screenshot({ path: `.impeccable/review/${viewport.name}.png`, fullPage: true, animations: 'disabled' });
      if (viewport.name === 'desktop') await page.screenshot({ path: '.impeccable/review/hero-repro.png', animations: 'disabled' });
    }
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${viewport.name} accessibility`);
    await page.locator('.next').click();
    await page.waitForFunction(() => document.querySelector('#project-strip').scrollLeft > 0);
    await page.waitForFunction(() => !document.querySelector('.previous').disabled);
    await page.locator('.previous').click();
    await page.waitForFunction(() => document.querySelector('#project-strip').scrollLeft < 2);
    await page.locator('.project-link').first().focus();
    await page.keyboard.press('End');
    assert.equal(await page.evaluate(() => document.activeElement.href), 'https://shitboxgarage.com/');
    await page.keyboard.press('Home');
    assert.equal(await page.evaluate(() => document.activeElement.href), 'https://mallorcacyclinglab.com/');
    await page.locator('.public-code summary').click();
    assert.equal(await page.locator('.repository-list').isVisible(), true);
    assert.equal(await page.locator('.repository-list a').count(), 3);
    await page.locator('.section-nav a[href="#contact"]').click();
    await page.waitForFunction(() => document.querySelector('.section-nav a[href="#contact"]').hasAttribute('aria-current'));
    assert.equal(await page.locator('#contact').isVisible(), true);
    await page.locator('.section-nav a[href="#me"]').click();
    await page.waitForFunction(() => document.querySelector('.section-nav a[href="#me"]').hasAttribute('aria-current'));
    await page.locator('.section-nav a[href="#work"]').click();
    await page.waitForFunction(() => document.querySelector('.section-nav a[href="#work"]').hasAttribute('aria-current'));
    await page.evaluate(() => document.activeElement?.blur());
    await page.keyboard.press('Home');
    await page.waitForFunction(() => document.querySelector('.section-nav a[href="#me"]').hasAttribute('aria-current'));
    assert.equal(await page.locator('#project-strip').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto', 'Reduced motion is respected');
    assert.deepEqual(errors, [], 'No browser errors');
    console.log(`${viewport.name}: images, layout, accessibility, carousel, keyboard, navigation, disclosure, reduced motion passed`);
    await context.close();
  }
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJS.goto(baseURL);
  assert.equal(await noJS.locator('.project-link').count(), 3);
  assert.equal(await noJS.locator('.project-controls').isVisible(), false);
  await noJS.locator('.public-code summary').click();
  assert.equal(await noJS.locator('.repository-list').isVisible(), true);
  console.log('No-JavaScript content, links and native disclosure passed');
  await noJS.close();
} finally { await browser.close(); }
