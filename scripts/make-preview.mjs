// Prepares the static export in out/ for hosting somewhere other than a domain
// root. Two things are in the way: Next writes root-absolute asset paths, and
// it puts every build asset under `_next/`, which hosts that reserve leading
// underscores refuse to serve. Paths become relative to the page (and, for CSS,
// to the stylesheet's own folder) and the asset folder is renamed.
//
//   npm run build && node scripts/make-preview.mjs

import { existsSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');

const ASSETS = String.raw`_next\/|fonts\/|logo\.svg|linkedin\.svg|instagram\.svg|tiktok\.svg|footer-scrub\.mp4|footer-background\.mp4`;
const absolute = new RegExp(`(["'\\\\])\\/(${ASSETS})`, 'g');

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

let touched = 0;
for (const file of walk(outDir)) {
  const ext = path.extname(file);
  if (!['.html', '.js', '.css', '.txt'].includes(ext)) continue;

  const before = readFileSync(file, 'utf8');
  let after = before.replace(absolute, '$1$2');

  if (ext === '.css') {
    // A stylesheet's relative urls resolve against its own directory.
    const up = '../'.repeat(path.relative(outDir, path.dirname(file)).split(path.sep).length);
    after = after.replace(/url\((["']?)\/(fonts\/)/g, `url($1${up}$2`);
  }

  if (after !== before) {
    writeFileSync(file, after);
    touched += 1;
  }
}

// The RSC payload files are only used for client-side navigation between
// routes; a one-page export does not need them, and their names start with the
// reserved underscore too.
for (const file of readdirSync(outDir)) {
  if (file.startsWith('__next') || file.startsWith('_not-found')) {
    rmSync(path.join(outDir, file), { recursive: true, force: true });
  }
}

// A bundled URL-decoding polyfill emits U+FFFD as a literal, which some static
// hosts refuse to serve. Inside a string literal the escape means the same.
let escaped = 0;
for (const file of walk(outDir)) {
  if (path.extname(file) !== '.js') continue;
  const before = readFileSync(file, 'utf8');
  const after = before
    .replaceAll('"�"', '"\\uFFFD"')
    .replaceAll("'�'", "'\\uFFFD'");
  if (after !== before) {
    writeFileSync(file, after);
    escaped += 1;
  }
  if (after.includes('�')) {
    console.warn(`warning: ${path.relative(outDir, file)} still holds a literal U+FFFD`);
  }
}
if (escaped) console.log(`escaped literal U+FFFD in ${escaped} file(s)`);

const ASSET_DIR = 'next-assets';
renameSync(path.join(outDir, '_next'), path.join(outDir, ASSET_DIR));

// Same reason as the folder: the build manifests are named with a leading
// underscore. Rename the files and the references that fetch them.
const staticDir = path.join(outDir, ASSET_DIR, 'static');
const MANIFESTS = ['_buildManifest.js', '_clientMiddlewareManifest.js', '_ssgManifest.js'];
for (const dir of readdirSync(staticDir)) {
  for (const name of MANIFESTS) {
    const from = path.join(staticDir, dir, name);
    if (existsSync(from)) renameSync(from, path.join(staticDir, dir, name.slice(1)));
  }
}
for (const file of walk(outDir)) {
  if (!['.html', '.js', '.css', '.txt'].includes(path.extname(file))) continue;
  const before = readFileSync(file, 'utf8');
  let after = before;
  for (const name of MANIFESTS) after = after.replaceAll(name, name.slice(1));
  if (after !== before) writeFileSync(file, after);
}
let renamed = 0;
for (const file of walk(outDir)) {
  if (!['.html', '.js', '.css', '.txt'].includes(path.extname(file))) continue;
  const before = readFileSync(file, 'utf8');
  const after = before.replaceAll('_next/', `${ASSET_DIR}/`);
  if (after !== before) {
    writeFileSync(file, after);
    renamed += 1;
  }
}

console.log(`rewrote absolute asset paths in ${touched} file(s) and _next/ references in ${renamed} file(s) under out/`);
