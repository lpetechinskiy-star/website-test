// Writes the three display-only social glyphs into public/. Instagram and
// TikTok come from the simple-icons package; LinkedIn was removed from that
// package over trademark policy, so its glyph is drawn here.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COLOR = '#080909';

function fromSimpleIcons(name, file) {
  const source = readFileSync(path.join(root, 'node_modules', 'simple-icons', 'icons', `${name}.svg`), 'utf8');
  const d = source.match(/<path d="([^"]+)"/)[1];
  writeFileSync(
    path.join(root, 'public', file),
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${COLOR}"><path d="${d}" /></svg>\n`,
  );
}

fromSimpleIcons('instagram', 'instagram.svg');
fromSimpleIcons('tiktok', 'tiktok.svg');

// Rounded square with the "in" knocked out, so the video shows through the
// letterforms exactly like the other two glyphs.
const linkedin = [
  'M5 0h14a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5V5a5 5 0 0 1 5-5Z',
  'M6.35 4.9a2.02 2.02 0 1 0 0 4.05 2.02 2.02 0 0 0 0-4.05Z',
  'M4.4 10.3h3.9v9.35H4.4Z',
  'M10.45 10.3h3.73v1.28c.54-.86 1.62-1.5 3.05-1.5 2.42 0 4.07 1.56 4.07 4.27v5.3h-3.9v-4.83c0-1.24-.5-1.98-1.55-1.98-1.06 0-1.6.75-1.6 1.98v4.83h-3.8Z',
].join(' ');

writeFileSync(
  path.join(root, 'public', 'linkedin.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${COLOR}"><path fill-rule="evenodd" clip-rule="evenodd" d="${linkedin}" /></svg>\n`,
);

console.log('wrote public/linkedin.svg, public/instagram.svg, public/tiktok.svg');
