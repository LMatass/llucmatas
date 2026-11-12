import { setTimeout } from 'node:timers/promises';

// Railway's CI command can finish before the new deployment receives traffic.
const url = process.env.BASE_URL ?? 'https://llucmatas.com';
const today = new Date().toISOString().slice(0, 10);
for (let attempt = 1; attempt <= 30; attempt++) {
  try {
    const response = await fetch(url, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const dates = [...html.matchAll(/data-date="([^"]+)"/g)]
      .map(([, value]) => Date.parse(`${value} UTC`))
      .filter(Number.isFinite);
    const latest = dates.length ? new Date(Math.max(...dates)).toISOString().slice(0, 10) : null;
    if (latest && latest >= today) {
      console.log(`Live contribution graph is current through ${latest}.`);
      process.exit(0);
    }
    console.log(`Attempt ${attempt}: graph ends at ${latest ?? 'missing'}; expected ${today}.`);
  } catch (error) {
    console.log(`Attempt ${attempt}: ${error.message}`);
  }
  if (attempt < 30) await setTimeout(10_000);
}
throw new Error('The live GitHub contribution graph did not refresh. Check Railway deployment logs and its GITHUB_TOKEN.');
