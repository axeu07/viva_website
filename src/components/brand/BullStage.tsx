/**
 * The galloping bull, drawn in the logo's own coordinate system (same viewBox as <Logo />) so it can sit
 * exactly on top of it. Intro.tsx animates it: gallop → skid stop → the body morphs into V·I·V·A.
 *
 * Parts (classes the intro targets):
 *   .b-body   whole bull (moves in x, bobs in y)
 *   .b-head   the logo's bull head (never morphs; ends exactly on the logo head)
 *   .b-slice[data-l]  torso slices, each becomes a letter
 *   .b-leg[data-leg]  legs (d swapped per gallop frame, then morphed into letters)
 *   .b-tail, .b-facets (muscle highlights), .b-glint, .b-streaks, .b-shadow (ground contact shadow)
 *   .b-relief  lighting primitives of the sculpt filter; the intro flattens their surfaceScale during
 *              the morph so the letters hand over cleanly to the flat logo gold
 *
 * Realism: the whole bull runs through one "sculpt" filter. A height map is built from the silhouette
 * blurred at four radii (a smooth dome, rounder in the middle than at the rim), plus a little of the
 * paint's own luminance (so the muscle highlights bulge). It is then lit with a diffuse key light, a
 * tight specular highlight and a warm rim light from behind, so it reads as cast gold, not flat vector.
 */
import { GoldDefs, HeadDetails } from "../Logo";
import { BACK_LINE, HEAD_OUTLINE, LETTER_ORDER, LOGO_VIEWBOX, STANDING, TAIL, TORSO_SLICES, type LegId } from "./geometry";

const FAR: LegId[] = ["hindFar", "foreFar"];
const NEAR: LegId[] = ["hindNear", "foreNear"];

export default function BullStage({ id }: { id: string }) {
  const { x, y, w, h } = LOGO_VIEWBOX;
  const bull = `url(#${id}-bull)`;
  return (
    <svg aria-hidden className="it-bull" viewBox={`${x} ${y} ${w} ${h}`}>
      <defs>
        <GoldDefs id={id} />
        <linearGradient id={`${id}-bull`} gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="460">
          <stop offset="0" stopColor="#F4DDA6" />
          <stop offset=".22" stopColor="#C99E5C" />
          <stop offset=".42" stopColor="#8E652F" />
          <stop offset=".55" stopColor="#B98E50" />
          <stop offset=".75" stopColor="#6E4C24" />
          <stop offset="1" stopColor="#3A2712" />
        </linearGradient>
        <linearGradient id={`${id}-dark`} gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="450">
          <stop offset="0" stopColor="#8A6638" />
          <stop offset="1" stopColor="#3E2A14" />
        </linearGradient>
        <linearGradient id={`${id}-streak`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F2DCA8" stopOpacity="0" />
          <stop offset="1" stopColor="#F2DCA8" stopOpacity=".55" />
        </linearGradient>
        <clipPath id={`${id}-torso`}>
          {LETTER_ORDER.map((k) => (
            <path key={k} d={TORSO_SLICES[k]} />
          ))}
        </clipPath>
        <radialGradient id={`${id}-muscle`}>
          <stop offset="0" stopColor="#FFF3D6" stopOpacity=".3" />
          <stop offset="1" stopColor="#FFF3D6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-belly`}>
          <stop offset="0" stopColor="#2a1a08" stopOpacity=".6" />
          <stop offset="1" stopColor="#2a1a08" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0" stopColor="#000" stopOpacity=".75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-sculpt`} x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
          {/* height map: silhouette blurred at four radii -> a smooth dome */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="18" result="b2" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="40" result="b3" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="75" result="b4" />
          <feComposite in="b1" in2="b2" operator="arithmetic" k2=".18" k3=".3" result="h01" />
          <feComposite in="b3" in2="b4" operator="arithmetic" k2=".32" k3=".3" result="h02" />
          <feComposite in="h01" in2="h02" operator="arithmetic" k2="1" k3="1" result="h0" />
          {/* + a little of the paint's luminance, so highlights bulge and dark details engrave */}
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .5 .4 .1 0 0" result="lum" />
          <feGaussianBlur in="lum" stdDeviation="5" result="lumS" />
          <feComposite in="h0" in2="lumS" operator="arithmetic" k2="1" k3=".12" result="hr" />
          <feGaussianBlur in="hr" stdDeviation="2.5" result="h" />
          {/* key light (diffuse, multiplied onto the gold) */}
          <feDiffuseLighting className="b-relief" in="h" surfaceScale="30" diffuseConstant="1.45" lightingColor="#fff" result="diff">
            <feDistantLight azimuth="235" elevation="42" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" in2="diff" operator="arithmetic" k1="1.05" result="lit" />
          {/* specular highlight */}
          <feSpecularLighting className="b-relief" in="h" surfaceScale="30" specularConstant="1.1" specularExponent="24" lightingColor="#FFF0CC" result="spec">
            <feDistantLight azimuth="240" elevation="30" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
          {/* warm rim light from behind-right */}
          <feSpecularLighting className="b-relief" in="h" surfaceScale="30" specularConstant=".9" specularExponent="20" lightingColor="#E8B870" result="rim">
            <feDistantLight azimuth="20" elevation="18" />
          </feSpecularLighting>
          <feComposite in="rim" in2="SourceAlpha" operator="in" result="rimIn" />
          <feComposite in="lit" in2="specIn" operator="arithmetic" k2="1" k3=".9" result="l2" />
          <feComposite in="l2" in2="rimIn" operator="arithmetic" k2="1" k3=".6" />
        </filter>
        {/* horizontal motion blur; stdDeviation is driven by the bull's speed */}
        <filter id={`${id}-blur`} x="-20%" y="-10%" width="140%" height="120%">
          <feGaussianBlur className="b-blur" stdDeviation="0 0" />
        </filter>
      </defs>

      <g className="b-body">
        <ellipse className="b-shadow" cx="610" cy="452" rx="360" ry="20" fill={`url(#${id}-shadow)`} />
        <g className="b-streaks" opacity="0">
          {[150, 205, 262, 318].map((sy, i) => (
            <rect key={sy} x={40 + i * 28} y={sy} width={250 - i * 34} height={3} rx={1.5} fill={`url(#${id}-streak)`} />
          ))}
        </g>
        <g className="b-motion" filter={`url(#${id}-blur)`}>
          <g className="b-sculpt" filter={`url(#${id}-sculpt)`}>
          {FAR.map((k) => (
            <path key={k} className="b-leg" data-leg={k} d={STANDING[k]} fill={`url(#${id}-dark)`} />
          ))}
          <path className="b-tail" d={TAIL} fill={`url(#${id}-dark)`} />
          {LETTER_ORDER.map((k) => (
            <path key={k} className="b-slice" data-l={k} d={TORSO_SLICES[k]} fill={bull} />
          ))}
          {/* soft muscle masses: shoulder, hip, ribcage, shaded belly */}
          <g className="b-facets" clipPath={`url(#${id}-torso)`}>
            <ellipse cx="760" cy="150" rx="70" ry="80" fill={`url(#${id}-muscle)`} />
            <ellipse cx="400" cy="160" rx="75" ry="70" fill={`url(#${id}-muscle)`} />
            <ellipse cx="590" cy="170" rx="90" ry="45" fill={`url(#${id}-muscle)`} opacity=".6" />
            <ellipse cx="620" cy="300" rx="420" ry="40" fill={`url(#${id}-belly)`} opacity=".5" />
          </g>
          {NEAR.map((k) => (
            <path key={k} className="b-leg" data-leg={k} d={STANDING[k]} fill={bull} />
          ))}
          {/* specular glint travelling along the back */}
          <path className="b-glint" d={BACK_LINE} pathLength={1000} fill="none" stroke="#fffaf0" strokeWidth="5" strokeLinecap="round" strokeDasharray="70 1000" strokeDashoffset="1000" />
          <g className="b-head">
            <path d={HEAD_OUTLINE} fill={`url(#${id}-gold)`} />
            <HeadDetails />
          </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
