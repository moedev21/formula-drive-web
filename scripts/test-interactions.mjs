// Functional checks in a real browser. Usage: node scripts/test-interactions.mjs [url]
import { chromium } from "playwright";
import assert from "node:assert/strict";

const url = process.argv[2] ?? "http://localhost:3000/";
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const results = [];
const check = async (name, fn) => {
  try {
    await fn();
    results.push(`PASS  ${name}`);
  } catch (e) {
    results.push(`FAIL  ${name}\n      ${e.message.replace(/\n+/g, " ").slice(0, 400)}`);
  }
};
const errors = [];

// ---------- Desktop ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  // Smooth scrolling animates every programmatic scroll, so a click can land where a target was
  // a moment earlier. The checks here are about behaviour, not scroll animation.
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });

  await check("one h1, and every section has a heading", async () => {
    assert.equal(await page.locator("h1").count(), 1);
    const untitled = await page.$$eval("main section", (s) => s.filter((x) => !x.querySelector("h1, h2")).map((x) => x.id));
    assert.deepEqual(untitled, []);
  });

  await check("hero changes car as the page scrolls", async () => {
    const caption = page.locator("#top p[aria-live]");
    const first = await caption.innerText();
    const h = await page.evaluate(() => document.getElementById("top").offsetHeight);
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(h * 0.55));
    await page.waitForTimeout(500);
    const later = await caption.innerText();
    assert.notEqual(first, later, "caption did not change");
    // Instant: the page scrolls smoothly, and a still-running scroll would move later click targets.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  });

  await check("filter tabs show the right cars and counts", async () => {
    await page.locator("#fleet").scrollIntoViewIfNeeded();
    const cards = page.locator("#fleet ul > li");
    assert.equal(await cards.count(), 16);
    const expected = { Supercars: 4, Sports: 4, SUVs: 9, Convertibles: 5, Economy: 2 };
    for (const [label, n] of Object.entries(expected)) {
      await page.getByRole("button", { name: new RegExp(`^${label}`) }).click();
      await page.waitForTimeout(450);
      assert.equal(await cards.count(), n, `${label} count`);
      assert.equal(await page.getByRole("button", { name: new RegExp(`^${label}`) }).getAttribute("aria-pressed"), "true");
    }
    const live = await page.locator("#fleet p[aria-live]").innerText();
    assert.match(live, /Showing 2 economy/);
    await page.getByRole("button", { name: /^All cars/ }).click();
    await page.waitForTimeout(450);
    assert.equal(await cards.count(), 16);
  });

  await check("sorting by price works both ways", async () => {
    const prices = async () =>
      (await page.locator("#fleet ul > li p.num").allInnerTexts()).map((t) => Number(t.match(/([\d,]+)\s*\/ day/)[1].replace(/,/g, "")));
    await page.locator("#fleet select").selectOption("price-asc");
    await page.waitForTimeout(450);
    const asc = await prices();
    assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
    assert.equal(asc[0], 170);
    await page.locator("#fleet select").selectOption("price-desc");
    await page.waitForTimeout(450);
    const desc = await prices();
    assert.deepEqual(desc, [...desc].sort((a, b) => b - a));
    await page.locator("#fleet select").selectOption("featured");
  });

  await check("card WhatsApp link targets the business number with the car named", async () => {
    const href = await page.locator("#fleet ul > li").first().locator('a[href^="https://wa.me/"]').getAttribute("href");
    assert.match(href, /^https:\/\/wa\.me\/971559453676\?text=/);
    assert.match(decodeURIComponent(href), /Ferrari F8 Spider|Lamborghini/);
  });

  await check("Quick View opens without navigating, focuses its title", async () => {
    const link = page.locator("#fleet ul > li > a").first();
    const name = await link.locator("h3").innerText();
    const before = page.url();
    await link.click();
    const dialog = page.locator("dialog.qv");
    await dialog.waitFor({ state: "visible" });
    await page.waitForTimeout(500);
    assert.equal(page.url(), before);
    assert.equal(await page.evaluate(() => document.activeElement?.id), "qv-title");
    assert.equal(await page.locator("#qv-title").innerText(), name);
  });

  await check("Quick View gallery moves with buttons and arrow keys", async () => {
    const live = page.locator("dialog.qv p[aria-live]");
    assert.match(await live.innerText(), /^Photo 1 of/);
    await page.getByRole("button", { name: "Next photo" }).click();
    assert.match(await live.innerText(), /^Photo 2 of/);
    await page.locator('dialog.qv [aria-roledescription="carousel"]').focus();
    await page.keyboard.press("ArrowLeft");
    assert.match(await live.innerText(), /^Photo 1 of/);
  });

  await check("enquiry form rejects a return date before pick-up", async () => {
    await page.locator('dialog.qv input[type="date"]').nth(0).fill("2030-05-10");
    await page.locator('dialog.qv input[type="date"]').nth(1).fill("2030-05-01");
    await page.locator('dialog.qv button[type="submit"]').click();
    await page.locator("#qv-error").waitFor();
  });

  await check("enquiry form opens WhatsApp with dates and pick-up", async () => {
    await page.locator('dialog.qv input[type="date"]').nth(1).fill("2030-05-12");
    await page.locator("dialog.qv select").selectOption({ index: 1 });
    const [popup] = await Promise.all([
      ctx.waitForEvent("page", { timeout: 5000 }).catch(() => null),
      page.locator('dialog.qv button[type="submit"]').click(),
    ]);
    assert.ok(popup, "no new tab opened");
    const u = decodeURIComponent(popup.url().replace(/\+/g, " "));
    await popup.close();
    assert.match(u, /971559453676/);
    assert.match(u, /2030-05-10 to 2030-05-12/);
    assert.match(u, /JW Marriott Hotel Marina counter/);
  });

  await check("Escape closes Quick View and returns focus to the card", async () => {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    assert.equal(await page.locator("dialog.qv").evaluate((d) => d.open), false);
    const focused = await page.evaluate(() => document.activeElement?.closest("li")?.querySelector("h3")?.textContent);
    assert.ok(focused, "focus not returned to a card");
  });

  await check("clicking the backdrop closes Quick View", async () => {
    await page.locator("#fleet ul > li > a").nth(1).click();
    await page.locator("dialog.qv").waitFor({ state: "visible" });
    await page.waitForTimeout(500);
    await page.mouse.click(40, 450);
    await page.waitForTimeout(400);
    assert.equal(await page.locator("dialog.qv").evaluate((d) => d.open), false);
  });

  await check("videos play on screen, pause off screen, and the pause button works", async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    const hero = page.locator("#top video");
    assert.equal(await hero.evaluate((v) => v.paused), false, "hero video not playing");
    await page.locator("#top").getByRole("button", { name: "Pause video" }).click();
    assert.equal(await hero.evaluate((v) => v.paused), true, "pause did not pause");
    await page.locator("#top").getByRole("button", { name: "Play video" }).click();
    assert.equal(await hero.evaluate((v) => v.paused), false, "play did not resume");
    await page.locator("#faq").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    assert.equal(await hero.evaluate((v) => v.paused), true, "hero video still playing off screen");
  });

  await check("JW Marriott counter shows its own phone and hours", async () => {
    const text = await page.locator("#locations").innerText();
    assert.match(text, /\+971 55 791 6550/);
    assert.match(text, /10 am – 10 pm/);
    assert.equal(await page.locator('#locations a[href="tel:+971557916550"]').count(), 1);
  });

  await check("FAQ items open and close", async () => {
    const d = page.locator("#faq details").first();
    await d.locator("summary").click();
    assert.equal(await d.evaluate((x) => x.open), true);
    await d.locator("summary").click();
    assert.equal(await d.evaluate((x) => x.open), false);
  });

  await check("every anchor link points to an existing section", async () => {
    const missing = await page.$$eval('a[href^="#"], a[href^="/#"]', (as) =>
      as.map((a) => a.getAttribute("href").replace(/^\//, "")).filter((h) => h.length > 1 && !document.getElementById(h.slice(1))),
    );
    assert.deepEqual([...new Set(missing)], []);
  });

  await check("directions links open Google Maps", async () => {
    const hrefs = await page.$$eval("#locations a", (as) => as.map((a) => a.href).filter((h) => h.includes("google.com/maps")));
    assert.equal(hrefs.length, 2);
    const profiles = await page.$$eval("#locations a", (as) => as.map((a) => a.href).filter((h) => h.includes("kgmid=")));
    assert.deepEqual(new Set(profiles).size, 2);
  });

  await check("header nav marks the current section", async () => {
    await page.locator("#locations").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(500);
    assert.equal(await page.locator('header nav a[aria-current="true"]').innerText(), "Locations");
  });

  await ctx.close();
}

// ---------- Phone ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: "networkidle" });

  await check("phone: menu opens, traps focus, Escape closes and restores focus", async () => {
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.locator('header dialog[aria-label="Menu"]');
    await menu.waitFor({ state: "visible" });
    assert.ok(await page.evaluate(() => document.activeElement?.closest("dialog") !== null));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    assert.equal(await menu.evaluate((d) => d.open), false);
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "Open menu");
  });

  await check("phone: menu link closes the menu and scrolls to the section", async () => {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator('header dialog[aria-label="Menu"] a[href="/#locations"]').click();
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('header dialog[aria-label="Menu"]').evaluate((d) => d.open), false);
    const top = await page.locator("#locations").evaluate((el) => el.getBoundingClientRect().top);
    assert.ok(top < 200, `section top at ${top}`);
  });

  await check("phone: Quick View fills the screen and closes", async () => {
    await page.locator("#fleet").scrollIntoViewIfNeeded();
    await page.locator("#fleet ul > li > a").first().click();
    const dialog = page.locator("dialog.qv");
    await dialog.waitFor({ state: "visible" });
    await page.waitForTimeout(600);
    const box = await dialog.boundingBox();
    assert.ok(box.width >= 389 && box.height >= 800, `dialog ${box.width}x${box.height}`);
    await page.getByRole("button", { name: "Close and return to the fleet" }).click();
    await page.waitForTimeout(400);
    assert.equal(await dialog.evaluate((d) => d.open), false);
  });

  // WCAG 2.2 2.5.8: targets at least 24x24 CSS px; links inside running text are exempt.
  await check("phone: tap targets are at least 24px (WCAG 2.5.8)", async () => {
    const small = await page.$$eval("a, button, summary, select, input", (els) =>
      els
        .filter((e) => e.offsetParent !== null && !e.closest("dialog:not([open])") && !e.matches(".sr-only-focusable, p a, figcaption a"))
        .map((e) => ({ t: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 30), r: e.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && (r.height < 24 || r.width < 24))
        .map(({ t, r }) => `${t} ${Math.round(r.width)}x${Math.round(r.height)}`),
    );
    assert.deepEqual(small, []);
  });

  await ctx.close();
}

// ---------- Reduced motion ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await check("reduced motion: hero is not pinned and all content is visible", async () => {
    const h = await page.evaluate(() => document.getElementById("top").offsetHeight);
    assert.ok(h <= 900, `hero height ${h}`);
    assert.equal(await page.locator("#top video").evaluate((v) => v.paused), true, "video autoplayed under reduced motion");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const hidden = await page.$$eval("[data-reveal]", (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length);
    assert.equal(hidden, 0);
  });
  await ctx.close();
}

// ---------- No JavaScript ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await check("without JavaScript: content visible, cards link to the car pages", async () => {
    const hidden = await page.$$eval("[data-reveal]", (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length);
    assert.equal(hidden, 0);
    const href = await page.locator("#fleet ul > li > a").first().getAttribute("href");
    assert.match(href, /^\/autos\/[a-z0-9-]+\/$/);
  });
  await ctx.close();
}

// ---------- Fleet card actions, Quick View footer, car pages ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await check("every fleet card has Call now and WhatsApp buttons", async () => {
    const cards = page.locator("#fleet ul > li");
    const n = await cards.count();
    assert.ok(n >= 16);
    for (let i = 0; i < n; i++) {
      const card = cards.nth(i);
      assert.match(await card.getByRole("link", { name: /^Call now about/ }).getAttribute("href"), /^tel:\+971/);
      assert.match(await card.getByRole("link", { name: /on WhatsApp$/ }).getAttribute("href"), /^https:\/\/wa\.me\//);
    }
  });
  await check("Quick View has no link to the old website", async () => {
    await page.locator("#fleet ul > li > a").first().click();
    await page.locator("dialog[open]").waitFor();
    assert.equal(await page.locator("dialog[open]").getByText("View on the current website").count(), 0);
    await page.keyboard.press("Escape");
  });
  const carUrl = new URL("/autos/ferrari-f8-spider/", url).href;
  const res = await page.goto(carUrl, { waitUntil: "networkidle" });
  await check("car page renders with its own title, canonical and structured data", async () => {
    assert.equal(res.status(), 200);
    assert.match(await page.locator("h1").innerText(), /Ferrari F8 Spider/);
    assert.match(await page.title(), /^Rent Ferrari F8 Spider in Dubai \| Formula Drive Dubai$/);
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      "https://www.formuladriverentacar.com/autos/ferrari-f8-spider/",
    );
    const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
    assert.ok(ld["@graph"].some((n) => n["@type"] === "Product" && n.offers?.price === 3000));
    assert.equal(await page.getByRole("link", { name: "Call now" }).count(), 1);
    assert.equal(await page.getByRole("link", { name: "WhatsApp", exact: true }).count(), 1);
  });
  await check("car page has no horizontal scroll on a phone", async () => {
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  });
  await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
console.log(errors.length ? `\nConsole/page errors:\n${[...new Set(errors)].join("\n")}` : "\nNo console or page errors.");
process.exitCode = results.some((r) => r.startsWith("FAIL")) ? 1 : 0;
