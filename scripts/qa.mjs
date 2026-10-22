// Real-browser QA: screenshots at desktop, tablet and phone widths plus console errors.
// Usage: node scripts/qa.mjs [url] [outDir]
import { chromium } from "playwright";
import fs from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000/";
const out = process.argv[3] ?? ".qa";
fs.mkdirSync(out, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "phone", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const report = {};
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor ?? 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/${vp.name}-first.png` });
  // Scroll through the page so lazy images and reveals settle, then capture it whole.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += Math.round(vp.height * 0.6)) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(800);
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    height: document.documentElement.scrollHeight,
    h1: [...document.querySelectorAll("h1")].map((h) => h.getBoundingClientRect().height),
  }));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${vp.name}-full.png`, fullPage: true });
  report[vp.name] = { ...metrics, overflowX: metrics.scrollWidth > metrics.clientWidth, errors };
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
