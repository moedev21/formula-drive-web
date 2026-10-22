# Fleet & Content Audit — formuladriverentacar.com

Captured: see `data/source/snapshot/CAPTURED_AT` (22 Oct 2026).
Method: the WordPress REST API (`/wp-json/wp/v2/pixad-autos`), each car's detail page, the
homepage, and the contact page. The full raw snapshot is kept in `data/source/` so the new
site can be checked against the original.

| File | What it is |
| --- | --- |
| `data/source/snapshot/` | Raw API export, homepage HTML/text, contact page, detail-page extract |
| `data/source/pages/*.txt` | Each car's full live description, as text |
| `data/source/raw-images/` | Every gallery image downloaded at the largest size the site serves (153 files) |
| `data/source/image-manifest-raw.json` | Source URL, size, md5 and duplicate flag for every image |
| `data/fleet-inventory.csv` | Flat inventory: one row per car, live vs curated values side by side |
| `src/data/fleet.json` | Curated dataset the site renders (built by `scripts/build-fleet.py`) |
| `public/fleet/` | 112 selected images, original bytes, renamed `01…nn` in gallery order |

## Inventory (15 published cars)

| Car (as shown on new site) | Live listing title | AED / day | New-site tabs | Live URL |
| --- | --- | ---: | --- | --- |
| Ferrari F8 Spider | Ferrari F8 Spider | 3,000 | Supercars, Convertibles | /autos/ferrari-f8-spider/ |
| Lamborghini Huracán EVO Spyder | Lamborghini EVO SPIDER | 3,000 | Supercars, Convertibles | /autos/lamborghini-evo-spider/ |
| Lamborghini Urus | Lamborghini Urus | 2,500 | Supercars, SUVs | /autos/rent-lamborghini-urus/ |
| Porsche 911 GTS Cabriolet | Porsche 911 GTS Spider | 1,600 | Sports, Convertibles | /autos/porsche-911-gts-spider/ |
| Mercedes-Benz G63 AMG | Mercedes Benz G63 | 1,000 | SUVs | /autos/mercedes-benz-g63/ |
| Porsche Cayenne Coupe | Porsche Cayenne Coupe | 900 | SUVs, Sports | /autos/porsche-cayenne-coupe/ |
| Jeep Wrangler Rubicon 392 | Jeep Wrangler Rubicon 392 Hemi V8 6.4L | 800 | SUVs | /autos/jeep-wrangler-rubicon-392-hemi-v8-6-4l/ |
| Porsche 718 Boxster | Porsche 718 Boxster Convertible | 700 | Sports, Convertibles | /autos/porsche-718-boxster-convertible/ |
| Ford Mustang GT V8 | Ford Mustang GT V8 5.0L | 600 | Sports | /autos/ford-mustang-gt-v8-5-0l/ |
| BMW 4 Series Convertible | Bmw 4 Series Convertible | 600 | Convertibles | /autos/bmw-4-series-convertible/ |
| Mercedes-Benz C 200 | Mercedes C Class | 600 | All only | /autos/mercedes-c-class/ |
| GMC Yukon Elevation | GMC Yukon Elevation | 600 | SUVs | /autos/gmc-yukon-elevation/ |
| BMW X2 | BMW X2 | 400 | SUVs | /autos/bmw-x2/ |
| Audi Q2 | Audi Q2 | 300 | SUVs, Economy | /autos/audi-q2/ |
| MG ZS Lux | MG ZS Lux 2025 | 170 | SUVs, Economy | /autos/mg-zs-lux-2025/ |

**Prices.** Taken from the homepage, as instructed. All 15 homepage prices match the REST API
`_auto_price` and the price shown on each detail page, so every price is marked `verified`.
The new site shows them as **"AED x / day, excl. 5% VAT"**.

## Issues found on the live site (to fix or confirm)

### Prices and labels
1. **Currency symbol is "$".** Every price renders as `3,000.00 $ +VET`. A script on the page
   strips "AED" out of the price text. The figures are AED (the Mustang page says "AED 600/day").
   → New site: "AED".
2. **"+VET" is a typo for "+VAT".** → New site: "excl. 5% VAT". *Please confirm that the
   prices really exclude VAT.*
3. **"Rent a Car in JLT, Dubai Starting from 100 AED/day"** (homepage). The cheapest car listed
   is AED 170. → Not used.
4. **Homepage category counts don't match the listings.** It says "Economy 3 offers" but only the MG ZS
   is tagged Economy, "Sports Car 5 offers" and "SUV 9 offers" don't match the tags either.
5. **Monthly price is published for one car only** (Mustang: AED 12,000/month). Other monthly or
   weekly rates are unknown and not shown.

### Names and categories
6. **Listing titles disagree with the live descriptions:** "Lamborghini EVO SPIDER" (the description says
   *Huracán EVO Spyder*), "Porsche 911 GTS Spider" (*911 GTS Cabriolet*; Porsche sells no
   "911 Spider"), "Mercedes C Class" (*C-200*), "Mercedes Benz G63" (*G63 AMG*), "Bmw" capitalisation.
   → New site uses the description names. *Please confirm.*
7. **Body-type tags are inconsistent:** Audi Q2 and BMW X2 are tagged "sedans", while MG ZS
   and Mercedes G63 are tagged "sports", and the Jeep and GMC are tagged "truck". → The new site uses its own
   category mapping (table above). The C 200 sedan fits none of the brief's tabs and appears
   under "All" only. *Consider adding a "Sedans" tab.*
8. **Model years are not published as data.** Years appear only in redirect slugs (e.g.
   `porsche-911-gts-spider-2024`), the MG ZS title ("2025") and the Mustang text ("2024-model").
   → Years are not shown. *Please supply the model years.*

### Specifications
9. **Specs are generic manufacturer reference figures, not checked against each car.** Many are
   ranges or approximations ("~710–720 HP", "RWD / Optional AWD"). Units are mixed (mm and
   inches, Nm and lb-ft, km/h, MPG and L/100 km). → Shown exactly as listed, under
   the heading "Reference specifications". *Please replace them with the confirmed figures for each car.*
10. **The Cayenne Coupe page lists other variants** (E-Hybrid, Cayenne S, Turbo E-Hybrid, Turbo GT).
    → Removed; only the base-car lines are kept.
11. **Ford Mustang and Lamborghini Urus have no spec list.** The Mustang shows only "5.0L V8"
    (from its title). The Urus shows none.
12. Several detail pages leave "Engine Options" and "Power Output" blank (718 Boxster, Audi Q2, BMW X2).

### Rental conditions
13. **Car-specific conditions exist only for the Mustang** (250 km/day, AED 3 per extra km,
    AED 3,000 deposit, comprehensive insurance). For every other car the Quick View shows the
    general conditions published on the homepage (deposit AED 1,000–10,000, 24 h minimum, 21+,
    documents).
14. **The search-engine snippets show stale terms** that are no longer on the live pages (F8 Coupe AED 2,500,
    Urus AED 2,300 / AED 3,000, AED 10,000 deposit, AED 15/km). → Not used.

### Images
15. **The MG ZS main photo is low-resolution (600×375) and its filename
    (`white_mg-zs_2025_6344_main_058a…`) suggests a dealer or stock image.** It is the only exterior shot
    of the MG. → Used, but flagged. *Please confirm the rights or supply your own photo.*
16. Two background-removed cut-outs on a green ground (Audi Q2 460×266, Boxster 618×404).
    → Not used.
17. Duplicates: featured images are crops or re-saves of gallery images (JPG + WebP pairs), and one
    exact duplicate (Mustang `452211234.jpeg`). → Removed from the new galleries.
18. **Maximum resolution is about 1,600–2,200 px wide.** That is fine for cards and the Quick View,
    but marginal for a full-bleed hero on large retina screens. *Please supply the original camera
    files for the 5–6 hero cars* (see Hero shortlist below).

### Links and contact
19. **Hero-slider links redirect to the wrong cars:** `/autos/bmw-x2-2025-white/` → Lamborghini
    EVO Spider; `/autos/gmc-yukon-elevation-2025-black/` → Ferrari F8 Spider.
20. **Footer links "About Us" and "Rental Policy" return 404.**
21. **JW Marriott Hotel Marina counter is not mentioned anywhere on the live site** (searched all
    content). The new site shows it by name, with the main WhatsApp and phone numbers and Google
    Maps directions to the hotel. *Please confirm the counter's hours, phone, and exact location
    inside the hotel.*
22. **Opening hours are not published on the live site.** → Not shown.
23. "24/7 Roadside Assistance 800-4845" — *please confirm this number belongs to Formula Drive's
    roadside service provider.*
24. The Twitter link points to `twitter.com/formulaonedubai`. *Please confirm that handle.*

### Reviews
25. The homepage widget (Trustindex) shows **"47 Google reviews"** but doesn't expose an average
    rating. The design reference claims "4.8★", which can't be verified from the live site. → Not
    shown. The new site quotes reviews word for word, with the reviewer's name and "Posted on Google".
26. The widget's first review is a complaint about WhatsApp handling, apparently from a vehicle
    owner or partner rather than a renter. It is not quoted on the new site, but the business should
    be aware of it.

## Hero shortlist (best existing photographs)

| Car | File | Size |
| --- | --- | --- |
| Lamborghini Huracán EVO Spyder | `public/fleet/lamborghini-evo-spider/01.webp` | 1915×1200 |
| BMW 4 Series Convertible | `public/fleet/bmw-4-series-convertible/01.webp` | 2071×1200 |
| Porsche 911 GTS Cabriolet | `public/fleet/porsche-911-gts-spider/01.webp` | 1933×1200 |
| Lamborghini Urus | `public/fleet/rent-lamborghini-urus/01.jpg` | 1600×1200 |
| Mercedes-Benz G63 AMG | `public/fleet/mercedes-benz-g63/02.webp` | 1600×1200 |
| Ferrari F8 Spider | `public/fleet/ferrari-f8-spider/02.jpg` | 1626×1200 |

## SEO note

Do not delete or redirect the 15 live `/autos/…` URLs until an SEO migration plan is approved.
The new one-page site links each Quick View to the car's live URL (`liveUrl` in the dataset), so
both can run side by side.
