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
| `src/components/LoopVideo.tsx` | Muted looping video: plays only on screen, pause button, lazy optimised poster, still under reduced motion |
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
| `node scripts/test-interactions.mjs` | 23/23 pass (including video play/pause/off-screen and the JW Marriott contact details): filters and counts, sorting, Quick View (no navigation, focus on title, gallery buttons and arrow keys, Esc, backdrop, focus restored to the card), enquiry validation and WhatsApp hand-off, FAQ, anchors, Maps links, active nav, phone menu (focus, Esc, link closes), phone Quick View, 24px targets, reduced motion, no-JavaScript fallback |
| `node scripts/a11y.mjs` (axe-core, WCAG 2.2 AA) | 0 violations at 1440 and 390, page and open Quick View |
| `node scripts/qa.mjs` | No horizontal overflow at 1440 / 768 / 390, no console errors or warnings |
| taste-skill `lint.mjs` / `inspect.mjs` | 0 FAIL. One WARN kept on purpose: the reviews carousel scrolls sideways (with previous/next buttons and keyboard access) |
| Lighthouse (production, simulated) | Desktop: 100 / 100 / 100 / 100. Mobile: performance 97–99 (LCP 2.2–2.6 s on simulated slow 4G), accessibility 100, best practices 100, SEO 100 |

Screenshots: run `node scripts/qa.mjs` and open `.qa/`.

## Client decisions (22 Oct 2026)

- Prices: the live homepage prices, shown as "AED x / day excl. 5% VAT" (VAT treatment confirmed).
- Car names and taglines: from the client's list (`CURATION` in `scripts/build-fleet.py`).
- Specs and model years: no confirmed figures needed; Quick View shows the live site's reference specs.
- Opening hours: daily, 9 am – 6 pm at both locations (also in the JSON-LD). JW Marriott Hotel Marina counter: +971 55 791 6550.
- Social: Instagram `formuladrivedubai`, X `formulaonedubai`. Roadside assistance 800-4845 (24/7).
- Hero video: the client's own Ferrari F8 Spider clips (`data/source/video/`, transcoded to
  `public/video/` as 720×1280 and 1080×1920 H.264 MP4 + VP9 WebM, muted, with poster frames).
- Location photography: Wikimedia Commons, credited in each photo caption (see Image credits).
- Footer: "Managed by DevStack Lab" linking to https://devstacklab.com/.
- Terms and Privacy: not included (pages and links removed).
- MG ZS Lux main photo: confirmed as the client's own (kept; it is low resolution, 600×375).

## SEO and migration

The new site now serves formuladriverentacar.com (apex redirects to `www`, the canonical host).

- Home page: metadata, canonical, Open Graph, and JSON-LD for the business (AutoRental), the fleet
  (ItemList) and the FAQ (FAQPage). The `h1` carries a visually hidden keyword line.
- Car pages: the 15 cars keep their old URLs at `/autos/<slug>/` (`src/app/autos/[slug]/page.tsx`,
  generated from `fleet.json`), each with its own title, description, canonical, Product +
  BreadcrumbList JSON-LD, gallery, specs, terms and Call / WhatsApp buttons.
- Old WordPress URLs without a page here are permanently redirected in `next.config.ts`: renamed
  car listings to the matching car, Ferrari and Audi brand pages to their only car, everything else
  (other brands, body types, blog, cart, contact) to the home page. `trailingSlash: true` keeps the
  old slash-ending URLs resolving in one hop.
- `robots.txt` and `sitemap.xml` (with image entries) are generated by `src/app/robots.ts` and
  `src/app/sitemap.ts`.
- Next: verify `www` in Google Search Console, submit the sitemap, and watch the Pages report.
  Brand and body-type landing pages (e.g. rent Lamborghini Dubai) would replace the home-page
  redirects. No analytics is connected.
- Repository: https://github.com/moedev21/formula-drive-web

## Booking journey

Every action leads to a real enquiry, never a simulated reservation or payment: WhatsApp to
+971 55 945 3676 (with the car, dates, pick-up and name prefilled from Quick View), a call to
+971 4 421 4433, or email.

## Image and video credits

- Fleet photographs: formuladriverentacar.com (the client's own).
- Ferrari F8 Spider videos: supplied by the client.
- "Dubai Marina Skyline" by Norlando Pobre, CC BY 2.0, via Wikimedia Commons
  (https://commons.wikimedia.org/wiki/File:Dubai_Marina_Skyline.jpg).
- "UAE Dubai Marina img1 asv2018-01" by A.Savin, Free Art License 1.3, via Wikimedia Commons
  (https://commons.wikimedia.org/wiki/File:UAE_Dubai_Marina_img1_asv2018-01.jpg).
Each credit appears in the caption under its photo (licence requirement); licence metadata is in `data/source/location-images/commons-credits.json`.
Neither photo shows or is presented as the JW Marriott hotel; both are captioned "Dubai Marina".
