# Formula Drive — Design System

Single-page website for Formula Drive Rent a Car, Dubai Marina.
This file is the source of truth for how the site looks, moves and behaves.
Approved Formula Drive branding overrides every external reference, including the
skill outputs listed in §14.

---

## 1. Visual theme

A white gallery for the cars. The page behaves like a printed automotive catalogue:
a white ground, charcoal type, one red, and large photographs of the actual fleet
doing the talking. Premium comes from scale, restraint and real pictures,
not from chrome, gradients or glass.

**The idea.** The hero line *DRIVE THE EXTRAORDINARY.* holds its place while the
Formula Drive fleet changes beneath it, one car per scroll step, like turning the
pages of a catalogue. Everything after the hero releases into calm, readable sections.

**The live thing.** The enquiry builder in the Quick View: choose the car, the dates
and the pick-up location, and the page writes a WhatsApp message containing those
details. With JavaScript off it falls back to a plain `wa.me` link.

---

## 2. Logo usage

Source files (unchanged) live in `brand/original/`. Web versions in `public/brand/`
keep the artwork untouched. Only the export's background square was removed and
the canvas trimmed to the artwork (+2 units of padding).

| File | Artwork | Use on |
| --- | --- | --- |
| `formula-drive-logo-red-black.svg` | Car mark charcoal, FORMULA red, DRIVE + RENT A CAR charcoal | **Header**, any white or soft-grey ground |
| `formula-drive-logo-red-white.svg` | Car mark white, FORMULA red, DRIVE + RENT A CAR white | Charcoal CTA, footer, mobile menu on charcoal |
| `formula-drive-icon-black-red.svg` | Car mark only, charcoal with red light line | Favicon / app icon on light, compact marks |
| `formula-drive-icon-white-red.svg` | Car mark only, white with red light line | Compact mark on charcoal or photography |

Why the full lockup and not the Black & Red Icon in the header: the icon carries no
name, and the brief forbids text standing in for the logo, so the lockup is the only
variant that names the brand on its own.

Rules
- Minimum width of the lockup: 140px (desktop header 184px, mobile 148px).
- Clear space on all sides: the cap height of "FORMULA".
- Never recolour, stretch, outline, add effects to, or re-typeset the logo.
- Never place the red/black lockup on photography or charcoal; use red/white there.
- Red/white lockup only on `--charcoal` or darker, or on a photograph that is dark in that area.
- The icon's hairline strokes disappear below ~28px; at favicon sizes use the icon at full
  bleed on a white tile.

---

## 3. Colour

The brand fixes four colours. `#EDEDED` is the grey of the official logo board and is
used as the soft-grey surface.

| Token | Hex | Role | Contrast |
| --- | --- | --- | --- |
| `--white` | `#FFFFFF` | Page ground | |
| `--grey` | `#EDEDED` | Surface step (fleet stage, FAQ open row, inputs) | |
| `--grey-2` | `#F6F6F6` | Lighter step for a second surface | |
| `--charcoal` | `#262626` | Ink; inverse ground (CTA, footer, modal scrim) | 15.1:1 on white |
| `--muted` | `#5C5C5C` | Secondary text only | 6.7:1 on white, 5.8:1 on `--grey` |
| `--red` | `#CC1919` | Primary action, active filter, one red word per screen at most | 5.6:1 on white; white on red 5.6:1 |
| `--red-press` | `#A81414` | Pressed/hover state of red buttons | 7.6:1 on white |
| `--line` | `#D4D4D4` | Form fields and the specs table only | |

Proportions: about 80% white, 12% charcoal, 6% grey, 2% red.
Red is spent on Book / WhatsApp actions and the active filter. It never fills a
section, never colours a headline word for emphasis, and never appears as decoration.

---

## 4. Typography

One family: **Archivo** (Google Fonts, variable: weight 100–900, width 62–125).
Its expanded width echoes the logo's wide geometric wordmark without copying it.

| Step | Use | Desktop | Phone | Settings |
| --- | --- | --- | --- | --- |
| `display` | Hero line, pinned; the three verbs | fitted to the frame: `min(172px, 100cqi / 11.1)` (≈122px at 1440) | `100cqi / 8.75` (≈41px at 390) | wdth 125 (wdth 100 on phones), wght 700, uppercase, tracking -0.03em, leading 0.9 |
| `h2` | Section headings | `clamp(34px, 5vw, 84px)` (72px at 1440) | 34px | wdth 112, wght 650, tracking -0.025em, leading 0.98 |
| `h3` | Car names, statements, FAQ questions, quotes | `clamp(21px, 1.6vw, 26px)` (23px at 1440) | 21px | wdth 100, wght 600, tracking -0.01em, leading 1.12 |
| `body` | Running text, buttons, form fields | 18px | 18px | wdth 100, wght 400, leading 1.55, measure 45–68ch |
| `small` | Captions, price meta, legal | 14px | 14px | wdth 100, wght 500, leading 1.45 |

The display size is calculated from the measured width of "EXTRAORDINARY." (8.59em at wdth 100,
10.96em at wdth 125) inside a size container, so the headline fills the frame and never overflows.
Measured on the built page: 14 / 18 / 23 / 72 / 122 / 212 px.

- Five sizes, no more. Prices use `font-variant-numeric: tabular-nums`.
- Headlines: two lines or fewer at every width; left-aligned; centred only once (the final CTA).
- No eyebrow labels, no letter-spaced tiny caps, no monospace, no styled accent words.
- Fallback stack: `Archivo, "Helvetica Neue", Arial, sans-serif`; loaded with `next/font` (self-hosted, `display: swap`).

---

## 5. Grid & spacing

- 12 columns, gutter 24px (16px phone).
- Outer margin `--margin: clamp(16px, 3vw, 48px)`, equal on both sides, everywhere.
- Max content width 1680px; photography may run full-bleed.
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 200.
- Section gap: 160–200px desktop, 128 tablet, 96 phone. Gaps inside a section are always smaller.
- Surfaces are separated by a tone step (white → `--grey`), never by rules or shadows.

## 6. Breakpoints

| Name | Min width | Notes |
| --- | --- | --- |
| base | 0 | Designed at 390 (also checked at 360) |
| `md` | 768 | Tablet portrait: 2-column fleet |
| `lg` | 1024 | Desktop nav replaces menu button; 3-column fleet |
| `xl` | 1440 | Primary design width |
| `2xl` | 1920 | Wide: type caps at clamp max, 4-column fleet |

Desktop first in design, mobile first in CSS.

---

## 7. Components

**Buttons** — square corners (radius 0), one shape everywhere, 52px tall (48px min touch),
padding 0 28px, `small`-step label at 16px wght 600, sentence case.
- Primary: red fill, white text; hover/press `--red-press`; press `scale(0.98)`.
- Secondary: charcoal fill, white text.
- On charcoal: white fill, charcoal text.
- Text link: charcoal, underline offset 4px, thickness 1px → 2px on hover.
- WhatsApp buttons carry the WhatsApp glyph (16px, inline SVG) left of the label.
- Focus: 2px solid `--charcoal` outline, 3px offset (white outline on charcoal grounds).

**Header** — white bar, 76px (64px phone): logo left, five anchor links, Book Now (primary).
Sticky. At the top of the page the bar is transparent over the white hero; after 24px of
scroll it takes the white ground and a 1px `--line` underside appears (functional
separation of a floating bar, the one allowed line outside forms). Active section link
is charcoal wght 600 with a 2px red underline; others `--muted`.
Phone: logo + Book (WhatsApp) + menu button; menu opens a full-screen charcoal sheet with the
red/white logo, links at h2 size, contact lines and a close button; focus trapped; Esc closes.

**Filter tabs** — a row of text buttons at `body` size with live counts; they wrap onto two
lines on phones (never scroll off the edge). Active: charcoal semibold text + a red 2px underline
that grows in. `role="tablist"` semantics are *not* used
(they filter one list); implemented as a toggle group with `aria-pressed`.

**Car card** — no border, no shadow, square corners. The card is one link (photo, name, category,
price, "Quick view") that opens Quick View; without JavaScript it goes to the car's live page. Photo
on `--grey` at 4:3, name (`h3`), category (small, muted), price ("AED 2,500 / day excl. 5% VAT",
tabular, or "Price on request"). The WhatsApp button (48px, red) sits beside the link, level with
the name, never nested inside it. Hover: image `scale(1.03)` over 500ms, name underline appears.

**Quick View** — native `<dialog>` element. Desktop: right-hand panel 640px wide, full height,
slides in 24px from the right with opacity. Phone: full-screen sheet rising 24px. Contains
gallery (main image + thumbnails, arrow keys move), name, category, specs as a real
`<table>`, price with VAT label, rental conditions, enquiry builder, WhatsApp button,
close button. Focus moves to the dialog heading on open and returns to the triggering
card on close. Esc closes; clicking the scrim closes; body scroll is locked.
The only element with a shadow (it floats).

**Forms (enquiry builder)** — labels above fields at `small` 14px wght 600, fields 52px tall,
1px `--line` border, `--white` fill, square, focus border charcoal 2px. Inline validation
on blur with text, never colour alone. Fields: pick-up date, return date, location (Dubai
Marina — Princess Tower / JW Marriott Hotel Marina counter), name (optional). Output: a
prefilled WhatsApp message; nothing pretends a booking is confirmed.

**FAQ** — `<details>`/`<summary>`; question at `h3`, 36px between rows, no rules; open row
gets a `--grey` tile behind it. Chevron of two 2px strokes rotates 180°.

**Location block** — photograph, location name (`h3`), address, hours (to confirm),
phone, WhatsApp, and "Get directions" (Google Maps `dir` link). The JW Marriott block
names it plainly as *the Formula Drive rental counter at JW Marriott Hotel Marina*; the
hotel's own logo is never used and no partnership is implied.

---

## 8. Depth

Flat. No shadows on anything at rest. Exactly two things float and carry a shadow:
the Quick View dialog and the mobile menu (`0 24px 64px rgb(0 0 0 / 0.18)`).
The sticky header separates with its 1px line, not a shadow.

---

## 9. Image treatment

- Only real Formula Drive photographs of real Formula Drive cars represent the fleet.
  Never a stock photo of a model presented as theirs.
- Fleet images: 4:3 landscape crops on `--grey`, `object-fit: cover`, focal point stored
  per image in the dataset; square corners; no filters, no overlays.
- Hero/pinned run: the 5–6 best-quality fleet photographs, same crop (3:2), same treatment.
- Location photography: licensed Dubai Marina photographs (Wikimedia Commons), captioned "Dubai
  Marina" and credited in the footer. No photo is presented as the JW Marriott hotel.
- Video: the client's own portrait Ferrari F8 Spider clips, muted loops (desktop hero pane, Experience
  section). They play only on screen, always have a pause button, show a still under reduced motion,
  and use a lazy optimised poster so they never compete with the hero photograph.
- Text on photographs only over a neutral scrim limited to the text's area.
- `next/image` everywhere: AVIF/WebP, `sizes` set per layout, hero image `priority`,
  every image with width, height and descriptive alt ("Ferrari F8 Tributo in red, front three-quarter").

---

## 10. Motion

Weighting (design-motion-principles): **Jakub primary** (production polish), **Jhey secondary**
(the one signature moment), **Emil** for nav, filters and forms.

Tokens
```
--ease-out:   cubic-bezier(0.22, 1, 0.36, 1)    /* arrivals */
--ease-in:    cubic-bezier(0.55, 0, 1, 0.45)    /* departures */
--ease-inout: cubic-bezier(0.65, 0, 0.35, 1)    /* state change while visible */
--dur-1: 160ms  (hover, press, underline)
--dur-2: 280ms  (filter, menu items, tabs)
--dur-3: 480ms  (section reveals, dialog enter)
--dur-4: 900ms  (hero entrance)
```

| Moment | Recipe | Frequency gate |
| --- | --- | --- |
| Hero entrance | Display words rise 32px + opacity, 90ms stagger; supporting line and buttons follow; the photograph rises 24px and settles from 1.02 (transform only, so the LCP image paints on the first frame) | Once per visit |
| Pinned run (signature) | `position: sticky` title; car photographs crossfade/translate under it per step; IntersectionObserver, no scroll hijack | Scroll |
| Section reveals | Heading → text → picture, 20px rise + opacity + 4px blur, 70ms stagger, once; the How It Works verbs reveal the same way inside their panels (not pinned) | Once per section |
| Card hover | Image scale 1.03, 500ms ease-out; underline 160ms | Frequent → subtle |
| Filter change | Leaving cards fade 120ms (no travel); entering cards opacity + 8px rise, 280ms, 30ms stagger; View Transitions API where supported | Frequent → fast |
| Quick View | Enter 480ms: 24px slide + opacity; exit 200ms: 12px + opacity (subtler) | Occasional |
| Header | Background/line transition 280ms; active-link underline slides 280ms | Frequent → fast |
| Keyboard actions | Instant | — |

Rules: transform, opacity and filter only. No looping attention-seekers, no parallax beyond the
hero, no scroll-jacking. `prefers-reduced-motion: reduce` → all travel removed, content shown in
its final state, crossfades become instant swaps. No animation library: CSS + small hooks.

---

## 11. Accessibility

- WCAG 2.2 AA. Text contrast ≥ 4.5:1 (all tokens above pass on their grounds).
- One `h1` (the hero line); one `h2` per section; landmarks: `header`, `nav`, `main`, `footer`.
- Skip link to `#main` as the first focusable element.
- Every interactive element reachable by keyboard, visible focus, 48×48px minimum target.
- Dialog and mobile menu: focus trap, Esc to close, focus restored to the trigger, `inert` page behind.
- Filters announce results ("Showing 6 supercars") in a polite live region.
- Images: meaningful alt; decorative photography `alt=""`.
- Everything works with JavaScript off except the Quick View (cards then link to WhatsApp).
- `lang="en"`, `dir="ltr"`; copy written to allow a future Arabic `rtl` version (logical CSS properties).

---

## 12. Content rules

- Every price, spec, claim, review and contact detail comes from the dataset in
  `src/data/`, with a `source` and `status` (`verified` / `to-confirm` / `conflict`).
- Nothing `to-confirm` or `conflict` is shown as fact on the page: prices fall back to
  "Price on request", specs are omitted, and the inventory report lists them.
- Prices: "AED 2,500 / day" + VAT label. The VAT label is decided once the live site
  confirms whether prices include 5% VAT; until then the label reads "excl. VAT, to confirm"
  in the dataset and the page shows "Price on request".
- No invented reviews, ratings, customer counts or awards.

---

## 13. Do / Don't

Do: large real cars, white space with a purpose, one red action per screen, sentence-case
buttons, full content in every section.
Don't: gradients, glass, glows, shadows at rest, pill badges, eyebrow labels, icon-topped
feature card rows, 01/02/03 numbering, hairline grids, stock "luxury" photos, invented proof.

---

## 14. Sources and how they were applied

- **taste-skill** — direction *The pinned poster* (seed 1745279837), `--keep palette,type`.
  Adopted: pinned hero title over a changing series, "one verb at a time" for How It Works,
  wide-heading FAQ, invitation-over-cropped-name footer, house rules. Overridden by the brief:
  dealt hero "card over a dim room" (brief requires a white page with a car photograph), the dealt
  "Field and farm" photographs (irrelevant to the subject; not used), and the no-card-grid rule
  for the fleet (the brief requires filterable car cards).
- **ui-ux-pro-max** — taken: scroll-storytelling pattern, pre-delivery checklist, 375/768/1024/1440
  checks. Rejected: Liquid Glass style, gold accent and Cormorant/Montserrat pairing (conflict
  with the brand palette and the no-glass rule).
- **design-motion-principles** — Create mode, weighting above; cookbook enter/exit recipes;
  gotchas checklist applied.
- **awesome-claude-design** — a link index of third-party DESIGN.md files (getdesign.md is not
  reachable from this environment). Its 9-part DESIGN.md structure shaped this file; the
  automotive entries (Ferrari, Tesla, Bugatti) informed only the principle of photography-first
  sparseness. No brand's tokens were copied.
