/**
 * Renders the Phase 4 approval sheet from the real geometry:
 *   (a) the full bull: standing, braced (skid stop) and the 6 gallop frames
 *   (b) the assembled head + VIVA logo beside the reference, plus a 50 % overlay
 * Run: node docs/intro-shapes/render.mts  →  docs/intro-shapes/*.svg + *.png (not deployed)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";
// @ts-expect-error TS5097: Node type stripping (node render.mts) needs the explicit .ts extension
import * as G from "../../src/components/brand/geometry.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

const GOLD = `
  <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="340">
    <stop offset="0" stop-color="#F2DCA8"/><stop offset=".24" stop-color="#DEC28C"/>
    <stop offset=".5" stop-color="#C8A46B"/><stop offset=".58" stop-color="#A6834F"/>
    <stop offset=".74" stop-color="#C8A46B"/><stop offset="1" stop-color="#E4CA98"/>
  </linearGradient>
  <linearGradient id="bull" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="460">
    <stop offset="0" stop-color="#F2DCA8"/><stop offset=".25" stop-color="#D9BC86"/>
    <stop offset=".6" stop-color="#BB9762"/><stop offset="1" stop-color="#927047"/>
  </linearGradient>
  <linearGradient id="goldDark" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="450">
    <stop offset="0" stop-color="#A88452"/><stop offset="1" stop-color="#6A5032"/>
  </linearGradient>`;

const head = `<path d="${G.HEAD_OUTLINE}" fill="url(#gold)"/>
  <g fill="none" stroke="#3b2a0e" stroke-width="4" stroke-linecap="round">
    ${G.HEAD_DETAILS.creases.map((d) => `<path d="${d}"/>`).join("")}<path d="${G.HEAD_DETAILS.jaw}"/>
  </g>
  <ellipse cx="${G.HEAD_DETAILS.eye.cx}" cy="${G.HEAD_DETAILS.eye.cy}" rx="${G.HEAD_DETAILS.eye.rx}" ry="${G.HEAD_DETAILS.eye.ry}" transform="rotate(${G.HEAD_DETAILS.eye.rotate} ${G.HEAD_DETAILS.eye.cx} ${G.HEAD_DETAILS.eye.cy})" fill="#3b2a0e"/>`;

function bull(legs: Record<G.LegId, string>, opts: { facets?: boolean } = {}) {
  const far = (["hindFar", "foreFar"] as const).map((k) => `<path d="${legs[k]}" fill="url(#goldDark)"/>`).join("");
  const near = (["hindNear", "foreNear"] as const).map((k) => `<path d="${legs[k]}" fill="url(#bull)"/>`).join("");
  const slices = G.LETTER_ORDER.map((k) => `<path d="${G.TORSO_SLICES[k]}" fill="url(#bull)"/>`).join("");
  const facets = opts.facets === false ? "" : `<g fill="none" stroke="#7d6040" stroke-opacity=".55" stroke-width="2.5">${G.FACETS.map((d) => `<path d="${d}"/>`).join("")}</g>`;
  return `${far}<path d="${G.TAIL}" fill="url(#goldDark)"/>${slices}${facets}${near}
    <path d="${G.BACK_LINE}" fill="none" stroke="#fffbe8" stroke-opacity=".5" stroke-width="3"/>${head}`;
}

const logo = () => `
  <g fill="url(#gold)" fill-rule="evenodd" stroke="url(#gold)" stroke-width="7" stroke-linejoin="round">
    ${G.LETTER_ORDER.map((k) => `<path d="${G.LETTERS[k]}"/>`).join("")}
  </g>
  ${head}
  <g stroke="url(#gold)" stroke-width="5" stroke-linecap="round">
    <line x1="${G.RULES.left.x1}" y1="${G.RULES.left.y}" x2="${G.RULES.left.x2}" y2="${G.RULES.left.y}"/>
    <line x1="${G.RULES.right.x1}" y1="${G.RULES.right.y}" x2="${G.RULES.right.x2}" y2="${G.RULES.right.y}"/>
  </g>
  <text x="${G.SUBLINE.x1}" y="${G.SUBLINE.baseline}" font-family="Montserrat, Manrope, Arial, sans-serif" font-weight="700" font-size="${G.SUBLINE.size}" textLength="${G.SUBLINE.x2 - G.SUBLINE.x1}" lengthAdjust="spacing" letter-spacing="27" fill="#EAE4DA">${G.SUBLINE.text}</text>`;

const ref = readFileSync(join(root, "public/media/logo-stopgap.png")).toString("base64");
const refImg = (op = 1) => `<image href="data:image/png;base64,${ref}" x="0" y="0" width="1088" height="472" opacity="${op}"/>`;

const W = 1100;
const cell = (x: number, y: number, s: number, inner: string, label: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><g transform="translate(-20 -20)">${inner}</g></g>
   <text x="${x + 8}" y="${y + 18}" fill="#b8ae9a" font-family="monospace" font-size="15" letter-spacing="2">${label}</text>`;

// Sheet A: the bull
const frames = Array.from({ length: G.GALLOP_FRAMES }, (_, i) => G.gallopPose(i));
const asLegs = (p: ReturnType<typeof G.gallopPose>) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v.d])) as Record<G.LegId, string>;
let a = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 2}" height="1500" viewBox="0 0 ${W * 2} 1500"><defs>${GOLD}</defs><rect width="100%" height="100%" fill="#101010"/>`;
a += `<text x="30" y="44" fill="#f2d48a" font-family="monospace" font-size="22" letter-spacing="4">(A) THE BULL: STANDING · SKID STOP (BRACED) · GALLOP FRAMES 1–6</text>`;
a += cell(20, 70, 1, `<line x1="40" x2="1080" y1="${G.GROUND}" y2="${G.GROUND}" stroke="#3a3428"/>${bull(G.STANDING)}`, "STANDING (REST POSE)");
a += cell(W + 20, 70, 1, `<line x1="40" x2="1080" y1="${G.GROUND}" y2="${G.GROUND}" stroke="#3a3428"/>${bull(G.BRACED)}`, "SKID STOP: FORELEGS BRACED");
frames.forEach((p, i) => {
  const bob = G.gallopBob(p);
  const col = i % 3;
  const row = Math.floor(i / 3);
  a += cell(20 + col * 730, 560 + row * 470, 0.66, `<line x1="40" x2="1080" y1="${G.GROUND}" y2="${G.GROUND}" stroke="#3a3428"/><g transform="translate(0 ${bob})">${bull(asLegs(p))}</g>`, `GALLOP ${i + 1} (BOB ${bob.toFixed(0)})`);
});
a += "</svg>";

// Sheet B: the logo vs the reference
let b = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 2}" height="1060" viewBox="0 0 ${W * 2} 1060"><defs>${GOLD}</defs><rect width="100%" height="100%" fill="#101010"/>`;
b += `<text x="30" y="44" fill="#f2d48a" font-family="monospace" font-size="22" letter-spacing="4">(B) ASSEMBLED LOGO: HEAD + VIVA (SVG) · REFERENCE · OVERLAY</text>`;
b += cell(20, 70, 1, logo(), "NEW SVG LOGO");
b += cell(W + 20, 70, 1, refImg(), "REFERENCE (CLIENT END CARD, 272 PX × 4)");
b += cell(20, 560, 1, `${logo()}<g opacity=".5">${refImg()}</g>`, "OVERLAY: REFERENCE AT 50 %");
b += cell(W + 20, 560, 1, `<g opacity=".35">${refImg()}</g><g fill="none" stroke="#5ef" stroke-width="1.5">${G.LETTER_ORDER.map((k) => `<path d="${G.LETTERS[k]}"/>`).join("")}<path d="${G.HEAD_OUTLINE}"/></g>`, "OUTLINES ON REFERENCE");
b += "</svg>";

for (const [name, svg] of [["a-bull", a], ["b-logo", b]] as const) {
  writeFileSync(join(here, `${name}.svg`), svg);
  await sharp(Buffer.from(svg)).png().toFile(join(here, `${name}.png`));
  console.log("wrote", name);
}
