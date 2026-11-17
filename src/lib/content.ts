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

/** The day at Viva: each object's clock time, index, label and anchor id (upgrade brief order). */
export const sections = [
  { id: "top", time: "05:00", index: "", label: "Lights on", title: "Lights on." },
  { id: "walls", time: "06:30", index: "01", label: "Written on our walls", title: "Written on our walls" },
  { id: "goals", time: "09:00", index: "02", label: "Your goal", title: "What are you here to build?" },
  { id: "facilities", time: "11:00", index: "03", label: "Inside Viva", title: "The locker room" },
  { id: "classes", time: "13:00", index: "04", label: "Classes", title: "The studio scoreboard" },
  { id: "cafe", time: "15:00", index: "05", label: "Viva Café", title: "Train. Refuel. Repeat." },
  { id: "crew", time: "17:00", index: "06", label: "The crew", title: "Built under these lights." },
  { id: "memories", time: "18:30", index: "07", label: "Beyond the gym", title: "We don't just build muscles. We build memories." },
  { id: "proof", time: "19:30", index: "08", label: "The scoreboard", title: "Big numbers" },
  { id: "plans", time: "20:30", index: "09", label: "Membership", title: "The access card" },
  { id: "book", time: "21:30", index: "10", label: "Book your first day", title: "Your first day is on us." },
  { id: "visit", time: "22:00", index: "", label: "Lights off", title: "Lights off. See you at 5." },
] as const;

export type SectionId = (typeof sections)[number]["id"];
export const sectionById = (id: SectionId) => sections.find((s) => s.id === id)!;

export const nav = {
  links: [
    { label: "Story", href: "#walls" },
    { label: "Train", href: "#goals" },
    { label: "Facilities", href: "#facilities" },
    { label: "Classes", href: "#classes" },
    { label: "Café", href: "#cafe" },
    { label: "Plans", href: "#plans" },
    { label: "Visit", href: "#visit" },
  ],
  cta: { label: "Book free trial", href: "#book" },
} as const;

// ── 05:00 Hero: the light switch ───────────────────────────────────────────
export const hero = {
  kicker: "Viva Premium Gym · Dehradun · Since April 2024",
  headline: "Lights on.",
  sub: "Dehradun's premium gym & café. First day or fiftieth, you train at your pace, with a crew that has your back.",
  ctaPrimary: { label: "Book a free trial", href: "#book" },
  ctaSecondary: { label: "Find your program", href: "#goals" },
  stepInside: { label: "Step inside", href: "#walls" },
} as const;

// ── 01 Written on our walls: the neon wall ─────────────────────────────────
// The real neon signs on Viva's walls (visible in the footage). `focus` = object-position of the sign in the photo.
export const neonSigns = [
  { word: "Build Muscles", image: "build-muscles", focus: "62% 30%", where: "Lifting platform" },
  { word: "Power", image: "floor-power", focus: "36% 40%", where: "Strength floor" },
  { word: "Muscles", image: "corridor-gold", focus: "42% 45%", where: "Main corridor" },
  { word: "Energy", image: "floor-energy", focus: "70% 35%", where: "Plate-loaded zone" },
  { word: "Heat", image: "floor-energy", focus: "0% 40%", where: "Squat bay" },
] as const;

export const neonWallClose = {
  line1: "Champions aren't born.",
  line2: "They're built at Viva.",
  // the welcoming half of the pair (addendum: premium without intimidating beginners)
  sub: "Your journey. Your pace. Your definition of progress.",
} as const;

// ── Crossing tapes ─────────────────────────────────────────────────────────
export const tapes = {
  gold: ["Since April 2024", "Imported equipment", "Steam & shower", "Zumba", "Bhangra", "Yoga", "Healthy café"],
  neon: ["Build muscles", "Power", "Energy", "Heat"],
} as const;

// Remaining section copy is filled in as each object is built.
