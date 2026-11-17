/**
 * Media registry. Asset data comes from media-manifest.json, which `npm run media` regenerates.
 * The section → media assignment lives here (see media-map.md for the reasoning).
 */
import manifest from "./media-manifest.json";

export type VideoAsset = {
  id: string;
  label: string;
  width: number;
  height: number;
  duration: number;
  mp4: string;
  webm: string;
  poster: string;
  posterAvif: string;
  /** tiny blurred webp data URI */
  placeholder: string;
};

export type ImageAsset = {
  id: string;
  label: string;
  width: number;
  height: number;
  widths: number[];
  /** base path; files are `${base}-${w}.avif|webp` */
  base: string;
  placeholder: string;
};

export const videos = manifest.videos as Record<string, VideoAsset>;
export const images = manifest.images as Record<string, ImageAsset>;
export const logoSrc = manifest.logoStopgap?.src ?? null;

export const srcSet = (img: ImageAsset, ext: "avif" | "webp") =>
  img.widths.map((w) => `${img.base}-${w}.${ext} ${w}w`).join(", ");

/** Section → media assignment (pending approval of media-map.md). */
export const sectionMedia = {
  hero: { backdrop: "floor-energy", panels: ["floor", "class-lead", "cardio"], mobileVideo: "floor" },
  story: { photo: "corridor-gold", timeline: ["exterior", "class-wide", "bull-wall"] },
  goals: {
    "burn-fat": { video: "cardio", photo: "cardio-zone" },
    "build-muscle": { video: "floor", photo: "build-muscles" },
    "move-feel-good": { video: "class-wide", photo: "spin-room" },
    athlete: { video: "trainer", photo: "lat-pulldown" },
  },
  facilities: {
    equipment: { video: "floor", photo: "strength-white" },
    steam: null, // TODO(client): no footage
    acupuncture: null, // TODO(client): no footage
    lockers: { photo: "lockers" },
    trainers: { video: "trainer" },
    cafe: { photo: "lounge" }, // reception lounge, not the café counter
    wifiParking: { photo: "exterior" },
    hygiene: { photo: "treadmills" },
  },
  classes: {
    zumba: "class-lead",
    bhangra: "class-lead",
    dance: "class-lead",
    aerobics: "class-wide",
    crossfit: "trainer",
    yoga: "trainer-stretch", // TODO(client): no yoga footage
  },
  cafe: { photo: "lounge" }, // TODO(client): real café / shake photos
  coaches: { ambient: "trainer", still: "trainer-stretch" }, // TODO(client): trainer portraits
  memories: { tiles: ["class-wide", "class-lead", "bull-wall", "jersey", "entrance", "spin-room"] }, // TODO(client): trek, festival, Sunil Singh
  proof: { photo: "floor-power" },
  footer: { video: "bull-wall", photo: "exterior" },
} as const;
