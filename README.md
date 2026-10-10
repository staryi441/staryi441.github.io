# Staryi Dev Hub

Личный портфолио-хаб [staryi441](https://github.com/staryi441) — статический сайт на **Eleventy (11ty)** с деплоем на **GitHub Pages**.

Дизайн: AMOLED True Black (`#000000`) + фиолетовый акцент (`#8B00FF`).

## Стек

- **[Eleventy 3](https://www.11ty.dev/)** — SSG, Nunjucks-шаблоны, collections, фильтры
- **html-minifier-terser** — минификация HTML на сборке
- **sharp** — генерация favicon-набора из SVG
- **GitHub Actions** — CI/CD (lint → build → deploy)

## Команды

```bash
npm ci              # установка зависимостей
npm run dev         # локальный dev-сервер (http://localhost:8080)
npm run build       # сборка в ./_site
npm run favicons    # перегенерация PNG favicon из src/favicon.svg
npm run lint        # HTML + CSS линтинг
npm run check:links # проверка битых ссылок
npm run preview     # превью собранного сайта
```

## Структура

```
src/
├── _data/              # глобальные данные (site.json, buildDate)
├── _includes/layouts/  # лейауты: base, home, project, skill, skills, 404
├── assets/css/         # единый дизайн-системный CSS (main.css)
├── projects/           # страницы проектов (Markdown + front matter)
│   ├── worktracker.md
│   ├── worktracker/privacy.md
│   ├── recoveryparser.md
│   └── netchecker.md
├── ai-skills/          # база знаний AI Skills
│   ├── index.njk
│   ├── design.md / video-generation.md / ai-dev.md / prompting.md
├── index.njk           # главная
├── 404.njk
├── feed.njk            # Atom RSS (/feed.xml)
├── sitemap.njk         # sitemap.xml
├── robots.txt, manifest.json, security.txt, sw.js, favicon*
```

## Добавление проекта

Создайте `src/projects/<name>.md`:

```markdown
---
layout: layouts/project.njk
title: "Название"
description: "Краткое описание (120–160 символов для SEO)."
badge: "Утилита"
badgeClass: "badge-info"
category: "DeveloperApplication"
os: "Windows, Linux, macOS"
version: "C# / .NET 8.0"
releaseDate: "2026-01-01"
updateDate: "2026-01-01"
order: 40          # порядок на главной (по возрастанию)
downloads:
  - url: "https://github.com/staryi441/Name/releases/latest/download/File.exe"
    text: "Скачать с GitHub"
    primary: true
features:
  - text: "<strong>Фича:</strong> описание."
---

Контент страницы в Markdown/HTML...
```

## Добавление AI-скилла

Создайте `src/ai-skills/<slug>.md` с `layout: layouts/skill.njk`, полями
`title`, `description`, `category` (группировка на /ai-skills/), `date`, `order`, `tags`, `links`.

## SEO / PWA

- Canonical URL, Open Graph, Twitter Cards — автоматически из front matter
- JSON-LD разметка: `WebSite` (главная), `SoftwareApplication` (проекты), `TechArticle` (скиллы), `CollectionPage` (/ai-skills/)
- `/sitemap.xml`, `/robots.txt`, `/feed.xml` (Atom) — генерируются автоматически
- PWA: `manifest.json` + Service Worker (`sw.js`, offline-caching стратегии)

## Деплой

GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. **Settings → Pages → Source: GitHub Actions** (обязательно!)
2. Пуш в ветку `main` → автоматическая сборка и публикация `_site/`

## Лицензия

MIT © staryi441