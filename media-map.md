# Media map: Viva Premium Gym

Source folder: `../viva_videos` (18 files; originals untouched, copied to `public/media/raw/`).
Pipeline: `npm run media` → config in `scripts/media.config.mjs` → assets in `public/media/`, data in `src/lib/media-manifest.json`.

## ⚠ The headline problem: resolution

**No file meets the ~720p bar.** Everything was captured from Instagram/Google on a phone:

- The 4 videos are portrait reels of about **350×620** with a burned-in VIVA watermark, 0.6–1.5 s cuts and logo end cards.
- The 14 screenshots are **282–842 px wide**.

By the brief's rule, all of it counts as *unusable for launch*. For this **demo**, I've processed the cleanest parts as **demo-grade stand-ins**, with these treatment rules so the low resolution doesn't show:

1. **No 1920w/1080w versions are made.** Upscaling a 350 px source only adds bytes. Loops are encoded at native 360×576 and photos at ≤ native width.
2. **Videos only live in portrait "screens" and cards** (facility cards, the goal-finder panel, class previews, gallery tiles), shown at ≤ ~1.6× their size. They never run full-bleed on desktop.
3. **Full-bleed backgrounds use the widest photos** (782–840 px) under a heavy black vignette, film grain, light beams and dust, with a slow pan. On mobile (390 px), the portrait video loops play full-bleed at near-native size.
4. **Everything is swappable.** When the client sends real footage, I add it to the config, re-run `npm run media`, and update `src/lib/media.ts`.

## Inventory

| # | File | Type | Size (px) | Length | KB | What it shows | Class | Interface / overlay found | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| V1 | Recording 2026-11-17 120344.mp4 | video | 344×620 | 22.0 s | 2 986 | Gym-floor montage: squat bay, BUILD MUSCLES platform, dumbbell rack, benches; ends on an address card | gym floor / strength | VIVA watermark (top); text overlays at 0–8 s; glitch transitions; 12 px black bar | **Partly usable**: 4 clean shots of ~0.6–1 s each (8–16 s) |
| V2 | Recording 2026-11-17 120525.mp4 | video | 360×600 | 13.0 s | 1 662 | Opens on an iPhone call screen ("Viva Premium Gym"), then 0.6 s beat cuts: treadmills at sunset, lifting platform, white machines, POWER neon, deadlift, spin room; logo end card | gym floor / branding | Phone UI (0–3.4 s); VIVA watermark (bottom right) | **Partly usable**: 3 shots (4.1–5.9 s) plus the end-card logo |
| V3 | Recording 2026-11-17 121608.mp4 | video | 366×608 | 19.0 s | 2 677 | Zumba/dance class: instructor close-up, wide room, white-top lead, fog/smoke shot | class (Zumba) | VIVA watermark (bottom right) | **Usable as demo**: long 3.8–4 s shots, the best clip |
| V4 | viva_cardio.mp4 | video | 356×628 | 20.0 s | 2 648 | Locker door, Viva jersey, trainer stretch, spin, treadmill screen, stair climber, ellipticals, trainer coaching ×5, member at the neon bull-logo wall; logo end card | cardio / trainer / branding | No watermark; 2 px border | **Usable as demo**: clean but cut every ~1 s |
| P1 | Screenshot 2026-11-17 120429.png | image | 508×577 | — | 414 | Member on a lat pulldown (back view) | strength / member | VIVA logo printed at the top | Usable (cropped under the logo) |
| P2 | Screenshot 2026-11-17 120453.png | image | 357×602 | — | 287 | Treadmills at sunset (a frame of V2) | cardio | VIVA watermark | **Unusable**: tiny duplicate of V2 |
| P3 | Screenshot 2026-11-17 121429.png | image | 842×577 | — | 822 | Cardio zone: treadmills, elliptical, spin bikes, LED wall, flip tyre | cardio | 2 carousel arrows | Usable (arrows painted out) |
| P4 | Screenshot 2026-11-17 121627.png | image | 401×470 | — | 382 | Rajput Tower exterior with the VIVA PREMIUM GYM sign | exterior | — | Usable small (≤ 400 px) |
| P5 | Screenshot 2026-11-17 121736.png | image | 786×560 | — | 722 | White plate-loaded machines, mirrors, LED strips | strength | 1 carousel arrow | Usable (arrow painted out) |
| P6 | Screenshot 2026-11-17 121804.png | image | 628×582 | — | 651 | Gold-lit corridor, MUSCLES/ENERGY neon, Viva belt | gym floor | Caption text along the top | Usable (cropped) |
| P7 | Screenshot 2026-11-17 121812.png | image | 475×585 | — | 410 | Treadmills with touchscreens, stair climber | cardio | Caption text along the top | Usable (cropped) |
| P8 | Screenshot 2026-11-17 121821.png | image | 472×582 | — | 417 | Reception lounge: sofas, gold tables, plants, balloons | lounge (≈ café ambience) | — | Usable |
| P9 | Screenshot 2026-11-17 121840.png | image | 635×576 | — | 645 | Lifting platform, BUILD MUSCLES neon, bumper plates | strength | — | Usable |
| P10 | Screenshot 2026-11-17 121850.png | image | 478×576 | — | 455 | Glass entrance into the spin room, flowers | gym floor | — | Usable |
| P11 | Screenshot 2026-11-17 121900.png | image | 282×630 | — | 278 | Spin bikes (narrow strip) | cardio | — | **Unusable**: 282 px wide, duplicate of P12 |
| P12 | Screenshot 2026-11-17 121912.png | image | 666×378 | — | 357 | Spin room with the big LED "VVV" wall | cardio / class | — | Usable |
| P13 | Screenshot 2026-11-17 121920.png | image | 710×462 | — | 529 | Strength floor, gold POWER / MUSCLES neon | strength | Carousel arrow at the left edge | Usable (cropped) |
| P14 | Screenshot 2026-11-17 121931.png | image | 803×473 | — | 624 | Widest floor shot: ENERGY / HEAT neon, white LED strips | gym floor | Carousel arrow at the left edge | Usable (cropped), **best wide image** |

**No logo file** is in the folder. `public/media/logo-stopgap.png` (272×118) is cut from V2's end card and is good enough for a small nav logo only. The intro needs the real file (SVG or PNG ≥ 2000 px).

## Processed outputs

**Video loops**: `public/media/video/<id>.mp4` (H.264, CRF 26, faststart, no audio) and `.webm` (VP9), plus `.jpg`/`.avif` posters and a 20 px blurred placeholder in the manifest. All are 360×576, 30 fps and hard-cut montages, so the loop point reads as just another cut.

| ID | Built from | Length | MP4 / WebM | Shows | Crop focus |
|---|---|---|---|---|---|
| `floor` | V1 + V2 shots | 4.9 s | 313 / 401 KB | Squat bay, BUILD MUSCLES, dumbbells, platform, white machines, bench, POWER neon | centre |
| `class-wide` | V3 | 7.7 s | 374 / 462 KB | Wide Zumba class, then the fog shot | centre |
| `class-lead` | V3 | 7.9 s | 453 / 592 KB | Lead dancers close up | centre-left |
| `cardio` | V4 | 4.7 s | 200 / 286 KB | Spin, treadmill screen, stair climber, ellipticals | centre |
| `trainer` | V4 | 5.0 s | 227 / 332 KB | Trainer coaching a member on 5 stations | centre |
| `bull-wall` | V4 (boomerang) | 5.9 s | 150 / 196 KB | Member at the backlit bull-logo wall | left (logo) |

**Photos**: `public/media/img/<id>-<w>.avif|.webp` at 640 px plus native width (never upscaled).

| ID | Source | Size (px) | Crop focus |
|---|---|---|---|
| `floor-energy` | P14 | 782×470 | centre-right (ENERGY) |
| `floor-power` | P13 | 694×460 | centre |
| `cardio-zone` | P3 | 840×574 | centre |
| `strength-white` | P5 | 784×558 | right |
| `corridor-gold` | P6 | 626×568 | centre (vanishing point) |
| `build-muscles` | P9 | 632×574 | right |
| `spin-room` | P12 | 664×376 | centre |
| `lat-pulldown` | P1 | 506×532 | centre |
| `treadmills` | P7 | 472×572 | left |
| `lounge` | P8 | 470×580 | left |
| `entrance` | P10 | 476×574 | right |
| `exterior` | P4 | 398×468 | centre-top (sign) |
| `lockers` | V4 @ 0.25 s | 356×620 | left |
| `jersey` | V4 @ 1.0 s | 356×620 | centre |
| `trainer-stretch` | V4 @ 2.0 s | 356×620 | centre |

## Proposed section → media assignment

| Time | Section | Media | Notes |
|---|---|---|---|
| — | Intro | real logo file (**needed**), `bull-wall` frame as an optional glow reference | The stopgap logo is too small for the intro's "emerge from darkness" moment |
| 05:00 | Hero | **Desktop:** `floor-energy` full-bleed, slow pan, vignette, light shafts and dust. **Mobile:** `floor` loop full-bleed | No wide video exists. The brief's "best wide gym-floor clip" needs client footage |
| — | Marquee | none (type only) | |
| 06:30 | Story | `corridor-gold` (left backdrop). Timeline: `exterior` (doors open), `class-wide` (community), `bull-wall` (Viva 2.0) | |
| 09:00 | Goal finder | Burn fat → `cardio`; Build muscle → `floor`; Move & feel good → `class-wide`; Athlete → `trainer`. Matching photos (`cardio-zone`, `build-muscles`, `spin-room`, `lat-pulldown`) as the blurred full-bleed backdrop | Video swaps inside a large portrait "screen", lit by a light wipe |
| 11:00 | Facilities | Equipment → `floor` (video); Steam bath → **missing**; Acupuncture shower → **missing**; Lockers → `lockers`; Trainers → `trainer` (video); Healthy café → `lounge`; WiFi & parking → `exterior`; Hygiene → `treadmills` | Missing cards get a lit placeholder: an icon with an LED-strip frame |
| 13:00 | Classes | Hover previews: Zumba/Bhangra/Dance → `class-lead`, Aerobics → `class-wide`, CrossFit → `trainer`, Yoga → **missing** (falls back to `trainer-stretch`) | |
| 15:00 | Café | `lounge` (stand-in) | **Needs** real café, shake and meal photos |
| 17:00 | Coaches | Placeholder cards; `trainer` / `trainer-stretch` as ambient background | **Needs** portraits of Ashmita, Deepak and the others |
| 18:30 | Memories | `class-wide`, `class-lead`, `bull-wall`, `jersey`, `entrance`, `spin-room` | **Needs** Benog trek, festival and Sunil Singh (karate) photos |
| 19:30 | Proof | `floor-power` (dim backdrop) | |
| 20:30 | Plans | none (cards and light) | |
| 21:30 | Book trial | none (light strip and heartbeat) | |
| 22:00 | Footer | `bull-wall` (small, glowing), `exterior` next to the address | |

## Still needed from the client

1. **Logo file**: SVG, or a transparent PNG ≥ 2000 px wide.
2. **Original, uncompressed footage** (not Instagram screen recordings), ideally landscape 1080p or 4K and 10–20 s per shot without text or watermarks:
   - a wide gym-floor shot for the hero (most important)
   - steam bath and acupuncture shower
   - the café counter, shakes and meals
   - Yoga and Bhangra classes
3. **Photos** at ≥ 1600 px: trainer portraits (Ashmita, Deepak and the rest of the team), the Benog trek, festivals, Sunil Singh (karate), and the gym exterior in daylight.
4. **Permission** to show the members who appear in the reels and photos.
