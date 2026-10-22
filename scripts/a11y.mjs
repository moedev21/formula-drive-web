// Automated accessibility scan (axe-core, WCAG 2.2 AA) at desktop and phone, plus the Quick View open.
// Usage: node scripts/a11y.mjs [url]
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const url = process.argv[2] ?? "http://localhost:3000/";
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
let total = 0;
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const scans = [["page", await new AxeBuilder({ page }).withTags(tags).analyze()]];
  await page.locator("#fleet ul > li > a").first().click();
  await page.locator("dialog.qv").waitFor({ state: "visible" });
  await page.waitForTimeout(400);
  scans.push(["quick view", await new AxeBuilder({ page }).include("dialog.qv").withTags(tags).analyze()]);
  for (const [label, r] of scans) {
    console.log(`${vp.width}px ${label}: ${r.violations.length} violation(s), ${r.passes.length} rules passed`);
    for (const v of r.violations) {
      total++;
      console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 4)) console.log(`     ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
    }
  }
  await ctx.close();
}
await browser.close();
process.exitCode = total ? 1 : 0;
