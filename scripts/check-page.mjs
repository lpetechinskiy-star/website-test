// Validation harness for the footer page. Expects `next start` (or `next dev`)
// on the URL below.
//
//   node scripts/check-page.mjs [http://localhost:3100] [screenshotDir]

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';
import { FPS } from './tooth-frame.mjs';

const BASE = process.argv[2] ?? 'http://localhost:3100';
const SHOTS = process.argv[3] ?? '/tmp/footer-shots';
const CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

mkdirSync(SHOTS, { recursive: true });

// Playwright's Chromium is built without the proprietary codecs, so it cannot
// decode the H.264 clip the page ships. For the duration of this run an
// all-intra WebM twin — transcoded from that very file, so identical frames,
// timing and seek points — is served locally and swapped into the same
// <video> element, keeping the component's code path under test. The page
// itself still ships only the mp4.
const twin = path.join(SHOTS, 'check-twin.webm');
if (!existsSync(twin)) {
  const ffmpeg = execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'])
    .toString().trim();
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y',
    '-i', path.join(root, 'public', 'footer-scrub.mp4'),
    '-an', '-c:v', 'libvpx', '-g', '1', '-b:v', '5M', '-deadline', 'realtime', '-cpu-used', '5',
    twin], { stdio: 'inherit' });
}

// Seeking needs byte ranges, so the twin is served by a small range-aware
// server rather than injected into the page's own asset tree.
const twinBody = readFileSync(twin);
const twinServer = createServer((request, response) => {
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range ?? '');
  const headers = {
    'Content-Type': 'video/webm',
    'Accept-Ranges': 'bytes',
    // The gaze check reads pixels back through a canvas, which needs CORS.
    'Access-Control-Allow-Origin': '*',
  };
  if (!range) {
    response.writeHead(200, { ...headers, 'Content-Length': twinBody.length });
    response.end(twinBody);
    return;
  }
  const start = range[1] ? Number(range[1]) : 0;
  const end = range[2] ? Number(range[2]) : twinBody.length - 1;
  response.writeHead(206, {
    ...headers,
    'Content-Range': `bytes ${start}-${end}/${twinBody.length}`,
    'Content-Length': end - start + 1,
  });
  response.end(twinBody.subarray(start, end + 1));
});
await new Promise((resolve) => twinServer.listen(0, '127.0.0.1', resolve));
const TWIN_URL = `http://127.0.0.1:${twinServer.address().port}/twin.webm`;

const browser = await chromium.launch({ executablePath: CHROMIUM });
const failures = [];
const check = (ok, label, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures.push(label);
};

async function useTwin(page) {
  await page.evaluate((url) => {
    const video = document.querySelector('.footer-background video');
    video.crossOrigin = 'anonymous';
    video.src = url;
  }, TWIN_URL);
}

async function openPage(options) {
  const page = await browser.newPage(options);
  await page.goto(BASE, { waitUntil: 'load' });
  // The footer sits at the end of the landing page, so bring it into view
  // before measuring anything.
  await page.evaluate(() => document.querySelector('.footer').scrollIntoView({ block: 'end', behavior: 'instant' }));
  await page.waitForTimeout(400);
  await useTwin(page);
  await page.waitForFunction(() => {
    const video = document.querySelector('.footer-background video');
    return video && video.readyState >= 2;
  });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

// --- desktop: gaze scrubbing -------------------------------------------------
{
  const page = await openPage({ viewport: { width: 1440, height: 900 } });

  const eye = await page.evaluate(() => {
    const rect = document.querySelector('.footer-background video').getBoundingClientRect();
    const scale = Math.max(rect.width / 1920, rect.height / 1080);
    return {
      x: rect.left + rect.width / 2 + (948 - 960) * scale,
      y: rect.top + rect.height / 2 + (418 - 540) * scale,
    };
  });

  // Right, down, left, up — screen-space Y grows downward.
  const cardinals = [
    ['right', 320, 0],
    ['down', 0, 320],
    ['left', -320, 0],
    ['up', 0, -320],
  ];

  // Reads the pupils straight out of the frame the page is showing: where the
  // character is actually looking, not where the lookup table says it should.
  const measure = () => page.evaluate(() => {
    const video = document.querySelector('.footer-background video');
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(video, 0, 0, 1920, 1080);
    const pupil = (cx, cy, r) => {
      const { data } = context.getImageData(cx - r, cy - r, r * 2, r * 2);
      let sumX = 0;
      let sumY = 0;
      let count = 0;
      for (let y = 0; y < r * 2; y += 1) {
        for (let x = 0; x < r * 2; x += 1) {
          const i = (y * r * 2 + x) * 4;
          const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (luminance < 90) { sumX += x; sumY += y; count += 1; }
        }
      }
      return count ? { x: cx - r + sumX / count - cx, y: cy - r + sumY / count - cy } : null;
    };
    return {
      time: video.currentTime,
      left: pupil(858, 418, 70),
      right: pupil(1038, 418, 70),
    };
  });

  const angleGap = (a, b) =>
    Math.abs(((a - b) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);

  for (const [name, dx, dy] of cardinals) {
    await page.mouse.move(eye.x + dx, eye.y + dy);

    // The component coalesces seeks through requestAnimationFrame, and this
    // headless build only reaches a handful of frames per second, so poll until
    // the shown frame settles instead of assuming one tick is enough.
    const wanted = Math.atan2(dy, dx);
    let shown = await measure();
    let measured = Number.NaN;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      shown = await measure();
      measured = Math.atan2(
        (shown.left.y + shown.right.y) / 2,
        (shown.left.x + shown.right.x) / 2,
      );
      if (angleGap(wanted, measured) < 0.2) break;
      await page.waitForTimeout(200);
    }

    check(
      angleGap(wanted, measured) < 0.2,
      `gaze ${name}`,
      `pupils at ${(measured * 180 / Math.PI).toFixed(1)}\u00b0, cursor at ${(wanted * 180 / Math.PI).toFixed(1)}\u00b0, ` +
      `frame ${(shown.time * FPS).toFixed(2)}`,
    );
    await page.screenshot({ path: path.join(SHOTS, `gaze-${name}.png`) });
  }

  const paused = await page.evaluate(() => document.querySelector('.footer-background video').paused);
  check(paused, 'desktop video stays paused');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, 'desktop has no horizontal overflow', `${overflow}px`);

  await page.screenshot({ path: path.join(SHOTS, 'desktop-1440.png') });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({ path: path.join(SHOTS, 'desktop-1920.png') });
  await page.close();
}

// --- mobile: stacking and looping playback -----------------------------------
for (const width of [700, 390, 320]) {
  const page = await openPage({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true });

  const box = await page.evaluate(() => {
    const top = (selector) => document.querySelector(selector).getBoundingClientRect().top + window.scrollY;
    return {
      logo: top('.logo'),
      jobs: top('.jobs'),
      contact: top('.contact'),
      video: top('.footer-background'),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      navColumns: getComputedStyle(document.querySelector('.footer-nav')).gridTemplateColumns.split(' ').length,
      noteWraps: document.querySelector('.note').getBoundingClientRect().height > 30,
    };
  });

  check(
    box.logo < box.jobs && box.jobs < box.contact && box.contact < box.video,
    `mobile ${width}px order logo → jobs → contact → video`,
  );
  check(box.overflow <= 0, `mobile ${width}px no horizontal overflow`, `${box.overflow}px`);
  check(box.navColumns === 2, `mobile ${width}px nav is a 2-column grid`, `${box.navColumns} columns`);
  check(box.noteWraps, `mobile ${width}px note wraps instead of one long line`);

  await page.waitForTimeout(600);
  const playing = await page.evaluate(() => {
    const video = document.querySelector('.footer-background video');
    return { paused: video.paused, loop: video.loop, time: video.currentTime };
  });
  check(!playing.paused && playing.loop, `mobile ${width}px video loops`, JSON.stringify(playing));

  await page.screenshot({ path: path.join(SHOTS, `mobile-${width}.png`), fullPage: true });
  await page.close();
}

// --- reduced motion ----------------------------------------------------------
{
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    reducedMotion: 'reduce',
  });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate(() => document.querySelector('.footer').scrollIntoView({ block: 'end', behavior: 'instant' }));
  await useTwin(page);
  await page.waitForFunction(() => {
    const video = document.querySelector('.footer-background video');
    return video && video.readyState >= 2;
  });
  await page.waitForTimeout(500);
  const paused = await page.evaluate(() => document.querySelector('.footer-background video').paused);
  check(paused, 'reduced motion keeps the mobile video paused');
  await page.close();
}

await browser.close();
twinServer.close();
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nall checks passed');
process.exit(failures.length ? 1 : 0);
