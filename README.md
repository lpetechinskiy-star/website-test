# Стоматологический лендинг

Одностраничный сайт клиники: герой с анимированным фоном из линий
(`components/ui/background-paths.tsx`), услуги, блок о клинике со счётчиками,
этапы приёма, финальный призыв и футер с персонажем-зубом, который следит за
курсором.

Стек: Next.js (App Router) + TypeScript + Tailwind CSS v4, структура shadcn/ui
(`components/ui`, `lib/utils.ts`, `components.json`), анимации на framer-motion,
иконки из lucide-react.

## Структура

```
app/                    layout, страница, стили, компонент фонового видео
components/ui/          примитивы shadcn: button, background-paths, reveal,
                        spotlight-card, count-up
components/sections/    секции лендинга: hero, marquee, services, about,
                        process, contact-cta
components/             site-header, site-footer
lib/utils.ts            cn()
scripts/                генераторы ассетов и проверочный скрипт
```

## Что нужно заполнить

Плейсхолдеры помечены комментарием `ЗАПОЛНИТЕ` в коде:

- `components/sections/about.tsx` — цифры клиники (стаж, число пациентов, оценка, гарантия);
- `components/sections/contact-cta.tsx` — телефон, адрес и часы работы.

## Футер

Нижний блок — тот же футер, что собирался раньше: левая колонка с подписями,
центральный знак, правая колонка с припиской и иконками, персонаж-зуб на фоне.
На десктопе видео закрывает весь блок, а кадр выбирается направлением курсора.
На ширине ≤700px контент складывается в колонку, видео уходит под него и
играет в цикле. Его вёрстка живёт отдельным блоком обычного CSS в
`app/globals.css` — vw-раскладка выверена под клип.

## Запуск

```bash
npm install
npm run build && npm start        # http://localhost:3000
```

## Генерация ассетов

Они уже лежат в репозитории; пересобирать нужно только если менялся персонаж
или знак.

```bash
pip install imageio-ffmpeg                # ffmpeg с libx264
node scripts/render-tooth.mjs             # 169 кадров → mp4 + app/gaze-frames.json
node scripts/render-tooth.mjs --preview    # 4 кадра для быстрой проверки
node scripts/make-logo.mjs                # app/brand-logo.tsx + public/logo.svg
node scripts/make-icons.mjs               # public/{linkedin,instagram,tiktok}.svg
```

`scripts/tooth-frame.mjs` — источник правды для персонажа. Клип: 1920×1080,
24 fps, 169 кадров (7.041667 s), фон `#f0eefa`. Середина между зрачками —
ровно (948, 418), те же координаты, что вычитает `app/footer-background.tsx`.
Зрачки делают ровно один оборот за клип, поэтому таблица `app/gaze-frames.json`
считается аналитически, а мобильная петля бесшовна.

`public/footer-scrub.mp4` — all-intra вариант (каждый кадр ключевой), его и
грузит страница: перемотка по курсору попадает в нужный кадр сразу.
`public/footer-background.mp4` — тот же клип с обычным GOP, исходник.

## Проверка

```bash
npm run build && npx next start -p 3100 &
node scripts/check-page.mjs http://localhost:3100 /tmp/footer-shots
```

Скрипт проверяет четыре направления взгляда (измеряя реальное положение
зрачков в показанном кадре, а не доверяя таблице), паузу видео на десктопе,
порядок блоков и отсутствие горизонтальной прокрутки на 700/390/320px,
цикличное воспроизведение на мобильных и остановку при
`prefers-reduced-motion: reduce`.

Chromium из поставки Playwright собран без проприетарных кодеков и не
декодирует H.264, поэтому на время проверки в тот же `<video>` подставляется
WebM-двойник, перекодированный из `public/footer-scrub.mp4` (те же кадры и
тайминги). Сама страница отдаёт только mp4.

## Шрифты

Epilogue и DM Sans не содержат кириллицы, поэтому взяты ближайшие аналоги с
кириллицей: **Golos Text 900** для заголовков и **Manrope 400** для остального
текста (пакеты `@fontsource/*`, файлы скопированы в `public/fonts/`).
