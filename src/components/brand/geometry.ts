/**
 * Viva brand geometry: the logo (bull head + VIVA + rules) and the galloping bull that turns into it.
 *
 * Everything lives in ONE coordinate system: the logo traced at 4× from the client's end-card logo
 * (public/media/logo-stopgap.png, 272×118 → 1088×472). Because the bull is drawn in the same space,
 * its resting head IS the logo head: "settling into the logo" means returning to an identity transform.
 *
 * Self-contained (no imports) so scripts can load it with Node's type stripping.
 */

export type Pt = readonly [number, number];

const f = (n: number) => Math.round(n * 10) / 10;

/** Straight-edged closed path. */
export function poly(pts: readonly Pt[], close = true): string {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${f(x)},${f(y)}`).join("") + (close ? "Z" : "");
}

/**
 * Smooth closed path through points (Catmull-Rom → cubic Bézier). Points flagged as corners
 * (third value true) keep a sharp angle, e.g. horn tips.
 */
export function smooth(pts: readonly (readonly [number, number, boolean?])[], tension = 0.5): string {
  const n = pts.length;
  const P = (i: number) => pts[(i + n) % n];
  let d = `M${f(P(0)[0])},${f(P(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const t1 = p1[2] ? [0, 0] : [((p2[0] - p0[0]) * tension) / 3, ((p2[1] - p0[1]) * tension) / 3];
    const t2 = p2[2] ? [0, 0] : [((p3[0] - p1[0]) * tension) / 3, ((p3[1] - p1[1]) * tension) / 3];
    d += `C${f(p1[0] + t1[0])},${f(p1[1] + t1[1])} ${f(p2[0] - t2[0])},${f(p2[1] - t2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + "Z";
}

// ── The logo ───────────────────────────────────────────────────────────────

export const LOGO_VIEWBOX = { x: 40, y: 36, w: 1030, h: 400 } as const;
export const BASELINE = 333;
export const CAP_TOP = 118;

const V_SHAPE = (cx: number): Pt[] => [
  [cx - 123, CAP_TOP],
  [cx - 60, CAP_TOP],
  [cx, 256],
  [cx + 60, CAP_TOP],
  [cx + 123, CAP_TOP],
  [cx + 34, BASELINE],
  [cx - 34, BASELINE],
];

/** VIVA, left to right. A has a counter (second subpath; fill-rule evenodd). */
export const LETTERS = {
  V1: poly(V_SHAPE(187)),
  I: poly([
    [331, CAP_TOP],
    [397, CAP_TOP],
    [397, BASELINE],
    [331, BASELINE],
  ]),
  V2: poly(V_SHAPE(544)),
  A:
    poly([
      [645, BASELINE],
      [736, CAP_TOP],
      [797, CAP_TOP],
      [887, BASELINE],
      [824, BASELINE],
      [809, 298],
      [723, 298],
      [708, BASELINE],
    ]) +
    poly([
      [764, 182],
      [738, 248],
      [790, 248],
    ]),
} as const;
export const LETTER_ORDER = ["V1", "I", "V2", "A"] as const;
export type LetterId = (typeof LETTER_ORDER)[number];

/**
 * The bull head (with neck and chest) exactly as it rises from the A's right leg in the logo.
 * Its left edge runs parallel to the A, leaving the thin gap the logo has.
 */
export const HEAD_OUTLINE = smooth(
  [
    [810, 114, true],
    [826, 94],
    [848, 79],
    [875, 66],
    [903, 60],
    [932, 57],
    [956, 55],
    [974, 48, true], // back horn tip
    [958, 63],
    [936, 72],
    [918, 83],
    [940, 97],
    [956, 110],
    [969, 125],
    [982, 140],
    [998, 148],
    [1013, 146],
    [1024, 136],
    [1029, 119],
    [1043, 96, true], // front horn tip
    [1047, 120],
    [1045, 142],
    [1037, 162],
    [1022, 176],
    [1000, 183],
    [979, 184],
    [969, 198],
    [967, 218],
    [963, 232, true], // muzzle
    [951, 241],
    [942, 247, true], // jaw
    [941, 265],
    [947, 290],
    [963, 310],
    [992, 324],
    [1032, 334, true], // chest swoosh
    [990, 335],
    [926, 334, true],
    [881, 283, true],
  ],
  0.55,
);

/** Dark engraved details on the head: horn creases, eye, jaw line. Drawn as strokes. */
export const HEAD_DETAILS = {
  creases: ["M870,80 Q854,98 864,124", "M918,84 Q899,97 905,118"],
  jaw: "M877,190 Q898,224 938,245",
  eye: { cx: 928, cy: 175, rx: 6.5, ry: 4, rotate: 32 },
} as const;

/** The two gold rules either side of PREMIUM GYM, each drawn from its inner end outward. */
export const RULES = {
  left: { x1: 168, x2: 58, y: 398 },
  right: { x1: 936, x2: 1046, y: 398 },
} as const;
export const SUBLINE = { x1: 188, x2: 916, baseline: 412, size: 36, text: "PREMIUM GYM" } as const;

// ── The bull ───────────────────────────────────────────────────────────────

/** Ground line for the hooves (below the letters; the subline only appears after the morph). */
export const GROUND = 444;

/** Torso silhouette, angular and muscular: hump behind the neck, deep chest, tucked belly. */
const TORSO: Pt[] = [
  [862, 118],
  [812, 92],
  [762, 70], // shoulder hump, higher than the poll
  [700, 84],
  [632, 102],
  [548, 116], // loin
  [462, 110],
  [432, 104], // hip bone
  [380, 110],
  [346, 120], // tail head
  [322, 142],
  [311, 182],
  [318, 226], // buttock
  [338, 262],
  [372, 280],
  [420, 268], // tucked flank
  [500, 286],
  [600, 304],
  [700, 322], // deep girth
  [790, 334],
  [870, 336],
  [926, 330],
  [934, 250],
  [916, 160],
];

/** Clip a polygon to the vertical band minX ≤ x ≤ maxX (Sutherland–Hodgman, twice). */
function clipBand(pts: readonly Pt[], minX: number, maxX: number): Pt[] {
  const clip = (input: Pt[], inside: (p: Pt) => boolean, edgeX: number): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i < input.length; i++) {
      const a = input[i];
      const b = input[(i + 1) % input.length];
      const ia = inside(a);
      const ib = inside(b);
      if (ia) out.push(a);
      if (ia !== ib) {
        const t = (edgeX - a[0]) / (b[0] - a[0]);
        out.push([edgeX, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return out;
  };
  return clip(clip([...pts], (p) => p[0] >= minX, minX), (p) => p[0] <= maxX, maxX);
}

/**
 * The torso cut into four slices, left to right. Each one becomes a letter. Slices overlap by 2
 * units so no hairline seam shows between them.
 */
const CUTS = [0, 474, 596, 724, 2000];
export const TORSO_SLICES: Record<LetterId, string> = Object.fromEntries(
  LETTER_ORDER.map((id, i) => [id, poly(clipBand(TORSO, CUTS[i] - (i ? 2 : 0), CUTS[i + 1] + 2))]),
) as Record<LetterId, string>;

export const TAIL = smooth(
  [
    [352, 116, true],
    [326, 128],
    [306, 160],
    [296, 210],
    [294, 262],
    [284, 300, true], // tuft
    [306, 294],
    [308, 262],
    [312, 212],
    [322, 168],
    [342, 136],
  ],
  0.6,
);

/** Light along the back, for the travelling specular glint. */
export const BACK_LINE = "M311,182 L322,142 L346,120 L380,110 L432,104 L462,110 L548,116 L632,102 L700,84 L762,70 L812,92";

/** Low-poly facet lines (muscle planes). They fade before the morph. */
export const FACETS = [
  "M762,70 L728,196 L760,326", // shoulder blade
  "M632,102 L652,214 L620,304", // ribs
  "M548,116 L520,206 L500,286", // flank
  "M432,104 L420,196 L372,280", // hip
  "M700,84 L728,196",
];

// Legs: generated from joint angles so the 6 gallop poses stay consistent.
type LegSpec = { hip: Pt; lens: [number, number, number]; widths: [number, number, number, number] };
export const LEGS = {
  hindFar: { hip: [392, 238], lens: [84, 74, 30], widths: [96, 44, 25, 28] },
  hindNear: { hip: [410, 250], lens: [86, 76, 30], widths: [104, 46, 26, 29] },
  foreFar: { hip: [806, 284], lens: [64, 62, 24], widths: [84, 40, 24, 27] },
  foreNear: { hip: [838, 296], lens: [66, 62, 24], widths: [90, 42, 25, 28] },
} as const satisfies Record<string, LegSpec>;
export type LegId = keyof typeof LEGS;

/** Angles in degrees from straight down; positive = forward (the bull faces +x). */
type Angles = readonly [number, number, number];

export function legPath(id: LegId, a: Angles): { d: string; hoof: Pt } {
  const { hip, lens, widths } = LEGS[id];
  const joints: Pt[] = [hip];
  const dirs: Pt[] = [];
  for (let i = 0; i < 3; i++) {
    const r = (a[i] * Math.PI) / 180;
    const dir: Pt = [Math.sin(r), Math.cos(r)];
    dirs.push(dir);
    const [px, py] = joints[i];
    joints.push([px + dir[0] * lens[i], py + dir[1] * lens[i]]);
  }
  // normal at each joint = perpendicular of the averaged neighbouring directions
  const front: Pt[] = [];
  const back: Pt[] = [];
  joints.forEach((j, i) => {
    const d0 = dirs[Math.max(0, i - 1)];
    const d1 = dirs[Math.min(2, i)];
    let nx = d0[0] + d1[0];
    let ny = d0[1] + d1[1];
    const len = Math.hypot(nx, ny) || 1;
    nx /= len;
    ny /= len;
    const w = widths[i] / 2;
    front.push([j[0] + ny * w, j[1] - nx * w]);
    back.push([j[0] - ny * w, j[1] + nx * w]);
  });
  // hoof: a short wedge, toe pointing along the last segment's forward side
  const toe = joints[3];
  const tip: Pt = [toe[0] + dirs[2][0] * 8, toe[1] + dirs[2][1] * 8];
  const pts: Pt[] = [...front, tip, ...back.reverse()];
  return { d: poly(pts), hoof: tip };
}

const FORE_CYCLE: Angles[] = [
  [42, 48, 72], // reach
  [16, 10, 26], // plant
  [-8, -16, -6], // under
  [-34, -42, -64], // push off
  [6, -84, -44], // fold
  [40, -14, 18], // swing forward
];
const HIND_CYCLE: Angles[] = [
  [34, -4, 32],
  [10, -20, 10],
  [-14, -36, -22],
  [-40, -56, -76],
  [24, -52, -14],
  [40, -14, 16],
];

/** Phase offset of each leg in the 6-frame cycle (rotary gallop: hind pair, then fore pair). */
const PHASE: Record<LegId, number> = { hindFar: 0, hindNear: 1, foreFar: 3, foreNear: 4 };

export const GALLOP_FRAMES = 6;
export function gallopPose(frame: number): Record<LegId, { d: string; hoof: Pt; planted: boolean }> {
  const out = {} as Record<LegId, { d: string; hoof: Pt; planted: boolean }>;
  (Object.keys(LEGS) as LegId[]).forEach((id) => {
    const k = (frame + PHASE[id]) % GALLOP_FRAMES;
    const cycle = id.startsWith("fore") ? FORE_CYCLE : HIND_CYCLE;
    out[id] = { ...legPath(id, cycle[k]), planted: k === 1 };
  });
  return out;
}

/**
 * Vertical body offset for a gallop frame: drops the bull until its lowest hoof meets the ground,
 * capped so the suspension phase (all hooves up) still reads as a leap.
 */
export function gallopBob(pose: Record<LegId, { hoof: Pt }>): number {
  const lowest = Math.max(...Object.values(pose).map((l) => l.hoof[1]));
  return Math.max(-14, Math.min(22, GROUND - lowest));
}

/** Skid stop: front legs braced out ahead, hind legs gathered under. */
export const BRACED: Record<LegId, string> = {
  hindFar: legPath("hindFar", [22, -26, 6]).d,
  hindNear: legPath("hindNear", [30, -18, 12]).d,
  foreFar: legPath("foreFar", [30, 34, 52]).d,
  foreNear: legPath("foreNear", [40, 42, 60]).d,
};

/** Where the braced front hooves dig in (for the skid's dust burst). */
export const BRACED_HOOVES: Pt[] = [legPath("foreFar", [30, 34, 52]).hoof, legPath("foreNear", [40, 42, 60]).hoof];

/** Standing still (used for the approval sheet). */
export const STANDING: Record<LegId, string> = {
  hindFar: legPath("hindFar", [10, -14, 6]).d,
  hindNear: legPath("hindNear", [2, -10, 8]).d,
  foreFar: legPath("foreFar", [-4, 2, 12]).d,
  foreNear: legPath("foreNear", [6, 0, 12]).d,
};

/** Which bull parts fold into which letter. The head never morphs. */
export const MORPH_MAP: Record<LetterId, { slice: LetterId; legs: LegId[] }> = {
  V1: { slice: "V1", legs: ["hindFar", "hindNear"] },
  I: { slice: "I", legs: [] },
  V2: { slice: "V2", legs: [] },
  A: { slice: "A", legs: ["foreFar", "foreNear"] },
};
