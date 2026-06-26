# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development

```bash
yarn dev           # Vite dev server (port 1420)
yarn build         # Production build to dist/
yarn tauri dev     # Tauri desktop dev (runs yarn dev + cargo)
yarn tauri build   # Tauri desktop production build
```

There are no tests in this project yet.

The Rust backend lives in `src-tauri/` — use `cargo build` / `cargo check` inside that directory for Rust-only work.

## Architecture

**ZMUX** is a multi-source music player (Netease / QQ / Kuwo / JOOX) built with **Tauri v2** (Rust shell) + **Vue 3** + **Vite**. It targets desktop (macOS/Windows/Linux), iOS (Tauri mobile), and web (GitHub Pages at `/zmux/` base path).

### Key architectural decisions

- **Vue is a thin wrapper.** The Vue `App.vue` template contains all the HTML markup. Application logic lives in `src/main.js` as a vanilla JS IIFE (`initPlayer()`). Vue provides the component/reactive layer but the bulk of the app — search, playback, lyrics, playlists, i18n — is plain DOM manipulation driven by a single central `state` object.
- **`src/lib/main.js`** is a standalone copy of the same init logic (auto-boots on `DOMContentLoaded`), used when embedding without Vue's `onMounted`.
- **The Rust layer is minimal.** `src-tauri/src/lib.rs` only registers a `greet` command and the opener plugin. There are no custom Tauri commands for music functionality — all music APIs are called directly from the frontend via `fetch()` to third-party proxy APIs.
- **Search deduplication:** `state.trackMap` (a `Map` keyed by `uid` like `netease-12345`) prevents duplicate tracks across sources and sessions. Search results from all enabled sources are interleaved (round-robin by source) for display.
- **Persistence:** Favorites and playlists are serialized to `localStorage` under key `pikachu-music-library-v1`. Import/export uses JSON files with the same schema.
- **i18n:** Chinese/English via `translations` objects in `initPlayer()` and `data-i18n` attributes in HTML. Language preference saved to `localStorage` (`pikachu-music-lang`).
- **Responsive layout:** The CSS uses `clamp()` for spacing. Desktop gets a 3-column layout; mobile gets a tab-based UI with a fixed bottom player bar. Both layouts coexist in the DOM — CSS media queries toggle visibility.

### Source-specific API patterns

Each music source has a paired search + detail fetch function (e.g., `searchNetease` / `fetchNeteaseDetails`). Search returns metadata and track IDs; detail fetch lazily resolves playable audio URLs and lyrics when a track is selected. JOOX detail fetch includes an audio URL probe (HEAD then ranged GET fallback) to select the best quality available.

### CI/CD

GitHub Actions (`.github/workflows/release.yml`) triggers on `v*` tags: builds Tauri desktop apps (macOS/Windows) and deploys the web build to GitHub Pages. Web deployment only runs on the macOS matrix job — it explicitly unsets Tauri env vars so `vite.config.js` falls back to `base: "/zmux/"` for GitHub Pages.

### Vite base path logic

`vite.config.js` checks for `TAURI_ENV_PLATFORM` or `TAURI_PLATFORM` env vars. If either is set → `base: "/"` (Tauri desktop/mobile). Otherwise → `base: "/zmux/"` (GitHub Pages web deployment).
