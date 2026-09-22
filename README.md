# Стоматологический лендинг

Одностраничный сайт клиники: герой с персонажем-зубом, который следит за
курсором, и анимированным фоном из линий (`components/ui/background-paths.tsx`),
услуги, блок о клинике со счётчиками, этапы приёма, финальный призыв и футер.

Стек: Next.js (App Router) + TypeScript + Tailwind CSS v4, структура shadcn/ui
(`components/ui`, `lib/utils.ts`, `components.json`), иконки из lucide-react.

Вся анимация — на CSS (transform и opacity, композитор), без JS-библиотек:
раньше фон рисовали 152 пути через framer-motion, и страница шла ~5 кадров/с.
Контент никогда не спрятан за анимацию: блоки видимы по умолчанию, появление
только сдвигает их на несколько пикселей.

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

## Персонаж

`components/tooth-character.tsx` — зуб с сердцем в герое. На мыши клип стоит
на паузе, и каждое движение курсора перематывает его на кадр, где зрачки
смотрят в нужную сторону (таблица углов — `components/gaze-frames.json`).
На тач-экранах и при `prefers-reduced-motion` он просто играет в цикле или
стоит. Пока персонаж за пределами экрана, перемотка не считается.

Клип для перемотки — `public/tooth-scrub.mp4`, 960×540 all-intra (каждый кадр
ключевой), меньше мегабайта. Исходник в полном разрешении —
`public/tooth-source.mp4`.

## Футер

Три колонки на vw-раскладке: подписи слева, знак в центре, приписка и иконки
справа. Живёт отдельным блоком обычного CSS в конце `app/globals.css`.

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
