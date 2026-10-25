// Business content for the homepage. Every fact here comes from formuladriverentacar.com
// (snapshot in data/source/). Items the client must confirm are marked `toConfirm` and
// listed in FLEET-AUDIT.md.

import { cars } from "./fleet";

export const business = {
  name: "Formula Drive Rent a Car",
  shortName: "Formula Drive",
  url: "https://www.formuladriverentacar.com",
  whatsapp: { display: "+971 55 945 3676", e164: "971559453676" },
  landline: { display: "+971 4 421 4433", tel: "+97144214433" },
  roadside: { display: "800-4845", tel: "8004845" },
  hours: "Daily, 9 am – 6 pm",
  email: "formuladriverentacar@gmail.com",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/formuladrivedubai/" },
    { label: "Facebook", href: "https://www.facebook.com/formuladriverentacardubai/" },
    { label: "X", href: "https://x.com/formulaonedubai" },
  ],
  googleReviews: {
    count: 47,
    // The Dubai Marina (Princess Tower) Google Business Profile.
    href: "https://www.google.com/search?kgmid=/g/11bbwqtfrz",
  },
} as const;

export const nav = [
  { label: "Fleet", href: "/#fleet" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#why" },
  { label: "Locations", href: "/#locations" },
  { label: "Contact", href: "/#contact" },
] as const;

export type Location = {
  id: string;
  name: string;
  detail: string;
  addressLines: string[];
  hours: string;
  phone: { display: string; tel: string; whatsapp?: string; label: string };
  directions: string;
  // Google Business Profile for this location (by Knowledge Graph ID, which does not change).
  google: string;
  note?: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
    // Third-party photographs carry the credit their licence requires, shown in the caption.
    credit: { author: string; license: string; licenseUrl: string; source: string };
  };
};

export const locations: Location[] = [
  {
    id: "princess-tower",
    name: "Dubai Marina — Princess Tower",
    detail: "Formula Drive office",
    addressLines: ["Unit-06, Ground Floor, Princess Tower", "Dubai Marina, Dubai, UAE"],
    hours: "Daily, 9 am – 6 pm",
    phone: { display: "+971 4 421 4433", tel: "+97144214433", label: "Landline" },
    google: "https://www.google.com/search?kgmid=/g/11bbwqtfrz",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Formula+Drive+Rent+a+Car+Princess+Tower+Dubai+Marina",
    image: {
      src: "/locations/dubai-marina-skyline.jpg",
      width: 2400,
      height: 1600,
      alt: "The Dubai Marina skyline seen from the sea",
      caption: "Dubai Marina",
      credit: {
        author: "Norlando Pobre",
        license: "CC BY 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
        source: "https://commons.wikimedia.org/wiki/File:Dubai_Marina_Skyline.jpg",
      },
    },
  },
  {
    id: "jw-marriott-marina",
    name: "JW Marriott Hotel Marina",
    detail: "Formula Drive rental counter",
    addressLines: ["JW Marriott Hotel Marina", "Dubai Marina, Dubai, UAE"],
    hours: "Daily, 9 am – 6 pm",
    phone: { display: "+971 55 791 6550", tel: "+971557916550", whatsapp: "971557916550", label: "Counter" },
    google: "https://www.google.com/search?kgmid=/g/11p1_7r2cy",
    directions: "https://www.google.com/maps/dir/?api=1&destination=JW+Marriott+Hotel+Marina+Dubai",
    image: {
      src: "/locations/dubai-marina-canal.jpg",
      width: 2400,
      height: 1500,
      alt: "The Dubai Marina canal and promenade",
      caption: "Dubai Marina",
      credit: {
        author: "A.Savin",
        license: "FAL 1.3",
        licenseUrl: "https://artlibre.org/licence/lal/en/",
        source: "https://commons.wikimedia.org/wiki/File:UAE_Dubai_Marina_img1_asv2018-01.jpg",
      },
    },
  },
];

// Claims published on the live homepage.
export const experience = {
  heading: "Book the owner, not an agent.",
  body: "Every car in the Formula Drive fleet is self-owned, so you deal directly with the people who keep the keys. No brokers, no third-party fees, and the price you are quoted is the price you pay.",
  points: [
    { title: "Direct from the owner", text: "Talk to the team that owns and prepares the car." },
    { title: "Airport and hotel delivery", text: "Timed to your flight, or to your hotel or home." },
    { title: "WhatsApp, 24/7", text: "Ask about any car, any hour, and get an answer." },
    { title: "Zero-deposit option", text: "Available on request, alongside standard deposits." },
  ],
  video: {
    src: "/video/ferrari-f8-badge",
    label: "Close-up of the Ferrari badge and wheel on the Formula Drive Ferrari F8 Spider",
  },
};

export const steps = [
  {
    verb: "Choose",
    text: "Pick a car and tap it to see the price, specifications and terms.",
    image: { src: "/fleet/porsche-911-gts-spider/01.webp", width: 1933, height: 1200, alt: "Porsche 911 GTS Cabriolet in a covered car park" },
  },
  {
    verb: "Confirm",
    text: "Send your dates on WhatsApp. We confirm the price, deposit and documents before you commit.",
    image: { src: "/fleet/bmw-4-series-convertible/01.webp", width: 2071, height: 1200, alt: "BMW 4 Series Convertible against the Dubai skyline" },
  },
  {
    verb: "Drive",
    text: "Collect in Dubai Marina, or have the car delivered to your hotel, home or the airport.",
    image: { src: "/fleet/mercedes-benz-g63/02.webp", width: 1600, height: 1200, alt: "Mercedes-Benz G63 AMG parked in Dubai Marina" },
  },
];

export const reasons = [
  {
    title: "Direct booking",
    text: "WhatsApp, call or email the people who own the car. Your booking goes straight to them, with no agency in between.",
    image: { src: "/fleet/porsche-cayenne-coupe/02.webp", width: 1559, height: 1200, alt: "Porsche Cayenne Coupe from the rear" },
  },
  {
    title: `${cars.length} cars`,
    text: "From an MG ZS at AED 170 a day to a Ferrari F8 Spider at AED 3,000.",
    image: { src: "/fleet/ferrari-f8-spider/01.jpg", width: 1261, height: 673, alt: "Ferrari F8 Spider in yellow" },
  },
  {
    title: "24/7 support",
    text: "WhatsApp answered around the clock, and roadside assistance on 800-4845 if anything goes wrong.",
    image: { src: "/fleet/mercedes-c-class/01.jpg", width: 1653, height: 1200, alt: "Mercedes-Benz C 200 in white" },
  },
  {
    title: "Delivered to you",
    text: "Daily, weekly or monthly, with delivery to your hotel, home or the airport.",
    image: { src: "/fleet/porsche-718-boxster-convertible/01.jpg", width: 1200, height: 907, alt: "Porsche 718 Boxster in blue with the Dubai skyline" },
  },
];

// Verbatim Google reviews shown on the live homepage (Trustindex widget).
export const reviews = [
  {
    author: "Kevin Fellberg",
    car: "Lamborghini Urus",
    quote:
      "I rented a Lamborghini Urus from Formula Drive for two weeks and couldn’t have asked for a better experience. The car was delivered straight to the airport when I arrived, which was super convenient and made the whole start of the trip really easy.",
  },
  {
    author: "Jennica Juva",
    car: "Ferrari F8",
    quote:
      "We rented a Ferrari F8 in Dubai and were extremely impressed with the service. … We also appreciated the convenience of having the car delivered to our hotel on Palm Jumeirah and picked up again at the end of the rental.",
  },
  {
    author: "Vitalii Vinokurov",
    car: "Porsche Boxster",
    quote:
      "Rented a 2024 Porsche Boxster and it was a 10/10. The car was in perfect condition, service was super responsive, and everything was handled quickly and smoothly.",
  },
  {
    author: "Kevin Fellberg",
    car: "Lamborghini Urus",
    quote:
      "What really impressed me was their customer service. They’re super easy to reach on WhatsApp anytime (literally 24/7), and really friendly and helpful.",
  },
  {
    author: "ali colak",
    car: "Porsche 718 Boxster",
    quote:
      "I rent a blue porsche 718 boxster cabrio it was a wonderful experience. … I got my deposit %100 back quickly. They are so reliable.",
  },
];

// Answers drawn from the rental terms published on the live homepage and detail pages.
export const faqs = [
  {
    q: "What documents do I need?",
    a: "UAE residents: a UAE driving licence and Emirates ID. Visitors: passport, visit visa, home-country driving licence and an International Driving Permit (IDP).",
  },
  {
    q: "What are your opening hours?",
    a: "Our Dubai Marina office in Princess Tower and our counter at JW Marriott Hotel Marina are open every day, 9 am to 6 pm. WhatsApp enquiries are answered around the clock, and roadside assistance is available 24/7 on 800-4845.",
  },
  {
    q: "How old do I need to be?",
    a: "Drivers must be 21 or older.",
  },
  {
    q: "Is there a security deposit?",
    a: "Yes. Deposits range from AED 1,000 to AED 10,000 depending on the car, ideally held on a credit card. A zero-deposit option is also available; ask when you enquire.",
  },
  {
    q: "What is included in the price?",
    a: "Insurance and a standard mileage limit are included in all prices. Prices are shown per day, excluding 5% VAT.",
  },
  {
    q: "What is the minimum rental period?",
    a: "24 hours. You can rent for a day, a week, a month or longer.",
  },
  {
    q: "Can you deliver the car?",
    a: "Yes. Cars can be delivered to your hotel or home, or to the airport timed to your flight's landing. Tell us where and when on WhatsApp.",
  },
  {
    q: "How do I book?",
    a: "Message us on WhatsApp, call or email with the car and dates. We confirm charges, terms and the documents needed, then your booking and pick-up or delivery time. Nothing is charged online.",
  },
  {
    q: "What happens if I exceed the mileage limit?",
    a: "Extra kilometres are charged per km at a rate that depends on the car; for example, the Ford Mustang GT includes 250 km a day and charges AED 3 for each additional km. We confirm the limit for your car when you book.",
  },
];
