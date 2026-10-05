// Собирает сайт в один самодостаточный .html: разметка, стили, шрифты, иконки
// и скрипты внутри файла. Открывается с диска двойным кликом и работает
// целиком — зуб следит за курсором, запись открывается, меню и FAQ живые.
//
//   npm run build && node scripts/make-preview.mjs && node scripts/make-single-file.mjs

import { build } from 'esbuild';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');
const target = path.join(root, 'single', 'stomatologiya.html');

const dataUri = (file, type) =>
  `data:${type};base64,${readFileSync(file).toString('base64')}`;

// 1. Стили берём из собранного Tailwind и зашиваем в них шрифты.
const cssFile = readdirSync(path.join(outDir, 'next-assets/static/chunks'))
  .find((name) => name.endsWith('.css'));
let css = readFileSync(path.join(outDir, 'next-assets/static/chunks', cssFile), 'utf8');
css = css.replace(/url\((?:'|")?[^)'"]*\/(fonts\/[^)'"]+\.woff2)(?:'|")?\)/g,
  (_, file) => `url(${dataUri(path.join(outDir, file), 'font/woff2')})`);

// 2. Приложение собираем одним бандлом — без чанков, которые ищут себя по URL.
const bundle = await build({
  entryPoints: [path.join(root, 'scripts', 'standalone-entry.tsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2019',
  jsx: 'automatic',
  alias: { '@': root },
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.json': 'json' },
  write: false,
});
let script = bundle.outputFiles[0].text;

// 3. Всё, что страница грузила отдельными файлами, превращаем в данные внутри.
for (const icon of ['linkedin.svg', 'instagram.svg', 'tiktok.svg', 'logo.svg']) {
  script = script.replaceAll(`/${icon}`, dataUri(path.join(outDir, icon), 'image/svg+xml'));
}
for (const page of ['privacy.html', 'consent.html']) {
  // Документы тоже уезжают внутрь файла и открываются в новой вкладке.
  script = script.replaceAll(`"${page}"`, `"${dataUri(path.join(outDir, page), 'text/html')}"`);
}

// 4. Заголовок, описание и разметку для поисковиков берём из статической сборки.
const exported = readFileSync(path.join(outDir, 'index.html'), 'utf8');
const title = exported.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Стоматология';
const description = exported.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
const schema = [...exported.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => match[1]);

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="${dataUri(path.join(outDir, 'logo.svg'), 'image/svg+xml')}">
<style>${css}</style>
</head>
<body>
<div id="root"></div>
${schema.map((item) => `<script type="application/ld+json">${item}</script>`).join('\n')}
<script>${script.replaceAll('</script', '<\\/script')}</script>
</body>
</html>
`;

mkdirSync(path.dirname(target), { recursive: true });
writeFileSync(target, html);
console.log(`wrote ${path.relative(root, target)} — ${(Buffer.byteLength(html) / 1024).toFixed(0)}KB`);
