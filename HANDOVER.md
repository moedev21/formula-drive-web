# Formula Drive — Production Handover

Single-page website for Formula Drive Rent a Car, Dubai Marina. Next.js 15 (App Router) ·
React 19 · TypeScript · Tailwind CSS 4. Fully static: no CMS, no booking backend, no database.
**Nothing has been deployed, and the live site at formuladriverentacar.com has not been changed.**

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | Contents |
| --- | --- |
| `src/app/page.tsx` | The page: the eleven sections in order |
| `src/app/layout.tsx` | Fonts, metadata, Open Graph, JSON-LD (`AutoRental` + fleet `ItemList`) |
| `src/app/globals.css` | Design tokens, type steps, buttons, motion, reduced-motion rules |
| `src/components/` | One component per section, plus `QuickView`, `Logo`, `Reveal`, `icons` |
| `src/data/site.ts` | **Edit content here**: contact details, locations, experience points, steps, reasons, reviews, FAQ |
| `src/data/fleet.json` | **Fleet data** (generated, see below), loaded through `src/data/fleet.ts` |
| `public/fleet/` | Fleet photographs, original bytes, `01` = card image |
| `public/brand/` | Web versions of the official logos (background square removed, canvas trimmed) |
| `brand/original/` | The official SVGs exactly as supplied |
| `data/source/` | Snapshot of the live site (API export, pages, all 153 original images) |
| `data/fleet-inventory.csv` | Flat inventory to check against the live site |
| `DESIGN.md` · `WIREFRAME.md` · `FLEET-AUDIT.md` | Design system, section plan, audit and issue list |

### Updating the fleet

`scripts/build-fleet.py` turns the snapshot into `src/data/fleet.json` and copies the selected images.
The `CURATION` table at its top decides display name, categories and which photos to use, in order.
After editing it, run `python3 scripts/build-fleet.py`. To change a single price or spec quickly, edit
`src/data/fleet.json` directly (but the next script run will overwrite it, so make the same change in
the script or the snapshot).

To add a car: add its photos under `data/source/raw-images/<slug>/`, add its entry to the snapshot
or directly to `fleet.json`, and add a `CURATION` row.

## Quality checks (all run on the production build)

| Check | Result |
| --- | --- |
| `node scripts/test-interactions.mjs` | 21/21 pass: filters and counts, sorting, Quick View (no navigation, focus on title, gallery buttons and arrow keys, Esc, backdrop, focus restored to the card), enquiry validation and WhatsApp hand-off, FAQ, anchors, Maps links, active nav, phone menu (focus, Esc, link closes), phone Quick View, 24px targets, reduced motion, no-JavaScript fallback |
| `node scripts/a11y.mjs` (axe-core, WCAG 2.2 AA) | 0 violations at 1440 and 390, page and open Quick View |
| `node scripts/qa.mjs` | No horizontal overflow at 1440 / 768 / 390, no console errors or warnings |
| taste-skill `lint.mjs` / `inspect.mjs` | 0 FAIL. Two WARNs kept on purpose: no video (no footage of the real fleet exists, and stock footage would misrepresent the cars) and the reviews carousel scrolls sideways (deliberate, with previous/next buttons and keyboard access) |
| Lighthouse (production, simulated) | Desktop: 100 / 100 / 100 / 100. Mobile: performance 94–99 (LCP 2.2–3.0 s on simulated slow 4G), accessibility 100, best practices 100, SEO 100 |

Screenshots: run `node scripts/qa.mjs` and open `.qa/`.

## Before launch — needs the client

1. **Confirm prices exclude 5% VAT.** The live site shows "$ +VET". The new site says "AED … / day excl. 5% VAT".
2. **Confirm car names.** The new site uses the names from the live descriptions (Huracán EVO Spyder,
   911 GTS Cabriolet, G63 AMG, C 200), which differ from the listing titles.
3. **Replace generic specs with confirmed figures for each car** and supply model years. Today the
   Quick View shows "Reference specifications" exactly as listed on the live site, many of them approximate.
4. **JW Marriott Hotel Marina counter:** confirm hours, phone and the counter's exact location in the
   hotel. It is not mentioned anywhere on the live site. The page names it as Formula Drive's own counter
   and implies no partnership with the hotel.
5. **Opening hours** (not published on the live site, so not shown).
6. **Roadside number 800-4845 and the X/Twitter handle `formulaonedubai`** — please confirm.
7. **MG ZS photo**: low resolution, and possibly a dealer or stock image. Confirm the rights or supply your own photo.
8. **Original camera files for the hero cars** (current maximum is about 1,600–2,200px wide):
   Huracán EVO Spyder, Ferrari F8 Spider, Urus, G63.
9. **Location photography.** The location blocks use Formula Drive's own photos of its cars in the
   Marina. Licensed Dubai Marina photos were found on Wikimedia Commons ("Dubai Marina by day",
   Gfilip, CC BY-SA 4.0; "Dubai Marina Skyline", Norlando Pobre, CC BY 2.0) but could not be
   downloaded because the API was rate-limiting this environment. Your own photos of the Princess Tower
   entrance and the hotel counter would be best.
10. **Terms and Privacy.** `/terms` and `/privacy` are placeholders (noindex) because the live
    site's "Rental Policy" page returns 404. Supply the documents.
11. Fix on the live site in the meantime: broken redirects (`/autos/bmw-x2-2025-white/` → Lamborghini,
    `/autos/gmc-yukon-elevation-2025-black/` → Ferrari) and the 404 footer links.

## SEO and migration

- One page with semantic sections, one `h1`, an `h2` per section, metadata, Open Graph, canonical `/`,
  and JSON-LD for the business and the 15 cars (each linking to its existing live URL).
- **Do not delete or redirect the 15 live `/autos/…` URLs** until an SEO migration plan is
  approved. The cards already link to them (a no-JavaScript fallback, and crawlable), so both can coexist.
- Before launch: add `sitemap.ts` / `robots.ts` for the chosen domain, and connect analytics (none
  is included).

## Booking journey

Every action leads to a real enquiry, never a simulated reservation or payment: WhatsApp to
+971 55 945 3676 (with the car, dates, pick-up and name prefilled from Quick View), a call to
+971 4 421 4433, or email.

## Image credits

All fleet photographs come from formuladriverentacar.com (the client's own). No third-party images are used.
