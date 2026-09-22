// Renders the footer character clip: 169 PNG frames through Chromium, then
// two H.264 encodes, then the gaze lookup table that app/footer-background.tsx
// seeks with.
//
//   node scripts/render-tooth.mjs            full run
//   node scripts/render-tooth.mjs --preview  one frame per cardinal direction
//
// The ffmpeg binary comes from the imageio-ffmpeg wheel (pip install
// imageio-ffmpeg); it is the only build here compiled with libx264.

import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { FPS, FRAMES, HEIGHT, WIDTH, angleForFrame, frameSvg } from './tooth-frame.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const framesDir = path.join(root, 'frames');
const preview = process.argv.includes('--preview');

function ffmpegPath() {
  return execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'])
    .toString()
    .trim();
}

// The preinstalled Chromium predates this Playwright build, so point at it
// directly instead of downloading another one.
const CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

async function renderFrames(indices, namer) {
  const browser = await chromium.launch({ executablePath: CHROMIUM });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  for (const index of indices) {
    const svg = frameSvg(angleForFrame(index));
    await page.setContent(
      `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden}svg{display:block}</style>${svg}`,
      { waitUntil: 'load' },
    );
    await page.screenshot({ path: namer(index), type: 'png' });
  }
  await browser.close();
}

if (preview) {
  mkdirSync(framesDir, { recursive: true });
  // Right, down, left, up — a quarter of the orbit apart.
  const quarters = [0, Math.round(FRAMES / 4), Math.round(FRAMES / 2), Math.round((FRAMES * 3) / 4)];
  await renderFrames(quarters, (i) => path.join(framesDir, `preview-${String(i).padStart(3, '0')}.png`));
  console.log('preview frames:', quarters.join(', '));
} else {
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  const indices = Array.from({ length: FRAMES }, (_, i) => i);
  await renderFrames(indices, (i) => path.join(framesDir, `frame-${String(i).padStart(3, '0')}.png`));
  console.log(`rendered ${FRAMES} frames`);

  const ffmpeg = ffmpegPath();
  const input = ['-framerate', String(FPS), '-i', path.join(framesDir, 'frame-%03d.png')];
  const source = path.join(root, 'public', 'footer-background.mp4');
  const scrub = path.join(root, 'public', 'footer-scrub.mp4');

  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...input,
    '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', source], { stdio: 'inherit' });

  // All-intra derivative: every frame is a keyframe, so random seeking lands
  // on the requested gaze direction immediately.
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', source,
    '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-g', '1',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', scrub], { stdio: 'inherit' });
  console.log('encoded', path.relative(root, source), 'and', path.relative(root, scrub));

  const table = indices.map((i) => [
    Number(angleForFrame(i).toFixed(6)),
    Number((i / FPS).toFixed(5)),
  ]);
  writeFileSync(path.join(root, 'app', 'gaze-frames.json'), `${JSON.stringify(table, null, 2)}\n`);
  console.log(`wrote app/gaze-frames.json (${table.length} rows)`);
}
