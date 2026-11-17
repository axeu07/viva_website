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

/** The day at Viva: each section's clock time, label and anchor id. */
export const sections = [
  { id: "top", time: "05:00", label: "Lights on", title: "Lights on." },
  { id: "story", time: "06:30", label: "Our story", title: "Viva means life." },
  { id: "goals", time: "09:00", label: "Your goal", title: "What are you here to build?" },
  { id: "facilities", time: "11:00", label: "Facilities", title: "World-class, under golden light." },
  { id: "classes", time: "13:00", label: "Classes", title: "Zumba. Bhangra. Yoga. More." },
  { id: "cafe", time: "15:00", label: "Viva Café", title: "Train. Refuel. Repeat." },
  { id: "coaches", time: "17:00", label: "Coaches", title: "Built under these lights." },
  { id: "memories", time: "18:30", label: "Beyond the gym", title: "We don't just build muscles. We build memories." },
  { id: "proof", time: "19:30", label: "Proof", title: "Golden hour, every hour." },
  { id: "plans", time: "20:30", label: "Membership", title: "Pick your commitment." },
  { id: "book", time: "21:30", label: "Book your first session", title: "Your first day is on us." },
  { id: "visit", time: "22:00", label: "Lights off", title: "Lights off. See you at 5." },
] as const;

export type SectionId = (typeof sections)[number]["id"];
export const sectionById = (id: SectionId) => sections.find((s) => s.id === id)!;

export const nav = {
  links: [
    { label: "Story", href: "#story" },
    { label: "Train", href: "#goals" },
    { label: "Facilities", href: "#facilities" },
    { label: "Classes", href: "#classes" },
    { label: "Café", href: "#cafe" },
    { label: "Plans", href: "#plans" },
    { label: "Visit", href: "#visit" },
  ],
  cta: { label: "Book free trial", href: "#book" },
} as const;

// Section body copy is filled in during Phases 4–5.
