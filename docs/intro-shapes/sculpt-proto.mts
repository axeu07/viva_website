// Prototype: sculpted (lit, 3D-reading) gold bull. Run: node docs/intro-shapes/sculpt-proto.mts <out.png>
import sharp from "sharp";
// @ts-expect-error TS5097
import * as G from "../../src/components/brand/geometry.ts";

const out = process.argv[2];
const legs = G.STANDING as Record<string, string>;
const torsoClip = G.LETTER_ORDER.map((k: string) => `<path d="${G.TORSO_SLICES[k]}"/>`).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 0 1030 480" width="${process.argv[3]||2060}" height="${Math.round((process.argv[3]||2060)*960/2060)}">
<defs>
  <radialGradient id="bg" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#1d1b18"/><stop offset="1" stop-color="#0e0e0e"/></radialGradient>
  <linearGradient id="bull" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="460">
    <stop offset="0" stop-color="#F4DDA6"/><stop offset=".22" stop-color="#C99E5C"/><stop offset=".42" stop-color="#8E652F"/>
    <stop offset=".55" stop-color="#B98E50"/><stop offset=".75" stop-color="#6E4C24"/><stop offset="1" stop-color="#3A2712"/>
  </linearGradient>
  <linearGradient id="dark" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="450">
    <stop offset="0" stop-color="#8A6638"/><stop offset="1" stop-color="#3E2A14"/>
  </linearGradient>
  <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="340">
    <stop offset="0" stop-color="#F2DCA8"/><stop offset=".3" stop-color="#D2B079"/><stop offset=".7" stop-color="#9E7843"/><stop offset="1" stop-color="#C7A26A"/>
  </linearGradient>
  <clipPath id="torso">${torsoClip}</clipPath>
  <radialGradient id="hi"><stop offset="0" stop-color="#FFF3D6" stop-opacity=".3"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>
  <radialGradient id="lo"><stop offset="0" stop-color="#2a1a08" stop-opacity=".6"/><stop offset="1" stop-color="#2a1a08" stop-opacity="0"/></radialGradient>
  <radialGradient id="shadow"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <filter id="sculpt" x="-10%" y="-20%" width="120%" height="140%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="b1"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="b2"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="40" result="b3"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="75" result="b4"/>
    <feComposite in="b1" in2="b2" operator="arithmetic" k2=".18" k3=".3" result="h01"/>
    <feComposite in="b3" in2="b4" operator="arithmetic" k2=".32" k3=".3" result="h02"/>
    <feComposite in="h01" in2="h02" operator="arithmetic" k2="1" k3="1" result="h0"/>
    <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .5 .4 .1 0 0" result="lum"/>
    <feGaussianBlur in="lum" stdDeviation="5" result="lumS"/>
    
    <feComposite in="h0" in2="lumS" operator="arithmetic" k2="1" k3=".12" result="hr"/>
    <feGaussianBlur in="hr" stdDeviation="2.5" result="h"/>
    
    <feDiffuseLighting in="h" surfaceScale="30" diffuseConstant="1.45" lighting-color="#fff" result="diff">
      <feDistantLight azimuth="235" elevation="42"/>
    </feDiffuseLighting>
    <feComposite in="SourceGraphic" in2="diff" operator="arithmetic" k1="1.05" result="lit"/>
    <feSpecularLighting in="h" surfaceScale="30" specularConstant="1.1" specularExponent="24" lighting-color="#FFF0CC" result="spec">
      <feDistantLight azimuth="240" elevation="30"/>
    </feSpecularLighting>
    <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
    <feSpecularLighting in="h" surfaceScale="30" specularConstant=".9" specularExponent="20" lighting-color="#E8B870" result="rim">
      <feDistantLight azimuth="20" elevation="18"/>
    </feSpecularLighting>
    <feComposite in="rim" in2="SourceAlpha" operator="in" result="rimIn"/>
    <feComposite in="lit" in2="specIn" operator="arithmetic" k2="1" k3=".9" result="l2"/>
    <feComposite in="l2" in2="rimIn" operator="arithmetic" k2="1" k3=".6"/>
  </filter>
</defs>
<rect x="0" y="0" width="1200" height="480" fill="url(#bg)"/>
<ellipse cx="610" cy="452" rx="360" ry="20" fill="url(#shadow)"/>
<g filter="url(#sculpt)">
  ${["hindFar","foreFar"].map(k=>`<path d="${legs[k]}" fill="url(#dark)"/>`).join("")}
  <path d="${G.TAIL}" fill="url(#dark)"/>
  ${G.LETTER_ORDER.map((k: string)=>`<path d="${G.TORSO_SLICES[k]}" fill="url(#bull)"/>`).join("")}
  <g clip-path="url(#torso)">
    <ellipse cx="760" cy="150" rx="70" ry="80" fill="url(#hi)"/>
    <ellipse cx="400" cy="160" rx="75" ry="70" fill="url(#hi)"/>
    <ellipse cx="590" cy="170" rx="90" ry="45" fill="url(#hi)" opacity=".6"/>
    <ellipse cx="300" cy="300" rx="420" ry="40" fill="url(#lo)" opacity=".5" transform="translate(320 0)"/>
      </g>
  ${["hindNear","foreNear"].map(k=>`<path d="${legs[k]}" fill="url(#bull)"/>`).join("")}
  <path d="${G.HEAD_OUTLINE}" fill="url(#gold)"/>
  <g fill="none" stroke="#3b2a0e" stroke-width="4" stroke-linecap="round">${G.HEAD_DETAILS.creases.map((d: string)=>`<path d="${d}"/>`).join("")}<path d="${G.HEAD_DETAILS.jaw}"/></g>
  <ellipse cx="928" cy="175" rx="6.5" ry="4" transform="rotate(32 928 175)" fill="#3b2a0e"/>
</g>
</svg>`;
if (out.endsWith(".svg")) (await import("node:fs")).writeFileSync(out, svg); else await sharp(Buffer.from(svg)).png().toFile(out);
console.log("ok");
