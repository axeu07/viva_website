# Viva build plan

Sources: `../VIVA_CLAUDE_CODE_PROMPT.md` (base brief), `../VIVA_UPGRADE_BRIEF.md` (overrides its sections 5 and 6), `media-map.md`.
This file is the running plan. Each phase stops for review.

| Phase | Status | Scope |
|---|---|---|
| 1 Setup | ✅ committed | Scaffold, theme, fonts, structure |
| 2 Media | ✅ committed | Inventory, `media-map.md`, `npm run media` |
| 3 Foundation | ✅ committed | Lenis + GSAP, day clock, light strips, sunbeam, nav, cursor, sound, test page |
| 3b Upgrade foundation + vertical slice | 👀 awaiting review (uncommitted) | Upgrade-brief visual language + **hero light switch, neon wall, crossing tapes** |
| 4 Intro + hero | 🔨 in progress | SVG logo (champagne) live in nav; welcome intro wired as the site opening (strips → logo build → sweep → PREMIUM GYM → Step in → hero). **Bull gallop + morph waits for approval of `docs/intro-shapes/a-bull.png`** |
| 5 Sections | planned | Remaining objects, two at a time |
| 6 Polish | planned | Performance, a11y, SEO, README |

---

## Upgrade brief → components

Each section is a physical object from inside the gym. The day clock still runs 05:00 → 22:00. Story (base brief) is replaced by the neon wall and takes its 06:30 slot; "Since April 2024" moves to the gold tape.

| Clock | # | Object | Component | Key parts |
|---|---|---|---|---|
| — | — | Bull-to-VIVA intro | `Intro.tsx`, `brand/*` | Phase 4, see below |
| 05:00 | — | Light switch | `Hero.tsx`, `LightSwitch.tsx`, `Lights.tsx` | Outline "LIGHTS ON." ignites letter by letter; strips flicker; triptych fades up; status chips |
| 06:30 | 01 | Neon wall | `NeonWall.tsx`, `NeonText.tsx` | Pinned; BUILD MUSCLES / POWER / MUSCLES / ENERGY / HEAT ignite on scroll; sticky media frame swaps with a light wipe |
| — | — | Crossing tapes | `CrossingTapes.tsx` (replaces `Marquee`) | Two tilted bands in an X; speed + skew follow scroll velocity |
| 09:00 | 02 | Treadmill console | `GoalFinder.tsx`, `DotMatrix.tsx`, `SignalBars.tsx` | Radio group; dot-matrix program name; portrait screen; START pre-fills the form |
| 11:00 | 03 | Locker room | `Facilities.tsx`, `Locker.tsx` | Drag/scroll row; doors swing open (rotateY); `PHOTO COMING` placeholders |
| 13:00 | 04 | Studio scoreboard | `Classes.tsx`, `FlipDigits.tsx` | Flip-clock times, NOW line, NEXT UP, intensity bars, cursor-follow preview; `SAMPLE TIMETABLE` |
| 15:00 | 05 | Shake bar | `Cafe.tsx`, `Shaker.tsx` | Menu board; SVG shaker fills on scroll, tap to shake |
| 17:00 | 06 | Giant names | `Coaches.tsx` | Outline names light gold; cursor-following portrait card; tap to expand on mobile |
| 18:30 | 07 | Memory wall | `Memories.tsx` | Pinned horizontal film strip of Polaroids; lightbox |
| 19:30 | 08 | Big numbers | `Proof.tsx` | 4.8 STARS / 378 REVIEWS / 5 AM TO 10 PM count up; praise themes, no quotes |
| 20:30 | 09 | Access card | `Plans.tsx` | Metallic cards tilt to the cursor; duration slider flips them; `TO CONFIRM` prices |
| 21:30 | 10 | Day pass | `BookTrial.tsx` | Check-in terminal; printed pass slides out; "You're in." |
| 22:00 | — | Lights off | `Footer.tsx` | Strips switch off; backlit bull wall glows |

**Global (built in 3b):** `Lights.tsx` = `LightsProvider` (`html.lights-off`) + the fixed wall-plate `LightSwitch` + `Flashlight`; mono micro-labels (JetBrains Mono) and `Tag` (`SAMPLE` / `TO CONFIRM`) and `StatusChip` (open/closed vs Mon–Sat 05:00–22:00 IST) in `ui.tsx`; `NeonText` (letter-by-letter ignition); animated grain on mouse devices; cursor labels via `data-cursor`. Palette follows `VIVA_ADDENDUM.md` (champagne gold, #101010).

**How lights-off works (no overlay, so no stacking problems):** one CSS state on `<html>` dims text/strips/beams via variables and masks every `.media-lit` photo/video to black; the flashlight writes the beam centre into each on-screen media element (`--mx/--my`), so inside the beam the room shows in true colour, plus a soft warm `screen` pool for walls and text. Neon and exit-green labels simply aren't dimmed.

**Risks:**
- *OneDrive + Turbopack dev cache:* the dev server sometimes serves stale CSS after edits. Fix: stop the server, delete `.next/`, restart. Moving the project to `C:\dev\viva-website` should end it.
- *Mobile 60 fps:* grain is static on touch devices; dust and flashlight work only while visible / while lights are off; pins use transforms only.
- *Source footage* is ~360 px portrait, so media stays in frames and is never full-bleed on desktop (see `media-map.md`).

---

## Phase 3b: what's being built now

1. Foundation upgrades: mono font, micro-labels, demo tags, status chip in the nav, animated grain, `Lights` + `LightSwitch` + `Flashlight` + `Blackout`, `NeonText` (letter-by-letter ignition with flicker).
2. **Hero, the light switch:** a near-black screen with an enormous outline "LIGHTS ON."; letters ignite one at a time; ceiling strips flicker on; the triptych (`floor`, `class-lead`, `cardio`) and the `floor-energy` backdrop fade up; bottom chips. On mobile, the `floor` loop runs full-screen. The hero plays on load for now. In Phase 4 it waits for the intro's `viva:intro-done` event.
3. **01 Neon wall** and **crossing tapes**.
4. The rest of the page stays as the Phase 3 skeleton until Phase 5.

---

## Phase 4: the bull-to-VIVA intro

*Requested 2026-11-17. It replaces the "typeset wordmark" intro approved in Phase 2. **Approval gate:** before any timeline work, show stills of (a) the full bull and (b) the assembled head + VIVA logo next to the reference.*

### Storyboard (one GSAP timeline, about 5–6 s, then "Step in →")

| t (s) | Beat | Implementation |
|---|---|---|
| 0.0–0.8 | Light strips flicker on over the black wall; % counter bottom-right tracks real asset loading; switch click if sound is on | Existing `flickerOn` + `LightStrip` in controlled mode |
| 0.8–2.0 | Bull gallops in from the left: 4–6 leg poses cycling fast, motion-blur streaks, dust at the floor line, specular glint along the back | Bull group `x` from off-screen to 0 (`power2.out`). Leg poses are separate path groups swapped with a stepped tween (~70 ms per pose). Blur is an `feGaussianBlur` whose `stdDeviationX` follows velocity, plus 3–4 gold streak lines trailing. Dust is canvas particles emitted on each hoof strike. The glint is a gradient highlight stroke travelling along the back contour (`stroke-dashoffset`). |
| 2.0–2.35 | Skid stop: braced front legs, dust burst, 150 ms micro camera shake. The head settles into its exact logo pose | Braced pose; slight overshoot then settle; radial dust burst at the front hooves; the stage wrapper jitters ±3 px over 150 ms. The head is its own group: lowered and bobbing during the gallop, it tweens to `transform: none`, which *is* the logo pose. |
| 2.35–3.5 | The body morphs into V-I-V-A, left to right; the head never moves | MorphSVGPlugin (included in `gsap` 3.15, free): hindquarters + hind legs → **V**, belly → **I**, ribcage + near foreleg → **V**, chest + forelegs → **A**, staggered ~0.12 s. The A ends under the head, matching the logo. |
| 3.5–4.1 | Light sweep across the logo; "PREMIUM GYM" letter-spaces in; the two gold rules draw outward | Gradient sweep mask; `letter-spacing` 0.9em → final with fade; rules `scaleX` 0 → 1 from their inner ends |
| 4.1+ | "Step in →" appears (once loading is 100%); click, or wait 1.2 s, and the camera pushes into the hero | Scale + blur push; strips stretch into the hero's lines; dispatch `viva:intro-done` |

**Fallback if the morph isn't clean:** if any frame shows tangles or inside-out flips that `shapeIndex` / `type: "rotational"` can't fix, the body breaks into ~500 gold particles (sampled along the body outline with `getPointAtLength`) that fly into points sampled inside the letter shapes (`isPointInPath`), then cross-fade to the crisp letter paths. The head is untouched either way. I'll decide during the build and show you frames of whichever path is used.

**Rules:** shown once per session (`sessionStorage`); a **Skip** button (a real `<button>`, focusable from frame 0) jumps the timeline to its end and hands off; under `prefers-reduced-motion` only the final logo is shown, with a 600 ms fade; Lenis is stopped while the intro runs.

### Building the shapes

- **Coordinate system:** the bull is drawn in the logo's own `viewBox`. At rest, the head sits exactly where the logo's head is, so "settling" means returning to an identity transform. No measuring or alignment at runtime.
- **Head:** traced from the logo. The best source is `public/media/logo-stopgap.png` (272 px, cut from the reel's end card), with `brand-logo-reference.png` (167 px) as a cross-check. Upscale, isolate the gold head, trace with `potrace` (npm, dev-only), then clean it up by hand into angular facets: horns, ear, muzzle and the logo's angle, plus a few dark cut lines for the eye and nostril.
- **Body and legs:** hand-drawn angular, low-poly-style silhouette, stylised and premium, not cartoonish. Separate paths: back, belly, hindquarters, 4 legs, and 6 gallop poses + 1 braced pose for the legs. Each morphing piece is one closed path, to keep the morph clean.
- **Letters:** a bold, wide geometric font close to the logo (candidates: Montserrat Black, Archivo Black, Unbounded; I'll pick by overlaying on the reference). Glyphs are converted to paths with `opentype.js` at build time (`scripts/build-logo.mjs`, dev-only), then hand-adjusted where the logo differs: the A's form, and the joint where the head rises from the A.
- **Logo component:** the assembled head + VIVA + rules + PREMIUM GYM becomes `Logo.tsx` as inline SVG with a gold gradient and specular sheen. It's used in the **nav, intro and footer**, and `logo-stopgap.png` is retired. The `REAL_LOGO` switch stays: when the client's file arrives, nav and footer use it, and the intro's final frame cross-fades to it.

### Phase 4 risks

- **Fidelity:** the only references are 167–272 px wide, so the head and lettering will be *close*, not exact. The real SVG would fix this; re-tracing from it is quick because the animation runs on path data.
- **Small sizes:** at nav size (~28 px tall), fine head detail turns to mush. The logo gets a `compact` detail level that drops the cut lines.
- **Weight:** MorphSVGPlugin is ~10 KB gzipped and the intro is on the critical path. Path data stays under ~15 KB, there's no R3F in the intro, and the dust is a single small canvas.
- **Mobile:** the scene scales to the viewport (logo ~300 px wide at 390 px), gallop distance is in `vw`, and there are fewer particles.

### Phase 4 approval stills (step 1, before wiring the timeline)

A page in `docs/intro-shapes/` (not deployed) with two screenshots:
(a) the full bull: rest pose, the 6 gallop poses and the braced pose;
(b) the assembled head + VIVA logo beside the upscaled reference and stopgap, plus an overlay at 50 % opacity.
