#!/usr/bin/env node
/**
 * Re-runnable media pipeline (`npm run media`).
 * Source: ../viva_videos (originals are never modified; they are copied to public/media/raw/).
 * Output: public/media/ (loops at 1920w/1080w as H.264 MP4 and VP9 WebM, posters, placeholders, AVIF/WebP photos).
 *
 * Phase 1: checks prerequisites only. The processing steps are implemented in Phase 2.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.env.VIVA_MEDIA_SRC ?? path.resolve(root, "..", "viva_videos");

function has(cmd) {
  const r = spawnSync(cmd, ["-version"], { stdio: "ignore", shell: process.platform === "win32" });
  return r.status === 0;
}

if (!has("ffmpeg") || !has("ffprobe")) {
  console.error("✗ ffmpeg/ffprobe not found on PATH.\n  Install on Windows:  winget install Gyan.FFmpeg\n  Then open a new terminal and re-run: npm run media");
  process.exit(1);
}
if (!existsSync(SRC)) {
  console.error(`✗ Media source folder not found: ${SRC}\n  Set VIVA_MEDIA_SRC to override.`);
  process.exit(1);
}

console.log(`✓ ffmpeg found. Source: ${SRC}`);
console.log("Media processing is implemented in Phase 2.");
