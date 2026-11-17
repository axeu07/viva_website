#!/usr/bin/env node
/**
 * Re-runnable media pipeline: `npm run media` (add `-- --force` to rebuild everything).
 *
 * Source:  ../viva_videos (override with VIVA_MEDIA_SRC). Originals are never modified.
 * Output:  media-src/raw/         untouched copies of the originals (not deployed)
 *          public/media/video/    <id>.mp4 (H.264) + <id>.webm (VP9) loops, <id>.jpg/.avif posters
 *          public/media/img/      <id>-<w>.avif / .webp photos and stills
 *          public/media/logo-stopgap.png
 *          src/lib/media-manifest.json   (read by src/lib/media.ts; includes tiny blur placeholders)
 *
 * Edit scripts/media.config.mjs to add or change clips and photos.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, statSync, readdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sources, clips, frames, photos, photoWidths, loopSize, logoStopgap } from "./media.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.env.VIVA_MEDIA_SRC ?? path.resolve(root, "..", "viva_videos");
const OUT = path.join(root, "public", "media");
const RAW = path.join(root, "media-src", "raw"); // outside public/: never deployed
const VID = path.join(OUT, "video");
const IMG = path.join(OUT, "img");
const TMP = path.join(root, ".media-tmp");
const MANIFEST = path.join(root, "src", "lib", "media-manifest.json");
const FORCE = process.argv.includes("--force");

// ── helpers ────────────────────────────────────────────────────────────────
function run(cmd, args, { capture = false } = {}) {
  const r = spawnSync(cmd, args, { encoding: capture ? "utf8" : undefined, stdio: capture ? "pipe" : ["ignore", "ignore", "pipe"], maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) {
    const err = r.stderr?.toString().split("\n").slice(-12).join("\n");
    throw new Error(`${cmd} failed (${r.status}):\n${err}`);
  }
  return r.stdout;
}
const ff = (args) => run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args]);
const probe = (file) => JSON.parse(run("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file], { capture: true }));
const fresh = (out, ...inputs) => !FORCE && existsSync(out) && inputs.every((i) => statSync(i).mtimeMs <= statSync(out).mtimeMs);
const kb = (f) => Math.round(statSync(f).size / 1024);
const srcPath = (alias) => {
  const s = sources[alias];
  if (!s) throw new Error(`Unknown source alias "${alias}" in media.config.mjs`);
  return { ...s, path: path.join(SRC, s.file) };
};
const tinyPlaceholder = (input, filters = []) => {
  const out = path.join(TMP, `ph-${Math.random().toString(36).slice(2)}.webp`);
  ff(["-i", input, "-frames:v", "1", "-vf", [...filters, "scale=20:-2", "gblur=sigma=1.2"].join(","), "-c:v", "libwebp", "-quality", "40", out]);
  const b64 = readFileSync(out).toString("base64");
  rmSync(out);
  return `data:image/webp;base64,${b64}`;
};

// ── preflight ──────────────────────────────────────────────────────────────
for (const bin of ["ffmpeg", "ffprobe"]) {
  if (spawnSync(bin, ["-version"], { stdio: "ignore" }).status !== 0) {
    console.error(`✗ ${bin} not found on PATH.\n  Install on Windows:  winget install Gyan.FFmpeg\n  Then open a new terminal and re-run: npm run media`);
    process.exit(1);
  }
}
if (!existsSync(SRC)) {
  console.error(`✗ Media source folder not found: ${SRC}\n  Set VIVA_MEDIA_SRC to override.`);
  process.exit(1);
}
for (const d of [RAW, VID, IMG, TMP]) mkdirSync(d, { recursive: true });

const prev = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { videos: {}, images: {} };
const manifest = { generatedAt: new Date().toISOString(), inventory: [], videos: {}, images: {}, logoStopgap: null, unmapped: [] };

// ── 1. inventory + raw copies ──────────────────────────────────────────────
console.log(`\n▸ Inventory (${SRC})`);
const mapped = new Set([...Object.values(sources).map((s) => s.file), ...photos.map((p) => p.file)]);
for (const file of readdirSync(SRC).sort()) {
  const full = path.join(SRC, file);
  if (!statSync(full).isFile()) continue;
  const info = probe(full);
  const v = info.streams.find((s) => s.codec_type === "video");
  const entry = {
    file,
    type: /\.(png|jpe?g|webp|heic)$/i.test(file) ? "image" : "video",
    width: v?.width ?? null,
    height: v?.height ?? null,
    duration: info.format.duration ? +(+info.format.duration).toFixed(2) : null,
    sizeKB: Math.round(+info.format.size / 1024),
  };
  manifest.inventory.push(entry);
  if (!mapped.has(file)) manifest.unmapped.push(file);
  const rawOut = path.join(RAW, file);
  if (!existsSync(rawOut) || statSync(rawOut).size !== statSync(full).size) copyFileSync(full, rawOut);
  console.log(`  ${entry.type.padEnd(5)} ${String(entry.width).padStart(4)}×${String(entry.height).padEnd(4)} ${entry.duration ? (entry.duration + "s").padEnd(7) : "       "} ${String(entry.sizeKB).padStart(5)} KB  ${file}`);
}

// ── 2. video loops ─────────────────────────────────────────────────────────
console.log("\n▸ Video loops");
const { w: LW, h: LH } = loopSize;
for (const clip of clips) {
  const mp4 = path.join(VID, `${clip.id}.mp4`);
  const webm = path.join(VID, `${clip.id}.webm`);
  const jpg = path.join(VID, `${clip.id}.jpg`);
  const avif = path.join(VID, `${clip.id}.avif`);
  const inputs = [...new Set(clip.segments.map(([a]) => a))];
  const inputPaths = inputs.map((a) => srcPath(a).path);

  if (!(fresh(mp4, ...inputPaths) && fresh(webm, ...inputPaths) && prev.videos?.[clip.id])) {
    // Build one filtergraph: trim each segment, crop out UI/watermark, normalise size/fps, concat.
    const parts = clip.segments.map(([alias, a, b], i) => {
      const idx = inputs.indexOf(alias);
      const { crop } = srcPath(alias);
      return `[${idx}:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS,crop=${crop},scale=${LW}:${LH}:force_original_aspect_ratio=increase:flags=lanczos,crop=${LW}:${LH},setsar=1,fps=30,format=yuv420p[s${i}]`;
    });
    let graph = parts.join(";") + ";" + clip.segments.map((_, i) => `[s${i}]`).join("") + `concat=n=${clip.segments.length}:v=1:a=0[cat]`;
    graph += clip.boomerang ? ";[cat]split[f][r];[r]reverse[rv];[f][rv]concat=n=2:v=1:a=0[out]" : ";[cat]null[out]";
    const master = path.join(TMP, `${clip.id}-master.mkv`);
    ff([...inputPaths.flatMap((p) => ["-i", p]), "-filter_complex", graph, "-map", "[out]", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "veryfast", master]);
    ff(["-i", master, "-an", "-c:v", "libx264", "-crf", "26", "-preset", "veryfast", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
    ff(["-i", master, "-an", "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", webm]);
    ff(["-ss", "0.2", "-i", master, "-frames:v", "1", "-q:v", "3", jpg]);
    ff(["-ss", "0.2", "-i", master, "-frames:v", "1", "-c:v", "libaom-av1", "-still-picture", "1", "-crf", "32", "-b:v", "0", avif]);
    rmSync(master);
  }
  const duration = +(+probe(mp4).format.duration).toFixed(2);
  manifest.videos[clip.id] = {
    id: clip.id,
    label: clip.label,
    width: LW,
    height: LH,
    duration,
    mp4: `/media/video/${clip.id}.mp4`,
    webm: `/media/video/${clip.id}.webm`,
    poster: `/media/video/${clip.id}.jpg`,
    posterAvif: `/media/video/${clip.id}.avif`,
    placeholder: prev.videos?.[clip.id]?.placeholder && fresh(mp4, ...inputPaths) && !FORCE ? prev.videos[clip.id].placeholder : tinyPlaceholder(jpg),
    sizeKB: { mp4: kb(mp4), webm: kb(webm) },
  };
  const warn = kb(mp4) > 3072 ? "  ⚠ over 3 MB" : "";
  console.log(`  ${clip.id.padEnd(12)} ${duration}s  mp4 ${kb(mp4)} KB  webm ${kb(webm)} KB${warn}`);
}

// ── 3. images (photos + stills) ────────────────────────────────────────────
function emitImage(id, label, input, filters, srcW, srcH, extra = {}) {
  const widths = [...new Set([...photoWidths.filter((w) => w < srcW), srcW])].sort((a, b) => a - b);
  const files = [];
  for (const w of widths) {
    const vf = [...filters, `scale=${w}:-2:flags=lanczos`].join(",");
    const avif = path.join(IMG, `${id}-${w}.avif`);
    const webp = path.join(IMG, `${id}-${w}.webp`);
    if (!fresh(avif, input)) ff(["-i", input, "-frames:v", "1", "-vf", vf, "-c:v", "libaom-av1", "-still-picture", "1", "-crf", "30", "-b:v", "0", avif]);
    if (!fresh(webp, input)) ff(["-i", input, "-frames:v", "1", "-vf", vf, "-c:v", "libwebp", "-quality", "82", webp]);
    files.push({ w, avif: `/media/img/${id}-${w}.avif`, webp: `/media/img/${id}-${w}.webp`, kb: kb(avif) });
  }
  const ph = prev.images?.[id]?.placeholder && !FORCE ? prev.images[id].placeholder : tinyPlaceholder(input, filters);
  manifest.images[id] = { id, label, width: srcW, height: srcH, widths: files.map((f) => f.w), base: `/media/img/${id}`, placeholder: ph, ...extra };
  console.log(`  ${id.padEnd(16)} ${srcW}×${srcH}  widths ${files.map((f) => f.w).join("/")}  (${files.map((f) => f.kb + "KB").join(", ")} avif)`);
}

console.log("\n▸ Photos");
for (const p of photos) {
  const input = path.join(SRC, p.file);
  const [cw, ch] = p.crop.split(":").map(Number);
  const filters = [...(p.delogo ?? []).map((b) => { const [x, y, w, h] = b.split(":"); return `delogo=x=${x}:y=${y}:w=${w}:h=${h}`; }), `crop=${p.crop}`];
  const even = (n) => n - (n % 2);
  emitImage(p.id, p.label, input, filters, even(cw), even(ch), { source: p.file });
}

console.log("\n▸ Stills from video");
for (const f of frames) {
  const s = srcPath(f.source);
  const still = path.join(TMP, `${f.id}.png`);
  ff(["-ss", String(f.t), "-i", s.path, "-frames:v", "1", "-vf", `crop=${s.crop}`, still]);
  const [cw, ch] = s.crop.split(":").map(Number);
  emitImage(f.id, f.label, still, [], cw - (cw % 2), ch - (ch % 2), { source: `${s.file} @ ${f.t}s` });
}

// ── 4. stopgap logo ────────────────────────────────────────────────────────
{
  const s = srcPath(logoStopgap.source);
  const out = path.join(OUT, "logo-stopgap.png");
  // black → transparent: alpha from brightness (black level removed), colour un-premultiplied so edges stay gold
  const L = "max(0,max(r(X,Y),max(g(X,Y),b(X,Y)))-12)";
  const A = `min(255,2.6*${L})`;
  const un = (c) => `min(255,${c}(X,Y)*255/max(1,${A}))`;
  const alpha = `format=rgba,geq=r='${un("r")}':g='${un("g")}':b='${un("b")}':a='${A}'`;
  ff(["-ss", String(logoStopgap.t), "-i", s.path, "-frames:v", "1", "-vf", `crop=${logoStopgap.crop},${alpha}`, out]);
  manifest.logoStopgap = { src: "/media/logo-stopgap.png", note: "Cut from a reel end card at low resolution. Replace with the client's logo file (SVG or large PNG)." };
  console.log(`\n▸ Stopgap logo → public/media/logo-stopgap.png`);
}

rmSync(TMP, { recursive: true, force: true });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n✓ Manifest → src/lib/media-manifest.json`);
if (manifest.unmapped.length) console.log(`ℹ Not used (see media-map.md):\n  ${manifest.unmapped.join("\n  ")}`);
