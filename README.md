# Viva Premium Gym: demo landing page

A single-page, front-end-only demo site for Viva Premium Gym & Café, Dehradun. It tells the story of one day at the gym, from "Lights on" at 05:00 to "Lights off" at 22:00. It has no backend: the enquiry form opens a pre-filled WhatsApp message to +91 70601 11110.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to /out (deploy anywhere static)
npm run media      # re-process the source videos and photos (needs ffmpeg)
```

Set `NEXT_PUBLIC_SITE_URL` to the real domain before building. The canonical URL, Open Graph tags, sitemap, robots.txt and JSON-LD all use it.

## Where things live

| What | File |
|---|---|
| All copy, facts, timetable, menu, plans and crew | `src/lib/content.ts` |
| Which video or photo appears where | `src/lib/media.ts`, `media-map.md` |
| SEO structured data (HealthClub / LocalBusiness) | `src/lib/seo.ts` |
| Page order | `src/app/page.tsx` |
| Logo | `src/components/Logo.tsx` |

## Placeholders the client must fill

Everything below is shown on the site as a placeholder, a `SAMPLE` / `TO CONFIRM` / `PHOTO COMING` tag, or is left out until it's confirmed. Never replace these with invented facts.

### Business details (`src/lib/content.ts` → `contact`, `hours`)
- [ ] **Email address.** Two versions exist online (`Vivapremiumgym@gmail.com`, `vivagym@gmail.com`). Confirm which one; it's hidden until then.
- [ ] **Google Maps link** (`contact.googleMaps`). The site currently uses a Maps search for the address.
- [ ] **Google reviews link** (`contact.googleReviews`). It currently falls back to the Maps search.
- [ ] **Sunday hours** (`hours.sunday`). The site shows "Sunday: to confirm", and the live open/closed chip treats Sunday as closed.
- [ ] **Viva app** Google Play URL (`contact.appUrl`). Not shown yet.
- [ ] **Website domain** (`NEXT_PUBLIC_SITE_URL`, default in `src/lib/seo.ts`).

### Brand
- [ ] **Logo file** (SVG preferred) → `REAL_LOGO` in `src/components/Logo.tsx`. The demo draws VIVA as type; the nav stopgap is cut from a low-res reel.
- [ ] **Higher-resolution footage.** All source reels and screenshots are about 350 px wide, so videos only appear at portrait-card size.

### Sections
- [ ] **04 Classes:** the real weekly timetable (`scoreboard.schedule`: times, rooms, durations, intensity). It's tagged `SAMPLE TIMETABLE`.
- [ ] **05 Café:** the real menu items and prices (`shakeBar.board`). It's tagged `SAMPLE MENU`, with prices shown as "₹ to confirm". Café photos too (the locker-room café door has none yet).
- [ ] **06 Crew:** names for trainers 03 and 04, roles for everyone, and portrait photos (`crew.people`). Ashmita and Deepak are confirmed names; the others are tagged `TO CONFIRM`.
- [ ] **07 Memory wall:** photos of the trek, the festival and the member spotlight (Sunil Singh), plus permission to feature him (`memoryWall.frames`, `media: null`).
- [ ] **08 Big numbers:** real review quotes, used only with the reviewers' permission. Only summarised themes are shown now.
- [ ] **09 Membership:** plan names, what each includes, and prices for 1 / 3 / 6 / 12 months (`accessCards`). They show `₹ [YOUR PRICE]` and are tagged `TO CONFIRM`.
- [ ] **03 Locker room:** photos for steam, the acupuncture shower and the café (`lockerRoom`, `media: null` → `PHOTO COMING`).
- [ ] **02 Goal console:** the sample programs are illustrative (tagged `SAMPLE PROGRAM`). Have a trainer check them.
- [ ] **Open Graph image:** a proper 1200×630 share image. The site uses the gym-floor photo for now.

## Accessibility and motion
- The intro plays once per browser session. Any key press or click skips it.
- `prefers-reduced-motion` removes the flicker, tilt, scroll-scrubbing and pinning. The horizontal rows become native swipe rows, and every object still works.
- Hover-only effects (cursor previews, floating portrait cards) always have a tap or keyboard equivalent.
- Light switch (bottom right): toggles lights-off mode with a flashlight cursor.
