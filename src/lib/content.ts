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

// ── 02 Your goal: the treadmill console ───────────────────────────────────
// Programs are suggestions for the demo (tagged SAMPLE); classes, equipment and recovery are things Viva offers.
export type GoalId = "burn-fat" | "build-muscle" | "feel-good" | "athlete" | "starting";
export type MediaRef = { video?: string; photo?: string };
export type Goal = { id: GoalId; label: string; program: string; intensity: number; media: MediaRef; classes: string[]; equipment: string[]; recovery: string[] };

export const goalConsole = {
  heading: "What are you here to build?",
  sub: "Pick a goal and we'll show you where to start. No experience needed.",
  start: "Start this with a free trial",
  goals: [
    {
      id: "burn-fat",
      label: "Burn fat",
      program: "Burn fat",
      intensity: 4,
      media: { video: "cardio" },
      classes: ["Zumba", "Aerobics", "Cross-functional"],
      equipment: ["Imported treadmills & ellipticals", "Spin bikes", "Stair climber"],
      recovery: ["Steam & shower", "Protein shake at the café"],
    },
    {
      id: "build-muscle",
      label: "Build muscle",
      program: "Build muscle",
      intensity: 4,
      media: { video: "floor" },
      classes: ["Cross-functional"],
      equipment: ["Plate-loaded machines", "Free weights & racks", "Lifting platform"],
      recovery: ["Acupuncture shower", "Post-workout meal at the café"],
    },
    {
      id: "feel-good",
      label: "Feel good",
      program: "Move & feel good",
      intensity: 2,
      media: { video: "class-wide" },
      classes: ["Zumba", "Bhangra", "Yoga", "Dance"],
      equipment: ["Spin room", "Cardio zone"],
      recovery: ["Steam & shower", "Healthy snacks"],
    },
    {
      id: "athlete",
      label: "Athlete mode",
      program: "Athlete mode",
      intensity: 5,
      media: { video: "trainer" },
      classes: ["Cross-functional", "CrossFit-style circuits"],
      equipment: ["Coached strength stations", "Rowing & conditioning", "Lifting platform"],
      recovery: ["Acupuncture shower", "Nutrition counselling at the café"],
    },
    {
      id: "starting",
      label: "Just starting out",
      program: "First steps",
      intensity: 1,
      media: { photo: "trainer-stretch" },
      classes: ["Zumba", "Yoga"],
      equipment: ["A trainer-guided first session", "Easy cardio to warm up"],
      recovery: ["Steam & shower", "A free trial to try it all"],
    },
  ] as Goal[],
};

// ── 03 Inside Viva: the locker room ───────────────────────────────────────
// Facilities Viva publishes. Lockers without footage show a lit placeholder + "PHOTO COMING".
export type LockerItem = { id: string; name: string; line: string; media: MediaRef | null; icon?: "steam" | "shower" | "cup" };

export const lockerRoom = {
  heading: "Inside Viva",
  sub: "Open a locker. Everything you need is already here.",
  hint: "Drag or scroll",
  lockers: [
    { id: "equipment", name: "Imported equipment", line: "The most advanced imported training equipment, from plate-loaded strength to cardio.", media: { video: "floor" } },
    { id: "steam", name: "Steam bath", line: "Steam after your session, so you leave lighter than you came in.", media: { photo: "steam-room" }, icon: "steam" },
    { id: "acupuncture", name: "Acupuncture shower", line: "An acupuncture shower to reset after the heavy days.", media: { photo: "acupuncture-shower" }, icon: "shower" },
    { id: "lockers", name: "Personal lockers", line: "Your own locker. Bring your gear, leave the worry.", media: { photo: "lockers" } },
    { id: "trainers", name: "Certified trainers", line: "Certified trainers who meet you where you are, on day one and beyond.", media: { video: "trainer" } },
    { id: "cafe", name: "Healthy café", line: "Shakes, post-workout meals and healthy snacks, right after your session.", media: { photo: "healthy-cafe" }, icon: "cup" },
    { id: "wifi-parking", name: "WiFi & parking", line: "Free WiFi inside, parking outside, and a wheelchair-accessible entrance.", media: { photo: "exterior" } },
    { id: "hygiene", name: "Hygiene protocol", line: "Exceeding expectations with our cleanliness and hygiene protocol.", media: { photo: "treadmills" } },
  ] as LockerItem[],
};

// Remaining section copy is filled in as each object is built.

// ── 04 Classes: the studio scoreboard (SAMPLE timetable, TODO(client): real schedule) ──
export type ClassSlot = { time: string; name: string; room: string; mins: number; intensity: number; video: string };
const A: ClassSlot[] = [
  { time: "06:00", name: "Yoga", room: "Studio", mins: 60, intensity: 1, video: "class-wide" },
  { time: "07:00", name: "Zumba", room: "Studio", mins: 45, intensity: 3, video: "class-lead" },
  { time: "18:00", name: "Bhangra", room: "Studio", mins: 45, intensity: 4, video: "class-lead" },
  { time: "19:00", name: "CrossFit", room: "Floor", mins: 45, intensity: 5, video: "trainer" },
];
const B: ClassSlot[] = [
  { time: "06:30", name: "Aerobics", room: "Studio", mins: 45, intensity: 3, video: "class-wide" },
  { time: "07:30", name: "CrossFit", room: "Floor", mins: 45, intensity: 5, video: "trainer" },
  { time: "18:30", name: "Zumba", room: "Studio", mins: 45, intensity: 3, video: "class-lead" },
  { time: "19:30", name: "Dance", room: "Studio", mins: 45, intensity: 2, video: "class-wide" },
];
export const scoreboard = {
  heading: "Find your class.",
  sub: "Zumba, Bhangra, Yoga and more. No experience needed: every class has a beginner pace.",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const,
  schedule: [A, B, A, B, A, B] as ClassSlot[][],
};

// ── 05 Café: the shake bar (ivory). TODO(client): real menu and prices ──
export const shakeBar = {
  heading: "Train. Refuel. Repeat.",
  sub: "Finish your session with a shake or a proper meal, right downstairs from the floor.",
  board: [
    { title: "Shakes", items: ["Protein shake", "Banana peanut butter", "Cold coffee protein"] },
    { title: "Meals", items: ["Post-workout bowl", "Paneer or egg plate", "Grilled sandwich"] },
    { title: "Snacks", items: ["Fruit cup", "Sprouts chaat", "Energy bar"] },
  ],
};

// ── 06 The crew ──
export const crew = {
  heading: "Built under these lights.",
  sub: "Certified trainers who start where you are, whether that's your first squat or your next PR.",
  people: [
    { name: "Ashmita", role: "Trainer", confirmed: true },
    { name: "Deepak", role: "Trainer", confirmed: true },
    { name: "Trainer 03", role: "Name to confirm", confirmed: false },
    { name: "Trainer 04", role: "Name to confirm", confirmed: false },
  ],
};

// ── 07 Beyond the gym: the memory wall. Only frames with real footage are shown.
// TODO(client): add "The Viva trek", "Festival at Viva" and "Member spotlight: Sunil Singh" back once their photos/clips arrive.
export type Frame = { id: string; caption: string; media: MediaRef | null };
export const memoryWall = {
  line1: "We don't just build muscles.",
  line2: "We build memories.",
  sub: "Treks, festivals and class nights. Come for the workout, stay for the people.",
  frames: [
    { id: "zumba", caption: "Zumba night", media: { video: "class-lead" } },
    { id: "class", caption: "Full studio", media: { video: "class-wide" } },
    { id: "jersey", caption: "The Viva jersey", media: { photo: "jersey" } },
    { id: "bull", caption: "The bull wall", media: { video: "bull-wall" } },
    { id: "spin", caption: "Spin room", media: { photo: "spin-room" } },
    { id: "sunset", caption: "Sunset sessions", media: { photo: "sunset-treadmills" } },
    { id: "pull", caption: "Pull day", media: { photo: "lat-pulldown" } },
    { id: "lounge", caption: "After the workout", media: { photo: "lounge" } },
    { id: "cardio-zone", caption: "Cardio crew", media: { photo: "cardio-zone" } },
    { id: "entrance", caption: "Come on in", media: { photo: "entrance" } },
  ] as Frame[],
};

// ── 08 Big numbers ──
export const bigNumbers = {
  themes: [
    { title: "Modern machines", line: "Reviewers keep mentioning the imported, high-quality equipment." },
    { title: "Clean and well kept", line: "The hygiene and upkeep come up again and again." },
    { title: "Supportive trainers", line: "Knowledgeable trainers who guide beginners patiently." },
  ],
  note: "Themes summarised from public Google reviews. Real quotes will be added with permission.",
};

// ── 09 Membership: the access card (ivory). TODO(client): plans and prices (monthly = demo ₹ per month) ──
export const accessCards = {
  heading: "Pick your access.",
  sub: "Simple plans, no pressure. Ask us anything before you join.",
  terms: [1, 3, 6, 12] as const,
  plans: [
    { id: "gym", name: "Gym access", monthly: 3000, perks: ["Full gym floor", "Steam & shower", "Personal locker"] },
    { id: "plus", name: "Gym + Classes", monthly: 4000, perks: ["Everything in Gym", "Zumba, Bhangra, Yoga", "Trainer guidance"] },
    { id: "pt", name: "Personal training", monthly: 5000, perks: ["One-to-one coaching", "Plan built for you", "Progress check-ins"] },
  ],
};

// ── 10 Book your first day: WhatsApp enquiry ──
export const enquiry = {
  heading: "Your first day is on us.",
  sub: "Tell us when you'd like to come in. We'll confirm on WhatsApp, usually within the day.",
  interests: ["Gym visit", "Membership", "Personal training"] as const,
};

export const mapsUrl =
  contact.googleMaps ??
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Viva Premium Gym, Rajput Tower, GMS Road, Dehradun");
