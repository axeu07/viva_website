/**
 * ALL copy and facts for the site live here, so the client's details can be edited in one file.
 * Anything marked TODO(client) is unconfirmed and must come from the client. Never invent facts.
 */

export const site = {
  name: "Viva Premium Gym",
  altName: "Viva Premium Gym & Café",
  city: "Dehradun",
  opened: "2024-04-23",
  openedLabel: "23 April 2024",
  instagramBio: "Viva Premium Gym 2.0 (Biggest is Yet to Come)",
  metaDescription:
    "Viva Premium Gym & Café, Dehradun. Imported equipment, steam & shower, Zumba, Bhangra, Yoga and certified trainers. Open Mon–Sat, 5 AM–10 PM. Book a free trial.",
  hashtag: "#trainlikeachampion",
} as const;

export const contact = {
  address: {
    street: "Rajput Tower, GMS Road, opposite Engineer's Enclave",
    locality: "Shakti Enclave, Kaonli",
    city: "Dehradun",
    postalCode: "248001",
    region: "Uttarakhand",
    country: "IN",
  },
  phoneDisplay: "+91 70601 11110",
  phoneE164: "+917060111110",
  whatsapp: "https://wa.me/917060111110",
  // TODO(client): two versions exist online. Confirm which is correct.
  email: null as string | null,
  emailCandidates: ["Vivapremiumgym@gmail.com", "vivagym@gmail.com"],
  instagram: "https://www.instagram.com/viva_premium_gym/",
  facebook: "https://www.facebook.com/p/Viva-Premium-Gym-61557681063793/",
  // TODO: exact Google Maps / reviews links to be confirmed.
  googleMaps: null as string | null,
  googleReviews: null as string | null,
  // TODO(client): Google Play URL for the Viva app.
  appUrl: null as string | null,
} as const;

export const hours = {
  weekdays: { days: "Mon–Sat", open: "05:00", close: "22:00", label: "5:00 AM – 10:00 PM" },
  // TODO(client): Sunday hours unconfirmed.
  sunday: null as string | null,
  daysPerWeek: 6,
} as const;

export const rating = { value: 4.8, count: 378, source: "Google" } as const;

export const facilities = [
  "Most advanced imported training equipment",
  "Steam & shower",
  "Acupuncture shower",
  "Personal lockers",
  "Certified trainers",
  "Premium, friendly ambience",
  "Cleanliness & hygiene protocol",
  "Healthy café",
  "Free WiFi",
  "Parking",
  "Wheelchair-accessible entrance",
] as const;

export const classes = ["Zumba", "Bhangra", "Yoga", "CrossFit / cross-functional", "Aerobics", "Dance"] as const;

export const ownLines = {
  champions: "Champions aren't born. They're built at Viva Premium Gym.",
  memories: "We don't just build muscles, we build memories!",
  facilities: "A collection of world-class facilities and amenities.",
  hygiene: "Exceeding expectations with our cleanliness and hygiene protocol.",
  mission:
    "When you walk into Viva you feel valued, motivated and backed at every step. We're not just a gym. We're your partners in reaching your health and wellness goals.",
} as const;

export const marquee = [
  "Imported equipment",
  "Steam & shower",
  "Zumba",
  "Bhangra",
  "Yoga",
  "CrossFit",
  "Healthy café",
  "Certified trainers",
] as const;

// Section copy is filled in during Phases 4–5.
