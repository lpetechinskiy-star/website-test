// Validation harness for the landing page. Expects the static export served
// somewhere, e.g. `cd out && python3 -m http.server 3100`.
//
//   node scripts/check-page.mjs [http://localhost:3100] [screenshotDir]

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3100';
const SHOTS = process.argv[3] ?? '/tmp/footer-shots';
const CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

mkdirSync(SHOTS, { recursive: true });

// Playwright's Chromium is built without the proprietary codecs, so it cannot
// decode the H.264 clip the page ships. For this run an all-intra WebM twin —
// transcoded from that very file, so identical frames, timing and seek points —
// is served locally and swapped into the same <video> element, keeping the
// component's code path under test. The page itself still ships only the mp4.
const twin = path.join(SHOTS, 'check-twin.webm');
if (!existsSync(twin)) {
  const ffmpeg = execFileSync('python3', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'])
    .toString().trim();
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y',
    '-i', path.join(root, 'public', 'tooth-scrub.mp4'),
    '-an', '-c:v', 'libvpx', '-g', '1', '-b:v', '3M', '-deadline', 'realtime', '-cpu-used', '5',
    twin], { stdio: 'inherit' });
}

// Seeking needs byte ranges, so the twin gets a small range-aware server.
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

const browser = await chromium.launch({ executablePath: CHROMIUM, args: ['--disable-gpu'] });
const failures = [];
const check = (ok, label, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures.push(label);
};

async function openPage(options) {
  const page = await browser.newPage(options);
  const problems = [];
  page.on('pageerror', (error) => problems.push(String(error).slice(0, 120)));
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`${response.status()} ${new URL(response.url()).pathname}`);
  });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate((url) => {
    const video = document.querySelector('video');
    video.crossOrigin = 'anonymous';
    video.src = url;
  }, TWIN_URL);
  await page.waitForFunction(() => {
    const video = document.querySelector('video');
    return video && video.readyState >= 2;
  });
  await page.evaluate(() => document.fonts.ready);
  return { page, problems };
}

// --- desktop: frame rate, visibility, gaze --------------------------------
{
  const { page, problems } = await openPage({ viewport: { width: 1440, height: 900 } });

  const fps = await page.evaluate(() => new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    const tick = () => {
      frames += 1;
      performance.now() - start < 2000 ? requestAnimationFrame(tick) : resolve(frames / 2);
    };
    requestAnimationFrame(tick);
  }));
  check(fps > 30, 'idle frame rate above 30fps', `${fps.toFixed(0)}fps`);

  // Only blocks the viewer can actually see: a reveal waiting below the fold
  // is meant to be hidden until it scrolls in.
  const onScreenHidden = () => page.evaluate(() =>
    [...document.querySelectorAll('h1, h2, h3, p, li, a, .reveal')]
      .filter((element) => {
        const box = element.getBoundingClientRect();
        const visible = box.top < window.innerHeight && box.bottom > 0 && box.width > 0;
        return visible && Number(getComputedStyle(element).opacity) < 0.9;
      }).length);
  check(await onScreenHidden() === 0, 'nothing on the first screen is left transparent');

  const eye = await page.evaluate(() => {
    const video = document.querySelector('#top video');
    const rect = video.getBoundingClientRect();
    const scale = Math.max(rect.width / video.videoWidth, rect.height / video.videoHeight);
    return {
      x: rect.left + rect.width / 2 + (948 / 1920 - 0.5) * video.videoWidth * scale,
      y: rect.top + rect.height / 2 + (418 / 1080 - 0.5) * video.videoHeight * scale,
      onScreen: rect.top >= 0 && rect.bottom <= window.innerHeight,
    };
  });
  check(eye.onScreen, 'the character sits on the first screen');

  const measure = () => page.evaluate(() => {
    const video = document.querySelector('#top video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(video, 0, 0);
    // Pupil centroid inside each eye, in the clip's own coordinates.
    const pupil = (fx, fy) => {
      const cx = Math.round(fx * canvas.width);
      const cy = Math.round(fy * canvas.height);
      const r = Math.round(0.037 * canvas.width);
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
      return count ? { x: sumX / count - r, y: sumY / count - r } : null;
    };
    return { time: video.currentTime, left: pupil(858 / 1920, 418 / 1080), right: pupil(1038 / 1920, 418 / 1080) };
  });

  const angleGap = (a, b) => Math.abs(((a - b) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);

  // Right, down, left, up — screen-space Y grows downward.
  for (const [name, dx, dy] of [['right', 300, 0], ['down', 0, 300], ['left', -300, 0], ['up', 0, -300]]) {
    await page.mouse.move(eye.x + dx, eye.y + dy);
    const wanted = Math.atan2(dy, dx);
    let measured = Number.NaN;
    let shown = null;
    for (let attempt = 0; attempt < 25; attempt += 1) {
      shown = await measure();
      measured = Math.atan2((shown.left.y + shown.right.y) / 2, (shown.left.x + shown.right.x) / 2);
      if (angleGap(wanted, measured) < 0.25) break;
      await page.waitForTimeout(150);
    }
    check(
      angleGap(wanted, measured) < 0.25,
      `gaze ${name}`,
      `pupils at ${(measured * 180 / Math.PI).toFixed(0)}°, cursor at ${(wanted * 180 / Math.PI).toFixed(0)}°`,
    );
  }

  // Every in-page link must land on a section that exists.
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')].map((a) => ({
      href: a.getAttribute('href'),
      target: !!document.querySelector(a.getAttribute('href')),
      visible: a.getBoundingClientRect().width > 0,
    })));
  check(links.every((link) => link.target), 'every anchor points at a real section',
    links.filter((l) => !l.target).map((l) => l.href).join(', ') || `${links.length} links`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, 'desktop has no horizontal overflow', `${overflow}px`);

  // Walk the page the way a visitor does: jump, look immediately (nothing may
  // be blank), then look again once things settle.
  const fullyBlank = () => page.evaluate(() =>
    [...document.querySelectorAll('h1, h2, h3, p, li, .reveal')]
      .filter((element) => {
        const box = element.getBoundingClientRect();
        const visible = box.top < window.innerHeight && box.bottom > 0 && box.width > 0;
        return visible && Number(getComputedStyle(element).opacity) < 0.35;
      }).length);

  let blankOnArrival = 0;
  let blankAfterSettling = 0;
  for (let step = 0; step < 12; step += 1) {
    await page.evaluate((index) => window.scrollTo(0, index * 700), step);
    await page.waitForTimeout(60);
    blankOnArrival += await fullyBlank();
    await page.waitForTimeout(450);
    blankAfterSettling += await onScreenHidden();
  }
  check(blankOnArrival === 0, 'nothing is blank the moment it scrolls into view',
    `${blankOnArrival} block(s)`);
  check(blankAfterSettling === 0, 'nothing stays transparent after scrolling',
    `${blankAfterSettling} block(s)`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(SHOTS, 'desktop-hero.png') });
  await page.evaluate(() => document.querySelector('footer').scrollIntoView({ block: 'end', behavior: 'instant' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SHOTS, 'desktop-footer.png') });
  check(problems.length === 0, 'desktop console and network are clean', problems.slice(0, 3).join(' | '));
  await page.close();
}

// --- mobile: stacking, looping playback, no overflow -----------------------
for (const width of [700, 390, 320]) {
  const { page, problems } = await openPage({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true });

  const layout = await page.evaluate(() => {
    const top = (selector) => document.querySelector(selector).getBoundingClientRect().top + window.scrollY;
    return {
      heroText: top('.hero-copy'),
      tooth: top('#top video'),
      services: top('#services'),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      navColumns: getComputedStyle(document.querySelector('.footer-nav')).gridTemplateColumns.split(' ').length,
    };
  });
  check(layout.heroText < layout.tooth && layout.tooth < layout.services,
    `mobile ${width}px stacks text → character → services`);
  check(layout.overflow <= 0, `mobile ${width}px has no horizontal overflow`, `${layout.overflow}px`);
  check(layout.navColumns === 2, `mobile ${width}px footer nav is a 2-column grid`);

  await page.waitForTimeout(800);
  const playback = await page.evaluate(() => {
    const video = document.querySelector('#top video');
    return { paused: video.paused, loop: video.loop };
  });
  check(!playback.paused && playback.loop, `mobile ${width}px character loops`, JSON.stringify(playback));

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('h1, h2, p, li')].filter((e) => Number(getComputedStyle(e).opacity) < 0.9).length);
  check(hidden === 0, `mobile ${width}px shows all copy`, `${hidden} hidden`);

  await page.screenshot({ path: path.join(SHOTS, `mobile-${width}.png`), fullPage: true });
  check(problems.length === 0, `mobile ${width}px console and network are clean`, problems.slice(0, 2).join(' | '));
  await page.close();
}

// --- reduced motion --------------------------------------------------------
{
  const page = await browser.newPage({ ...devices['iPhone 13'], reducedMotion: 'reduce' });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const state = await page.evaluate(() => ({
    paused: document.querySelector('#top video').paused,
    hidden: [...document.querySelectorAll('h1, h2, p, li')].filter((e) => Number(getComputedStyle(e).opacity) < 0.9).length,
  }));
  check(state.paused, 'reduced motion keeps the character still');
  check(state.hidden === 0, 'reduced motion still shows every block');
  await page.close();
}

await browser.close();
twinServer.close();
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nall checks passed');
process.exit(failures.length ? 1 : 0);
