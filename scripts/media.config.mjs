/**
 * Media pipeline config for `npm run media`.
 * To add new footage: drop the file into ../viva_videos, add a source alias below,
 * then add a clip (video) or photo entry and re-run `npm run media`.
 *
 * Times are in seconds. `crop` is an ffmpeg crop (w:h:x:y) applied to the SOURCE frame
 * to remove borders, burned-in watermarks and app UI before scaling.
 */

export const sources = {
  // Instagram reels (screen-recorded): ~350x620 portrait, burned-in VIVA watermark.
  floorReel: { file: "Recording 2026-11-17 120344.mp4", crop: "344:540:0:76" }, // watermark top
  promoReel: { file: "Recording 2026-11-17 120525.mp4", crop: "356:556:2:4" }, // watermark bottom-right
  zumbaReel: { file: "Recording 2026-11-17 121608.mp4", crop: "358:556:4:4" }, // watermark bottom-right
  cardioReel: { file: "viva_cardio.mp4", crop: "356:620:0:4" }, // no watermark, 2px border
};

/** Output size for portrait loops. Sources are ~350px wide, so we keep native size (no upscaling). */
export const loopSize = { w: 360, h: 576 };

/**
 * Video loops: a list of segments joined with hard cuts. A hard-cut montage loops seamlessly
 * because the loop point is just another cut. `boomerang` plays forward then reversed.
 */
export const clips = [
  {
    id: "floor",
    label: "Gym floor montage: squat bay, BUILD MUSCLES platform, dumbbell rack, white plate-loaded machines, POWER neon",
    segments: [
      ["floorReel", 11.4, 12.33],
      ["floorReel", 12.62, 13.25],
      ["floorReel", 15.2, 15.82],
      ["promoReel", 4.1, 4.68],
      ["promoReel", 4.73, 5.28],
      ["floorReel", 9.95, 10.9],
      ["promoReel", 5.33, 5.9],
    ],
  },
  {
    id: "class-wide",
    label: "Zumba class: wide room shot, then the fog/smoke shot",
    segments: [
      ["zumbaReel", 4.0, 7.8],
      ["zumbaReel", 12.05, 15.98],
    ],
  },
  {
    id: "class-lead",
    label: "Zumba class: lead dancers close up",
    segments: [
      ["zumbaReel", 0.05, 3.86],
      ["zumbaReel", 7.88, 11.96],
    ],
  },
  {
    id: "cardio",
    label: "Cardio: spin bike, treadmill touchscreen, stair climber, ellipticals",
    segments: [
      ["cardioReel", 2.6, 3.48],
      ["cardioReel", 3.53, 4.6],
      ["cardioReel", 5.6, 6.3],
      ["cardioReel", 6.36, 7.15],
      ["cardioReel", 7.2, 8.44],
    ],
  },
  {
    id: "trainer",
    label: "Trainer coaching a member: bench press, dumbbells (STRENGTH neon), lat pull, rowing, white machine",
    segments: [
      ["cardioReel", 8.5, 9.48],
      ["cardioReel", 9.53, 10.44],
      ["cardioReel", 10.5, 11.35],
      ["cardioReel", 11.4, 12.25],
      ["cardioReel", 13.43, 14.8],
    ],
  },
  {
    id: "bull-wall",
    label: "Member in front of the backlit bull logo wall",
    boomerang: true,
    segments: [["cardioReel", 14.95, 17.9]],
  },
];

/** Single frames worth keeping as stills (no loop). */
export const frames = [
  { id: "lockers", label: "Member at the changing-room / locker door (backlit signage)", source: "cardioReel", t: 0.25 },
  { id: "jersey", label: "Viva jersey close-up", source: "cardioReel", t: 1.0 },
  { id: "trainer-stretch", label: "Trainer guiding a member through a stretch", source: "cardioReel", t: 2.0 },
];

/**
 * Photos from screenshots. `crop` (w:h:x:y) trims app chrome; `delogo` boxes (x:y:w:h) paint
 * out Instagram/Google carousel arrows by interpolating from surrounding pixels.
 */
export const photos = [
  { id: "floor-energy", file: "Screenshot 2026-11-17 121931.png", crop: "783:471:20:0", label: "Wide gym floor, ENERGY / HEAT neon, white LED strips" },
  { id: "floor-power", file: "Screenshot 2026-11-17 121920.png", crop: "694:460:16:0", label: "Strength floor, gold POWER / MUSCLES neon" },
  { id: "corridor-gold", file: "Screenshot 2026-11-17 121804.png", crop: "626:568:0:14", label: "Gold-lit corridor, MUSCLES / ENERGY neon, Viva lifting belt" },
  { id: "build-muscles", file: "Screenshot 2026-11-17 121840.png", crop: "633:574:0:0", label: "Lifting platform with BUILD MUSCLES neon, coloured bumper plates" },
  { id: "cardio-zone", file: "Screenshot 2026-11-17 121429.png", crop: "840:575:0:0", delogo: ["22:236:34:44", "784:236:34:44"], label: "Cardio zone: treadmills, elliptical, spin bikes, LED wall, flip tyre" },
  { id: "strength-white", file: "Screenshot 2026-11-17 121736.png", crop: "784:558:0:0", delogo: ["22:232:34:44"], label: "White plate-loaded strength machines, mirrored walls" },
  { id: "spin-room", file: "Screenshot 2026-11-17 121912.png", crop: "664:376:0:0", label: "Spin room with LED wall" },
  { id: "lat-pulldown", file: "Screenshot 2026-11-17 120429.png", crop: "506:532:0:44", label: "Member on lat pulldown (cropped below the VIVA logo)" },
  { id: "treadmills", file: "Screenshot 2026-11-17 121812.png", crop: "473:572:0:12", label: "Treadmills with touchscreens, stair climber" },
  { id: "lounge", file: "Screenshot 2026-11-17 121821.png", crop: "470:580:0:0", label: "Reception lounge: sofas, gold tables, plants" },
  { id: "entrance", file: "Screenshot 2026-11-17 121850.png", crop: "476:574:0:0", label: "Glass entrance into the spin room" },
  { id: "exterior", file: "Screenshot 2026-11-17 121627.png", crop: "399:468:0:0", label: "Rajput Tower exterior with VIVA PREMIUM GYM sign" },
];

/** Widths for responsive photos. Widths above the source are skipped (never upscale). */
export const photoWidths = [640, 1280, 1920];

/** Stopgap logo cut from a reel's end card until the client sends the real file. */
export const logoStopgap = { source: "promoReel", t: 11.2, crop: "272:118:44:256" };
