// Emits the studio mark in the two shapes the page needs: a React component
// (currentColor, so it inherits the #080909 text color) and a standalone
// favicon file with the color baked in. Same 169x40 viewBox as the layout
// expects.
//
// The mark is a dental arch: nine crowns set along a smile curve, tallest in
// the middle, finished with a polish sparkle.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const WIDTH = 169;
const HEIGHT = 40;
const COUNT = 9;
const SPAN = 1.12; // half-sweep of the arch, in radians
const ARCH_RADIUS_X = 66;
const ARCH_RADIUS_Y = 15;
const CENTER_X = 78;
const CENTER_Y = 12;

function crown(index) {
  const t = -SPAN + (index / (COUNT - 1)) * SPAN * 2;
  const edge = Math.abs(t) / SPAN; // 0 in the middle, 1 at the ends
  const x = CENTER_X + Math.sin(t) * ARCH_RADIUS_X;
  const y = CENTER_Y + (1 - Math.cos(t)) * ARCH_RADIUS_Y;
  const w = 13.2 - edge * 4.4;
  const h = 23 - edge * 8;
  const r = w / 2;
  const angle = (t * 0.62 * 180) / Math.PI;
  const d = [
    `M${(-r).toFixed(2)} ${(-h / 2 + r).toFixed(2)}`,
    `a${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${w.toFixed(2)} 0`,
    `v${(h - r * 2).toFixed(2)}`,
    `a${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 -${w.toFixed(2)} 0`,
    'Z',
  ].join(' ');
  return `<path transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)})" d="${d}" />`;
}

// Four-point sparkle: the polish highlight that finishes the mark.
const sparkle = (cx, cy, s) =>
  `<path d="M${cx} ${cy - s} C${cx + s * 0.18} ${cy - s * 0.3} ${cx + s * 0.3} ${cy - s * 0.18} ${cx + s} ${cy} ` +
  `C${cx + s * 0.3} ${cy + s * 0.18} ${cx + s * 0.18} ${cy + s * 0.3} ${cx} ${cy + s} ` +
  `C${cx - s * 0.18} ${cy + s * 0.3} ${cx - s * 0.3} ${cy + s * 0.18} ${cx - s} ${cy} ` +
  `C${cx - s * 0.3} ${cy - s * 0.18} ${cx - s * 0.18} ${cy - s * 0.3} ${cx} ${cy - s} Z" />`;

const body = [
  ...Array.from({ length: COUNT }, (_, i) => crown(i)),
  sparkle(156, 11, 10.5),
  sparkle(147.5, 24, 4.6),
].join('');

writeFileSync(
  path.join(root, 'app', 'brand-logo.tsx'),
  `export default function BrandLogo() {
  return (<svg aria-hidden="true" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${body}</svg>);
}
`,
);

writeFileSync(
  path.join(root, 'public', 'logo.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="#080909">${body}</svg>\n`,
);

console.log('wrote app/brand-logo.tsx and public/logo.svg');
