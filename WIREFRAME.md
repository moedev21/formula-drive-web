# Formula Drive — Homepage Wireframe

One scrolling page. Widths: desktop 1440 (designed), tablet 768, phone 390.
`[img]` = real Formula Drive fleet photograph. `▮` = button. Red marks are the only accents.

## The argument (each section exists because of one claim)

| # | Section | Claim | Proof on the page |
| --- | --- | --- | --- |
| 01 | Header | You can book from any point of the page | Sticky bar with the Book Now action |
| 02 | Hero | These are the extraordinary cars you can drive in Dubai | The real fleet, pinned under the headline |
| 03 | Discovery | You can find your kind of car in one tap | Category tabs with live counts |
| 04 | Fleet | Every car, its real price, one tap to enquire | 15 cards, Quick View, WhatsApp |
| 05 | Experience | Booking direct beats an agent | Owner bookings, 0% commission, no third-party fee, zero-deposit option |
| 06 | How it works | It takes three steps | Choose · Confirm · Drive |
| 07 | Locations | You can collect in Dubai Marina | Princess Tower office + JW Marriott Hotel Marina counter, directions |
| 08 | Why Formula Drive | The service holds up | Direct booking, 15-car fleet, 24/7 support, delivery and flexible terms |
| 09 | Reviews + FAQ | Renters vouch for it; your questions are answered | 5 verbatim Google reviews, 8 answers from published policy |
| 10 | Final CTA | Write to us now | WhatsApp, call, email |
| 11 | Footer | — | Logo, anchors, both locations, contact, social, legal |

---

## 01 Header (sticky, 76px; 64px phone)

```
desktop
┌──────────────────────────────────────────────────────────────────────────────┐
│ [LOGO red/black 184px]      Fleet  Experience  About  Locations  Contact  ▮Book now│
└──────────────────────────────────────────────────────────────────────────────┘
phone
┌──────────────────────────────────────┐
│ [LOGO 148px]             ▮Book   ≡   │
└──────────────────────────────────────┘
menu (phone): full-screen charcoal sheet, red/white logo, links at h2 size,
WhatsApp + call, close ✕ (Esc).
```
"About" scrolls to Why Formula Drive (08). "Book now" opens WhatsApp with a general enquiry.

## 02 Hero — the pinned poster (≈240svh desktop, 200svh phone)

```
screen 1 (load)
┌──────────────────────────────────────────────────────────────────────────────┐
│ DRIVE THE                                                                     │  h1, display step,
│ EXTRAORDINARY.                                                                │  pinned (sticky)
│                                                                               │
│        ┌──────────────────────────────────────────────┐   Lamborghini Huracán │
│        │                                              │   EVO Spyder          │
│        │            [img: car 1, 3:2]                 │   AED 3,000 / day     │
│        │                                              │                       │
│        └──────────────────────────────────────────────┘                       │
│ Self-owned supercars, sports cars and SUVs, booked      ▮Explore fleet  Book your drive → │
│ direct from Dubai Marina.                                                     │
└──────────────────────────────────────────────────────────────────────────────┘
screens 2–3: headline stays pinned; the photograph and its caption change to
car 2 … car 5 (Ferrari F8 Spider, Lamborghini Urus, Porsche 911 GTS Cabriolet,
Mercedes-Benz G63 AMG). Then the stage releases into section 03.
```
Phone: headline at 15vw top-left (2 lines), image full width 3:2 beneath, caption under the
image, the supporting line + two buttons stacked below. Reduced motion: no pin, only car 1.

## 03 Vehicle discovery (heading + tabs), directly on top of the fleet grid

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Fifteen cars. One Marina garage.                 h2                          │
│ Every car is ours: no brokers between you and the key.   body               │
│                                                                               │
│ All 15   Supercars 3   Sports 4   SUVs 8   Convertibles 5   Economy 2   Sort: Featured ▾ │
│ ‾‾‾‾‾‾ (red underline slides)                                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```
Phone: tabs become a horizontal scroll row; sort sits on its own line.

## 04 Our fleet (grid, `--grey` stage behind the photos only)

```
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ [img 4:3]         │ │ [img 4:3]         │ │ [img 4:3]         │   3 columns ≥1024
│                   │ │                   │ │                   │   2 columns ≥768
└───────────────────┘ └───────────────────┘ └───────────────────┘   1 column phone
Ferrari F8 Spider             (h3)                                    4 columns ≥1920
Supercar · Convertible        (small, muted)
AED 3,000 / day  excl. VAT    (tabular)       Quick view →   [WA]
```
Quick View: right-hand panel (desktop) / full-screen sheet (phone):
gallery → name → categories → price + VAT → summary → specs table → conditions →
enquiry builder (dates, location) → ▮Enquire on WhatsApp → "View on current site" link.

## 05 Signature driving experience — split stage

```
┌─────────────────────────────────────┬────────────────────────────────────────┐
│                                     │ Book the owner, not an agent.   h2     │
│                                     │                                        │
│   [img: large lifestyle photograph  │ Formula Drive owns every car it rents… │
│    of a fleet car, sticky, 4:5]     │                                        │
│                                     │ Direct owner bookings      0% commission│
│                                     │ No third-party fees   Zero-deposit option│
│                                     │ ▮Book your drive                       │
└─────────────────────────────────────┴────────────────────────────────────────┘
```
The left photograph sticks while the right column scrolls (desktop). Phone: image on top, text below.

## 06 How it works — one verb at a time (3 panels, 100svh each desktop; 80svh phone)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [img full-bleed: car photo, dimmed]                                           │
│                                 CHOOSE                     (centred)          │
│ Pick a car from the fleet and tap Quick view.            (bottom-left, scrim) │
└──────────────────────────────────────────────────────────────────────────────┘
  CONFIRM — Send your dates on WhatsApp; we confirm price, deposit and documents.
  DRIVE   — Collect in Dubai Marina or have the car delivered.
```
The h2 "How it works" is visually hidden but present for screen readers and navigation.

## 07 Our locations — two columns

```
┌──────────────────────────────────────┬───────────────────────────────────────┐
│ Collect in Dubai Marina.    h2       │                                       │
├──────────────────────────────────────┼───────────────────────────────────────┤
│ [img 3:2]                            │ [img 3:2]                             │
│ Dubai Marina — Princess Tower        │ JW Marriott Hotel Marina              │
│ Unit-06, Ground Floor, Princess      │ Formula Drive rental counter          │
│ Tower, Dubai Marina, Dubai           │ (contact via main line)               │
│ WhatsApp · Landline                  │ WhatsApp · Landline                   │
│ Get directions →                     │ Get directions →                      │
└──────────────────────────────────────┴───────────────────────────────────────┘
```

## 08 Why Formula Drive — four cards dealt into a row (desktop: pinned fan; phone: swipe row)

```
┌────────────┐┌────────────┐┌────────────┐┌────────────┐   on charcoal ground
│ Direct     ││ Diverse    ││ Professional││ Convenient │   cards: white, grey,
│ booking    ││ fleet      ││ support     ││ rental     │   red, grey-2
│ [img]      ││ [img]      ││ [img]       ││ [img]      │
│ sentence   ││ sentence   ││ sentence    ││ sentence   │
└────────────┘└────────────┘└────────────┘└────────────┘
```

## 09 Reviews + FAQ

```
Reviews: heading "Renters, in their own words." + "47 Google reviews" link
  quote (h3 statement size)        — name, car, "Posted on Google"
  5 quotes, horizontal scroll-snap row with prev/next buttons
FAQ: wide heading "Before you drive." (5.5vw) at left
     questions indented to columns 5–12, <details>, no rules, grey tile when open
```

## 10 Final booking CTA — charcoal, full-bleed photograph left half

```
┌─────────────────────────────────────┬────────────────────────────────────────┐
│ [img: car, right side calm]          │ Your car is waiting in the Marina. h2 │
│                                     │ Message us with dates; we reply fast.  │
│                                     │ ▮WhatsApp +971 55 945 3676            │
│                                     │ Call  +971 4 421 4433                 │
│                                     │ formuladriverentacar@gmail.com         │
└─────────────────────────────────────┴────────────────────────────────────────┘
```

## 11 Footer — charcoal, red/white logo

```
[LOGO red/white]          Fleet  Experience  About  Locations  Contact
Princess Tower address    JW Marriott counter     WhatsApp / landline / email / roadside
Instagram  Facebook  X
© 2026 Formula Drive Rent a Car LLC   Terms   Privacy        Photo credits
```
Terms and Privacy link to `#` pages flagged for the client (the live site's policy page returns 404).
