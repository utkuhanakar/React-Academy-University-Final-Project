# React Akademi / React Academy

Modern, interactive, TypeScript-first React learning SPA: Markdown lessons, quick checks and activities, a practice studio with optional cloud sync hints, and a live code sandbox (`react-live`).

## Live site (GitHub Pages)

After the **Deploy to GitHub Pages** workflow completes:

**https://utkuhanakar.github.io/React-Academy-University-Final-Project/**

Enable it once under **Repo → Settings → Pages → Source: GitHub Actions**.

## Local setup

```bash
npm ci
npm run dev
```

Production-style build (`vite.config.ts` sets the GitHub Pages `base` only for `vite build`; `npm run dev` uses `/`):

```bash
npm run build
npm run preview
```

## Highlights

- Live code sandbox with instant preview and surfaced errors (`react-live`)
- Markdown curriculum in `src/data`, modular quiz and cloze/drag activities
- Optional Supabase-assisted progress (OTP) when env vars are set; otherwise browser storage
- “Çalışma stüdyosu” practice path plus quick concept cards (`src/data/quickReferenceCards.ts`)

## Tech stack

- React 19, TypeScript, Vite 8  
- Tailwind CSS 4 (+ typography), react-markdown + remark-gfm  
- react-syntax-highlighter for fenced code  

## Repo

**https://github.com/utkuhanakar/React-Academy-University-Final-Project**

---

# Türkçe özet

Etkileşimli React + TypeScript dersleri, bilgi sınamaları, boşluk/sürükleme etkinlikleri, çalışma stüdyosu ve tarayıcıda canlı kod alanıdır. İsteğe bağlı bulut ilerlemesi için Supabase yapı taşları vardır; tanımlı değilse ilerleme yerelde tutulur.

**Canlı adres:** https://utkuhanakar.github.io/React-Academy-University-Final-Project/

**Yerel:** `npm ci` → `npm run dev`.
