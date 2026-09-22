// Validation harness for the landing page. Expects the static export served
// somewhere, e.g. `cd out && python3 -m http.server 3100`.
//
//   node scripts/check-page.mjs [http://localhost:3100] [screenshotDir]

import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium, devices } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3100';
const SHOTS = process.argv[3] ?? '/tmp/footer-shots';
const CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

mkdirSync(SHOTS, { recursive: true });

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
  await page.evaluate(() => document.fonts.ready);
  return { page, problems };
}

// How far each pupil has been pushed from the centre of its eye, read from
// the transform the component sets (in the drawing's own units).
const pupilOffsets = (page) => page.evaluate(() =>
  [...document.querySelectorAll('#top svg[role="img"] .tooth-pupil')].map((pupil) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(pupil).transform);
    return { x: matrix.e, y: matrix.f };
  }));

// --- desktop: frame rate, visibility, the character and its gaze -----------
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

  const character = await page.evaluate(() => {
    const svg = document.querySelector('#top svg[role="img"]');
    if (!svg) return null;
    const box = svg.getBoundingClientRect();
    return {
      onFirstScreen: box.top >= 0 && box.bottom <= window.innerHeight + 1,
      width: Math.round(box.width),
      height: Math.round(box.height),
      pupils: svg.querySelectorAll('.tooth-pupil').length,
    };
  });
  check(!!character, 'the character is drawn on the first screen');
  check(character?.pupils === 2, 'both pupils are present');
  check(character?.onFirstScreen && character.width > 380,
    'the character is large and fully on the first screen',
    `${character?.width}x${character?.height}px`);

  const eyeCentre = await page.evaluate(() => {
    const svg = document.querySelector('#top svg[role="img"]');
    const eyes = [...svg.querySelectorAll('.tooth-pupil')].map((p) => p.parentElement.getBoundingClientRect());
    return {
      x: (eyes[0].left + eyes[0].width / 2 + eyes[1].left + eyes[1].width / 2) / 2,
      y: (eyes[0].top + eyes[0].height / 2 + eyes[1].top + eyes[1].height / 2) / 2,
    };
  });

  const angleGap = (a, b) => Math.abs(((a - b) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);

  // Right, down, left, up — screen-space Y grows downward. The step is kept
  // inside the viewport: a pointer moved past the edge never reports at all.
  const viewport = page.viewportSize();
  const room = {
    right: viewport.width - eyeCentre.x,
    left: eyeCentre.x,
    down: viewport.height - eyeCentre.y,
    up: eyeCentre.y,
  };
  const step = (name) => Math.min(300, Math.max(60, room[name] - 24));

  for (const [name, sx, sy] of [['right', 1, 0], ['down', 0, 1], ['left', -1, 0], ['up', 0, -1]]) {
    const dx = sx * step(name);
    const dy = sy * step(name);
    await page.mouse.move(eyeCentre.x + dx, eyeCentre.y + dy);
    await page.waitForTimeout(350);
    const offsets = await pupilOffsets(page);
    const measured = offsets.map((offset) => Math.atan2(offset.y, offset.x));
    const wanted = Math.atan2(dy, dx);
    const moved = offsets.every((offset) => Math.hypot(offset.x, offset.y) > 4);
    check(
      moved && measured.every((angle) => angleGap(wanted, angle) < 0.35),
      `gaze ${name}`,
      `pupils at ${measured.map((a) => (a * 180 / Math.PI).toFixed(0)).join('° / ')}°, cursor at ${(wanted * 180 / Math.PI).toFixed(0)}°`,
    );
  }

  // Left alone, the eyes keep wandering instead of freezing.
  const before = await pupilOffsets(page);
  await page.waitForTimeout(3200);
  const after = await pupilOffsets(page);
  check(Math.hypot(after[0].x - before[0].x, after[0].y - before[0].y) > 3,
    'the eyes keep moving when the cursor stands still');

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')].map((a) => ({
      href: a.getAttribute('href'),
      target: !!document.querySelector(a.getAttribute('href')),
    })));
  check(links.every((link) => link.target), 'every anchor points at a real section',
    links.filter((l) => !l.target).map((l) => l.href).join(', ') || `${links.length} links`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, 'desktop has no horizontal overflow', `${overflow}px`);

  // --- booking window ------------------------------------------------------
  await page.getByRole('button', { name: /Записаться на приём/ }).first().click();
  await page.waitForTimeout(500);
  check(await page.evaluate(() => !!document.querySelector('dialog')?.open), 'booking window opens');

  const fits = await page.evaluate(() => {
    const dialog = document.querySelector('dialog');
    const submit = [...dialog.querySelectorAll('button')].find((b) => b.type === 'submit');
    const box = submit.getBoundingClientRect();
    return box.bottom <= dialog.getBoundingClientRect().bottom + 1 && box.top >= dialog.getBoundingClientRect().top;
  });
  check(fits, 'the submit button fits inside the window without scrolling');

  await page.getByRole('button', { name: 'Записаться', exact: true }).last().click();
  await page.waitForTimeout(300);
  const complaints = await page.evaluate(() => [...document.querySelectorAll('.booking-error')].map((e) => e.textContent));
  check(complaints.length >= 3, 'an empty form is refused with reasons', complaints.join(' / '));

  await page.fill('#booking-name', 'Анна');
  await page.fill('#booking-phone', '9001234567');
  await page.locator('.booking-day').nth(1).click();
  await page.locator('.booking-time').nth(4).click();
  check(await page.evaluate(() => document.querySelectorAll('.booking-error').length) === 0,
    'errors clear as the fields are filled in');

  await page.getByRole('button', { name: 'Записаться', exact: true }).last().click();
  await page.waitForTimeout(400);
  const summary = await page.evaluate(() => document.querySelector('dialog')?.textContent ?? '');
  check(summary.includes('Заявка принята') && summary.includes('+7 (900) 123-45-67'),
    'the filled form reaches the confirmation with the entered details');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check(await page.evaluate(() => !document.querySelector('dialog')?.open), 'Esc closes the window');

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
  check(blankOnArrival === 0, 'nothing is blank the moment it scrolls into view', `${blankOnArrival} block(s)`);
  check(blankAfterSettling === 0, 'nothing stays transparent after scrolling', `${blankAfterSettling} block(s)`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.mouse.move(eyeCentre.x - 320, eyeCentre.y - 160);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SHOTS, 'desktop-hero.png') });
  check(problems.length === 0, 'desktop console and network are clean', problems.slice(0, 3).join(' | '));
  await page.close();
}

// --- mobile: stacking, no overflow, everything visible ---------------------
for (const width of [700, 390, 320]) {
  const { page, problems } = await openPage({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true });

  const layout = await page.evaluate(() => {
    const top = (selector) => document.querySelector(selector).getBoundingClientRect().top + window.scrollY;
    return {
      heroText: top('.hero-copy'),
      tooth: top('#top svg[role="img"]'),
      services: top('#services'),
      toothWidth: Math.round(document.querySelector('#top svg[role="img"]').getBoundingClientRect().width),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      navColumns: getComputedStyle(document.querySelector('.footer-nav')).gridTemplateColumns.split(' ').length,
    };
  });
  check(layout.heroText < layout.tooth && layout.tooth < layout.services,
    `mobile ${width}px stacks text → character → services`);
  check(layout.toothWidth > width * 0.5, `mobile ${width}px shows the character large`, `${layout.toothWidth}px`);
  check(layout.overflow <= 0, `mobile ${width}px has no horizontal overflow`, `${layout.overflow}px`);
  check(layout.navColumns === 2, `mobile ${width}px footer nav is a 2-column grid`);

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
    character: !!document.querySelector('#top svg[role="img"]'),
    hidden: [...document.querySelectorAll('h1, h2, p, li')].filter((e) => Number(getComputedStyle(e).opacity) < 0.9).length,
  }));
  check(state.character, 'reduced motion still shows the character');
  check(state.hidden === 0, 'reduced motion still shows every block');
  await page.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nall checks passed');
process.exit(failures.length ? 1 : 0);
