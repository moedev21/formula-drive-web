#!/usr/bin/env python3
"""Build the curated fleet dataset from the live-site snapshot in data/source/.

Inputs  (captured from https://formuladriverentacar.com, see data/source/snapshot/CAPTURED_AT)
  data/source/snapshot/wp-pixad-autos.json   WordPress REST export of the 15 published cars
  data/source/snapshot/detail-extract.json   gallery URLs, displayed prices, parsed spec lines
  data/source/image-manifest-raw.json        every downloaded image with size and md5
Outputs
  public/fleet/<slug>/<nn>.<ext>             selected images, original bytes (no recompression)
  src/data/fleet.json                        curated dataset used by the site
  data/fleet-inventory.csv                   flat inventory for review against the live site

Run from the project root:  python3 scripts/build-fleet.py
"""
import csv
import datetime
import html
import json
import os
import re
import shutil

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "source")

# Per car: display name, brand, model, categories (the brief's tabs), and which downloaded
# images to use, in gallery order (indices into that car's images in image-manifest-raw.json;
# first = card image). Images were chosen by eye from contact sheets: uncropped originals
# preferred, exact/near duplicates and low-res cut-outs dropped.
CURATION = {
    "ferrari-f8-spider": dict(
        name="Ferrari F8 Spider", brand="Ferrari", model="F8 Spider", tagline="Ultimate Open-Top Supercar",
        categories=["supercars", "convertibles"], images=[0, 3, 6, 2, 4, 5, 7]),
    "lamborghini-evo-spider": dict(
        name="Lamborghini EVO Spider", brand="Lamborghini", model="EVO Spider", tagline="Open-Top Supercar Performance",
        categories=["supercars", "convertibles"], images=[7, 0, 2, 5, 6]),
    "rent-lamborghini-urus": dict(
        name="Lamborghini Urus (Blue)", brand="Lamborghini", model="Urus", tagline="Features a 4.0-liter Twin-Turbo V8 Engine",
        categories=["supercars", "suvs"], images=[0, 2, 1, 3, 4, 5, 6, 9]),
    "porsche-911-gts-spider": dict(
        name="Porsche 911 GTS Spider", brand="Porsche", model="911 GTS Spider", tagline="Iconic Open-Top Performance",
        categories=["sports", "convertibles"], images=[3, 2, 10, 9, 4, 5, 6, 7]),
    "mercedes-benz-g63": dict(
        name="Mercedes-Benz G63", brand="Mercedes-Benz", model="G63", tagline="Sport Luxury SUV",
        categories=["suvs"], images=[0, 2, 4, 5, 7, 3, 8]),
    "porsche-cayenne-coupe": dict(
        name="Porsche Cayenne Coupe", brand="Porsche", model="Cayenne Coupe", tagline="Sporty Luxury SUV Redefined",
        categories=["suvs", "sports"], images=[2, 5, 4, 3, 6, 7, 8, 9]),
    "jeep-wrangler-rubicon-392-hemi-v8-6-4l": dict(
        name="Jeep Wrangler Rubicon 392", brand="Jeep", model="Wrangler Rubicon 392", tagline="Extreme V8 Beast",
        categories=["suvs"], images=[2, 0, 3, 5, 4]),
    "porsche-718-boxster-convertible": dict(
        name="Porsche 718 Boxster Convertible", brand="Porsche", model="718 Boxster Convertible", tagline="Pure Open-Top Driving Precision",
        categories=["sports", "convertibles"], images=[0, 3, 5, 7, 6, 4, 8, 9]),
    "ford-mustang-gt-v8-5-0l": dict(
        name="Ford Mustang GT V8", brand="Ford", model="Mustang GT V8", tagline="Ford Mustang GT Coupe V8",
        categories=["sports"], images=[0, 2, 4, 1, 5, 7, 6, 8, 10]),
    "bmw-4-series-convertible": dict(
        name="BMW 4 Series Convertible", brand="BMW", model="4 Series Convertible", tagline="Premium Open Top",
        categories=["convertibles"], images=[11, 0, 2, 5, 3, 7, 8, 9, 6]),
    "mercedes-c-class": dict(
        name="Mercedes C Class", brand="Mercedes-Benz", model="C Class", tagline="Luxury Meets Intelligent Performance",
        categories=[], images=[0, 2, 6, 5, 8, 9, 10]),
    "gmc-yukon-elevation": dict(
        name="GMC Yukon Elevation", brand="GMC", model="Yukon Elevation", tagline="Full-Size Power & Premium Presence",
        categories=["suvs"], images=[0, 3, 2, 1, 4, 7, 8, 6, 5]),
    "bmw-x2": dict(
        name="BMW X2", brand="BMW", model="X2", tagline="Sporty Compact Luxury SUV",
        categories=["suvs"], images=[0, 6, 8, 9, 7, 11, 12, 2, 3]),
    "audi-q2": dict(
        name="Audi Q2", brand="Audi", model="Q2", tagline="Premium Compact SUV",
        categories=["suvs", "economy"], images=[0, 4, 5, 9, 6, 7, 8]),
    "mg-zs-lux-2025": dict(
        name="MG ZS Lux 2025", brand="MG", model="ZS Lux", tagline="Economy Compact SUV",
        categories=["suvs", "economy"], images=[0, 1, 3, 2, 4, 5]),
}

# Cars added after the live-site snapshot, supplied directly by the client. Each copies the
# specs, summary, terms and categories of `like` (same model, different colour) and uses the
# client's photos in data/source/added/<slug>/, in file order (first = card image).
# `positions` sets the CSS object-position for photos whose subject is off-centre in a 4:3 crop.
ADDED = {
    "lamborghini-urus-green": dict(
        id=900001, like="rent-lamborghini-urus", added="2026-10-25",
        name="Lamborghini Urus (Green)", tagline="Features a 4.0-liter Twin-Turbo V8 Engine", price=2500,
        alts=["front three-quarter view with the Burj Khalifa behind", "front view with the Dubai skyline",
              "steering wheel and digital instrument cluster", "white leather front seats and panoramic roof",
              "centre console touchscreens"],
        positions={0: "50% 85%", 1: "50% 85%"}),
}

# Spec lines that describe other variants of the model, not the car offered.
VARIANT_LINES = {"E-Hybrid", "Cayenne S", "Turbo E-Hybrid", "Turbo GT"}

# Conditions published on the live site that apply to every rental.
GENERAL_CONDITIONS = [
    "Minimum rental period of 24 hours; daily, weekly, monthly and longer rentals available.",
    "Standard mileage limit and insurance are included in all prices.",
    "Security deposit between AED 1,000 and AED 10,000 depending on the car, ideally by credit card. A zero-deposit option is available.",
    "Drivers must be 21 or older with a valid driving licence and ID.",
    "UAE residents: UAE driving licence and Emirates ID. Visitors: passport, visit visa, home-country licence and International Driving Permit.",
]


def text_of(s):
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def main():
    autos = json.load(open(os.path.join(SRC, "snapshot", "wp-pixad-autos.json")))
    details = {d["slug"]: d for d in json.load(open(os.path.join(SRC, "snapshot", "detail-extract.json")))}
    manifest = json.load(open(os.path.join(SRC, "image-manifest-raw.json")))
    homepage = open(os.path.join(SRC, "snapshot", "homepage.txt")).read()

    out_img_root = os.path.join(ROOT, "public", "fleet")
    shutil.rmtree(out_img_root, ignore_errors=True)
    cars, rows = [], []

    for a in autos:
        slug = a["slug"]
        cur = CURATION[slug]
        det = details[slug]
        imgs_all = [m for m in manifest if m["slug"] == slug]

        # Price: the homepage listing is the confirmed source (client instruction).
        live_title = text_of(a["title"]["rendered"])
        m = re.search(r"\n([\d,]+)\.00\n\$ \+VET\n(?:Add To Compare\nRemove From Compare\n)?" + re.escape(live_title.strip()), homepage)
        home_price = int(m.group(1).replace(",", "")) if m else None
        api_price = int(float(a["_auto_price"])) if a["_auto_price"] else None
        detail_price = int(det["price_display"].split(".")[0].replace(",", "")) if det.get("price_display") else None
        # Price: the live homepage listing is the source (client instruction, 22 Oct 2026). Names and
        # taglines come from the client's list in CURATION.
        price = home_price
        price_status = "verified" if home_price and home_price == api_price == detail_price else "conflict"

        # Specs exactly as listed on the live detail page (approximate values kept as "~").
        specs = [
            {"label": k, "value": re.sub(r"\s+", " ", v)}
            for k, v in det["specs"].items()
            if v and k not in VARIANT_LINES
        ]
        if slug == "ford-mustang-gt-v8-5-0l":
            specs = [{"label": "Engine", "value": "5.0L V8"}]

        conditions = []
        if slug == "ford-mustang-gt-v8-5-0l":
            conditions = [
                "AED 12,000 per month.",
                "Basic comprehensive insurance included.",
                "250 km per day included; AED 3 per additional km.",
                "Security deposit: AED 3,000.",
            ]

        dest = os.path.join(out_img_root, slug)
        os.makedirs(dest, exist_ok=True)
        images = []
        for n, idx in enumerate(cur["images"]):
            src = imgs_all[idx]
            ext = os.path.splitext(src["file"])[1].lower().replace("jpeg", "jpg")
            name = f"{n + 1:02d}{ext}"
            shutil.copyfile(os.path.join(ROOT, src["file"]), os.path.join(dest, name))
            images.append({
                "src": f"/fleet/{slug}/{name}",
                "width": src["w"],
                "height": src["h"],
                "sourceUrl": src["url"],
            })

        # The first paragraph of the live description (the excerpt also repeats the page heading).
        page_lines = [l.strip() for l in open(os.path.join(SRC, "pages", f"{slug}.txt")).read().split("\n") if l.strip()]
        excerpt = re.sub(r"\s+", " ", next((l for l in page_lines if len(l) > 120 and l.startswith("The ")), ""))
        car = {
            "id": a["id"],
            "slug": slug,
            "name": cur["name"],
            "liveTitle": live_title,
            "brand": cur["brand"],
            "model": cur["model"],
            "categories": cur["categories"],
            "tagline": cur["tagline"],
            "pricePerDayAED": price,
            "priceStatus": price_status,
            "vatLabel": "excl. 5% VAT",
            "specs": specs,
            "specsSource": "Live detail page (manufacturer-style reference figures; approximate values kept as listed)",
            "conditions": conditions,
            "summary": excerpt,
            "images": images,
            "liveUrl": a["link"],
            "liveModified": a["modified"],
        }
        cars.append(car)
        rows.append({
            "id": a["id"], "slug": slug, "name": car["name"], "live_title": live_title,
            "brand": car["brand"], "model": car["model"],
            "categories": "|".join(car["categories"]),
            "live_body_terms": "|".join(c[10:] for c in a["class_list"] if c.startswith("auto-body-")),
            "price_shown_aed": price, "price_home_aed": home_price, "price_api": api_price, "price_detail": detail_price,
            "price_status": price_status, "specs_count": len(specs),
            "images_used": len(images), "images_found": len(imgs_all),
            "live_url": a["link"], "live_modified": a["modified"],
        })

    for slug, add in ADDED.items():
        like = next(c for c in cars if c["slug"] == add["like"])
        src_dir = os.path.join(SRC, "added", slug)
        dest = os.path.join(out_img_root, slug)
        os.makedirs(dest, exist_ok=True)
        images = []
        for n, name in enumerate(sorted(os.listdir(src_dir))):
            shutil.copyfile(os.path.join(src_dir, name), os.path.join(dest, name))
            w, h = Image.open(os.path.join(src_dir, name)).size
            img = {"src": f"/fleet/{slug}/{name}", "width": w, "height": h, "sourceUrl": "client-supplied", "alt": add["alts"][n]}
            if n in add["positions"]:
                img["position"] = add["positions"][n]
            images.append(img)
        car = {**like,
               "id": add["id"], "slug": slug, "name": add["name"], "liveTitle": "", "tagline": add["tagline"],
               "pricePerDayAED": add["price"], "priceStatus": "verified", "images": images,
               "liveUrl": "", "liveModified": add["added"]}
        cars.append(car)
        rows.append({
            "id": car["id"], "slug": slug, "name": car["name"], "live_title": "",
            "brand": car["brand"], "model": car["model"], "categories": "|".join(car["categories"]),
            "live_body_terms": "", "price_shown_aed": add["price"], "price_home_aed": None, "price_api": None,
            "price_detail": None, "price_status": f"client-supplied {add['added']}", "specs_count": len(car["specs"]),
            "images_used": len(images), "images_found": len(images), "live_url": "", "live_modified": add["added"],
        })

    # Most expensive first: the order the fleet opens in ("Featured").
    cars.sort(key=lambda c: -(c["pricePerDayAED"] or 0))
    data = {"capturedAt": open(os.path.join(SRC, "snapshot", "CAPTURED_AT")).read().strip(),
            "source": "https://formuladriverentacar.com/",
            "generalConditions": GENERAL_CONDITIONS,
            "cars": cars}
    os.makedirs(os.path.join(ROOT, "src", "data"), exist_ok=True)
    json.dump(data, open(os.path.join(ROOT, "src", "data", "fleet.json"), "w"), indent=2, ensure_ascii=False)
    with open(os.path.join(ROOT, "data", "fleet-inventory.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    for r in rows:
        print(f'{r["name"]:<30} AED {r["price_shown_aed"]!s:>5} (live {r["price_home_aed"]!s:>5})  {r["price_status"]:<9} {r["categories"]:<24} imgs {r["images_used"]}/{r["images_found"]}  specs {r["specs_count"]}')


if __name__ == "__main__":
    main()
