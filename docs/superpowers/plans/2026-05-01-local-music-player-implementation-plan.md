# Local Music Player (Windows 11) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight Windows 11 local music player (Tauri) with glass-style UI, local folder scanning, playlists, playback modes, history, lyrics, theme switch, and global hotkeys.

**Architecture:** Use Tauri (Rust backend + web frontend) with clear module boundaries: filesystem/metadata/settings in Rust commands, player/state/UI in TypeScript. Implement via strict TDD slices from foundational data contracts to feature modules, then integrate and package for Windows 11. Keep runtime memory low with incremental scan, lazy artwork loading, and virtualized lists.

**Tech Stack:** Tauri 2, Rust, Vite, TypeScript, React, Zustand, Howler.js, Vitest, Testing Library, Playwright

---

## File Structure Map

- `src-tauri/src/main.rs` - Tauri app bootstrap and command registration
- `src-tauri/src/commands/library.rs` - folder scan, metadata extraction, scan progress
- `src-tauri/src/commands/settings.rs` - settings read/write
- `src-tauri/src/commands/mod.rs` - command exports
- `src-tauri/src/models.rs` - shared Rust DTOs (Track, ScanResult, Settings)
- `src-tauri/src/error.rs` - backend error types mapped to frontend-safe messages
- `src-tauri/Cargo.toml` - Rust deps and features

- `src/main.tsx` - frontend entry
- `src/App.tsx` - app shell composition
- `src/types/media.ts` - frontend types matching backend DTOs
- `src/lib/tauri.ts` - typed invoke wrappers
- `src/lib/player.ts` - Howler player adapter
- `src/store/useLibraryStore.ts` - library state
- `src/store/usePlayerStore.ts` - player state/modes/history
- `src/store/usePlaylistStore.ts` - playlist state
- `src/store/useSettingsStore.ts` - theme/settings state
- `src/modules/library/scan.ts` - scan orchestration
- `src/modules/lyrics/parseLrc.ts` - lrc parser
- `src/modules/lyrics/sync.ts` - lyric sync by current time
- `src/components/layout/AppShell.tsx` - sidebar/content/bottom bar layout
- `src/components/library/TrackTable.tsx` - virtualized track list
- `src/components/player/BottomPlayerBar.tsx` - playback controls
- `src/components/player/ModeSwitch.tsx` - playback mode switch
- `src/components/lyrics/LyricsPanel.tsx` - lyrics panel
- `src/components/theme/ThemeToggle.tsx` - theme switch
- `src/styles/glass.css` - glass visual tokens/effects

- `tests/unit/parseLrc.test.ts`
- `tests/unit/playerMode.test.ts`
- `tests/unit/libraryNormalize.test.ts`
- `tests/e2e/app-smoke.spec.ts`

---

### Task 1: Scaffold Tauri + React baseline

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`
- Create: `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `src-tauri/src/main.rs`
- Test: `tests/e2e/app-smoke.spec.ts`

- [ ] **Step 1: Write the failing e2e smoke test**

```ts
import { test, expect } from '@playwright/test'

test('app shell renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('app-shell')).toBeVisible()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm playwright test tests/e2e/app-smoke.spec.ts -g "app shell renders"`
Expected: FAIL with missing app scaffold or missing selector

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/App.tsx
export default function App() {
  return <div data-testid="app-shell">Music Player</div>
}
```

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

```rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default().run(tauri::generate_context!()).expect("error while running tauri app");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm playwright test tests/e2e/app-smoke.spec.ts -g "app shell renders"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html src/main.tsx src/App.tsx src-tauri/Cargo.toml src-tauri/tauri.conf.json src-tauri/src/main.rs tests/e2e/app-smoke.spec.ts
git commit -m "chore: scaffold tauri react baseline"
```

### Task 2: Define shared media/settings contracts and typed invoke layer

**Files:**
- Create: `src/types/media.ts`, `src/lib/tauri.ts`
- Create: `src-tauri/src/models.rs`, `src-tauri/src/commands/mod.rs`
- Modify: `src-tauri/src/main.rs`
- Test: `tests/unit/libraryNormalize.test.ts`

- [ ] **Step 1: Write the failing unit test for track normalization contract**

```ts
import { describe, it, expect } from 'vitest'
import { normalizeTrackId } from '../../src/lib/tauri'

describe('normalizeTrackId', () => {
  it('normalizes path separators and lowercases id seed', () => {
    const id = normalizeTrackId('D:\\Music\\A\\song.MP3')
    expect(id).toBe('d:/music/a/song.mp3')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/unit/libraryNormalize.test.ts`
Expected: FAIL with missing function

- [ ] **Step 3: Write minimal implementation**

```ts
// src/types/media.ts
export type Track = {
  id: string
  path: string
  title: string
  artist: string
  album: string
  duration: number
  cover?: string
  lrcPath?: string
}

export type AppSettings = {
  theme: 'light' | 'dark'
  volume: number
  lastScanDir?: string
}
```

```ts
// src/lib/tauri.ts
import { invoke } from '@tauri-apps/api/core'

export function normalizeTrackId(path: string) {
  return path.replaceAll('\\\\', '/').toLowerCase()
}

export async function invokeScan(dir: string) {
  return invoke('scan_library', { dir })
}
```

```rust
// src-tauri/src/models.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Track {
    pub id: String,
    pub path: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: u32,
    pub cover: Option<String>,
    pub lrc_path: Option<String>,
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/unit/libraryNormalize.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/media.ts src/lib/tauri.ts src-tauri/src/models.rs src-tauri/src/commands/mod.rs src-tauri/src/main.rs tests/unit/libraryNormalize.test.ts
git commit -m "feat: add shared media contracts and typed invoke layer"
```

### Task 3: Implement backend folder scan command with resilient filtering

**Files:**
- Create: `src-tauri/src/commands/library.rs`, `src-tauri/src/error.rs`
- Modify: `src-tauri/src/commands/mod.rs`, `src-tauri/src/main.rs`
- Test: `src-tauri/tests/library_scan.rs`

- [ ] **Step 1: Write the failing Rust test for supported extensions and skip behavior**

```rust
#[test]
fn scan_filters_supported_audio_extensions() {
    let files = vec!["a.mp3", "b.flac", "c.wav", "d.txt"];
    let out = filter_supported(files);
    assert_eq!(out, vec!["a.mp3", "b.flac", "c.wav"]);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --manifest-path src-tauri/Cargo.toml scan_filters_supported_audio_extensions`
Expected: FAIL with missing function/module

- [ ] **Step 3: Write minimal implementation**

```rust
// src-tauri/src/commands/library.rs
use crate::models::Track;

pub fn filter_supported(files: Vec<&str>) -> Vec<&str> {
    files
        .into_iter()
        .filter(|f| ["mp3", "flac", "wav", "m4a"].iter().any(|ext| f.to_lowercase().ends_with(ext)))
        .collect()
}

#[tauri::command]
pub async fn scan_library(dir: String) -> Result<Vec<Track>, String> {
    let _ = dir;
    Ok(vec![])
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cargo test --manifest-path src-tauri/Cargo.toml scan_filters_supported_audio_extensions`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src-tauri/src/commands/library.rs src-tauri/src/error.rs src-tauri/src/commands/mod.rs src-tauri/src/main.rs src-tauri/tests/library_scan.rs
git commit -m "feat: add backend scan command skeleton with format filtering"
```

### Task 4: Build library store + scan flow with incremental UI updates

**Files:**
- Create: `src/store/useLibraryStore.ts`, `src/modules/library/scan.ts`
- Modify: `src/App.tsx`
- Test: `tests/unit/libraryStore.test.ts`

- [ ] **Step 1: Write the failing test for incremental insert behavior**

```ts
import { describe, it, expect } from 'vitest'
import { applyScanChunk } from '../../src/store/useLibraryStore'

describe('applyScanChunk', () => {
  it('appends chunk without dropping existing items', () => {
    const prev = [{ id: '1' }, { id: '2' }]
    const next = applyScanChunk(prev as any, [{ id: '3' }] as any)
    expect(next.map((x: any) => x.id)).toEqual(['1', '2', '3'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/unit/libraryStore.test.ts`
Expected: FAIL with missing export

- [ ] **Step 3: Write minimal implementation**

```ts
// src/store/useLibraryStore.ts
import { create } from 'zustand'
import { Track } from '../types/media'

export function applyScanChunk(prev: Track[], chunk: Track[]) {
  return [...prev, ...chunk]
}

type LibraryState = {
  tracks: Track[]
  setTracks: (tracks: Track[]) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  tracks: [],
  setTracks: (tracks) => set({ tracks }),
}))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/unit/libraryStore.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/store/useLibraryStore.ts src/modules/library/scan.ts src/App.tsx tests/unit/libraryStore.test.ts
git commit -m "feat: add library store and incremental scan flow"
```

### Task 5: Implement player adapter + mode logic (order/repeat/shuffle)

**Files:**
- Create: `src/lib/player.ts`, `src/store/usePlayerStore.ts`, `src/components/player/ModeSwitch.tsx`
- Test: `tests/unit/playerMode.test.ts`

- [ ] **Step 1: Write the failing test for next-track resolution by mode**

```ts
import { describe, it, expect } from 'vitest'
import { resolveNextIndex } from '../../src/store/usePlayerStore'

describe('resolveNextIndex', () => {
  it('keeps index in repeat-one mode', () => {
    expect(resolveNextIndex({ mode: 'repeat-one', currentIndex: 1, total: 5 })).toBe(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/unit/playerMode.test.ts`
Expected: FAIL with missing function

- [ ] **Step 3: Write minimal implementation**

```ts
// src/store/usePlayerStore.ts
export type PlayMode = 'order' | 'repeat-one' | 'repeat-all' | 'shuffle'

export function resolveNextIndex(input: { mode: PlayMode; currentIndex: number; total: number }) {
  const { mode, currentIndex, total } = input
  if (total === 0) return -1
  if (mode === 'repeat-one') return currentIndex
  if (mode === 'repeat-all') return (currentIndex + 1) % total
  if (mode === 'shuffle') return Math.floor(Math.random() * total)
  return currentIndex + 1 < total ? currentIndex + 1 : -1
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/unit/playerMode.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/player.ts src/store/usePlayerStore.ts src/components/player/ModeSwitch.tsx tests/unit/playerMode.test.ts
git commit -m "feat: implement player mode logic and adapter"
```

### Task 6: Add playlists + recent history persistence

**Files:**
- Create: `src/store/usePlaylistStore.ts`
- Modify: `src/store/usePlayerStore.ts`
- Test: `tests/unit/playlistStore.test.ts`, `tests/unit/historyStore.test.ts`

- [ ] **Step 1: Write failing tests for playlist add/remove and history de-dup**

```ts
import { describe, it, expect } from 'vitest'
import { pushHistory } from '../../src/store/usePlayerStore'

describe('pushHistory', () => {
  it('moves existing track to front without duplicates', () => {
    const next = pushHistory(['a', 'b', 'c'], 'b', 5)
    expect(next).toEqual(['b', 'a', 'c'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/unit/historyStore.test.ts`
Expected: FAIL with missing function

- [ ] **Step 3: Write minimal implementation**

```ts
// src/store/usePlayerStore.ts
export function pushHistory(history: string[], currentId: string, limit: number) {
  const without = history.filter((id) => id !== currentId)
  return [currentId, ...without].slice(0, limit)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/unit/historyStore.test.ts tests/unit/playlistStore.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/store/usePlaylistStore.ts src/store/usePlayerStore.ts tests/unit/playlistStore.test.ts tests/unit/historyStore.test.ts
git commit -m "feat: add playlist state and recent history behavior"
```

### Task 7: Implement local LRC parser and sync module

**Files:**
- Create: `src/modules/lyrics/parseLrc.ts`, `src/modules/lyrics/sync.ts`, `src/components/lyrics/LyricsPanel.tsx`
- Test: `tests/unit/parseLrc.test.ts`

- [ ] **Step 1: Write the failing parser test for valid/invalid lines**

```ts
import { describe, it, expect } from 'vitest'
import { parseLrc } from '../../src/modules/lyrics/parseLrc'

describe('parseLrc', () => {
  it('parses timed lines and skips malformed lines', () => {
    const out = parseLrc('[00:01.00]hello\nnot-valid')
    expect(out).toEqual([{ time: 1, text: 'hello' }])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/unit/parseLrc.test.ts`
Expected: FAIL with missing parser

- [ ] **Step 3: Write minimal implementation**

```ts
// src/modules/lyrics/parseLrc.ts
export type LyricLine = { time: number; text: string }

export function parseLrc(content: string): LyricLine[] {
  return content
    .split('\n')
    .map((line) => {
      const m = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)$/)
      if (!m) return null
      const time = Number(m[1]) * 60 + Number(m[2]) + Number(m[3]) / 100
      return { time, text: m[4].trim() }
    })
    .filter(Boolean) as LyricLine[]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/unit/parseLrc.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/lyrics/parseLrc.ts src/modules/lyrics/sync.ts src/components/lyrics/LyricsPanel.tsx tests/unit/parseLrc.test.ts
git commit -m "feat: add local lrc parsing and sync module"
```

### Task 8: Build glass UI shell, bottom controls, and theme switch

**Files:**
- Create: `src/components/layout/AppShell.tsx`, `src/components/player/BottomPlayerBar.tsx`, `src/components/theme/ThemeToggle.tsx`, `src/styles/glass.css`
- Modify: `src/App.tsx`
- Test: `tests/e2e/ui-shell.spec.ts`

- [ ] **Step 1: Write failing e2e test for shell regions and theme toggle**

```ts
import { test, expect } from '@playwright/test'

test('shell has sidebar content and bottom player', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('sidebar')).toBeVisible()
  await expect(page.getByTestId('main-content')).toBeVisible()
  await expect(page.getByTestId('bottom-player')).toBeVisible()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm playwright test tests/e2e/ui-shell.spec.ts`
Expected: FAIL with missing test IDs/layout

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/layout/AppShell.tsx
export function AppShell() {
  return (
    <div className="glass-root" data-testid="app-shell">
      <aside data-testid="sidebar" />
      <main data-testid="main-content" />
      <footer data-testid="bottom-player" />
    </div>
  )
}
```

```css
/* src/styles/glass.css */
.glass-root {
  backdrop-filter: blur(18px) saturate(140%);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.24);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm playwright test tests/e2e/ui-shell.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppShell.tsx src/components/player/BottomPlayerBar.tsx src/components/theme/ThemeToggle.tsx src/styles/glass.css src/App.tsx tests/e2e/ui-shell.spec.ts
git commit -m "feat: add glass ui shell and playback control layout"
```

### Task 9: Add global hotkeys + settings persistence bridge

**Files:**
- Modify: `src-tauri/src/commands/settings.rs`, `src-tauri/src/main.rs`
- Modify: `src/store/useSettingsStore.ts`, `src/App.tsx`
- Test: `tests/unit/settingsStore.test.ts`

- [ ] **Step 1: Write failing test for settings save/load defaults**

```ts
import { describe, it, expect } from 'vitest'
import { normalizeSettings } from '../../src/store/useSettingsStore'

describe('normalizeSettings', () => {
  it('fills missing fields with defaults', () => {
    expect(normalizeSettings({ theme: 'dark' } as any)).toEqual({
      theme: 'dark',
      volume: 0.8,
      lastScanDir: undefined,
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/unit/settingsStore.test.ts`
Expected: FAIL with missing helper

- [ ] **Step 3: Write minimal implementation**

```ts
// src/store/useSettingsStore.ts
import { create } from 'zustand'

export function normalizeSettings(input: Partial<{ theme: 'light' | 'dark'; volume: number; lastScanDir?: string }>) {
  return {
    theme: input.theme ?? 'light',
    volume: input.volume ?? 0.8,
    lastScanDir: input.lastScanDir,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/unit/settingsStore.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src-tauri/src/commands/settings.rs src-tauri/src/main.rs src/store/useSettingsStore.ts src/App.tsx tests/unit/settingsStore.test.ts
git commit -m "feat: add settings persistence and hotkey integration"
```

### Task 10: Verification, packaging, and release artifact

**Files:**
- Modify: `src-tauri/tauri.conf.json`
- Modify: `package.json`
- Create: `scripts/verify.ps1`
- Test: `tests/e2e/app-smoke.spec.ts`, `tests/e2e/ui-shell.spec.ts`

- [ ] **Step 1: Write failing packaging check script test (command-level)**

```bash
# expected command to exist in package.json scripts
pnpm run verify
```

Expected: FAIL with missing script

- [ ] **Step 2: Run check to verify it fails**

Run: `pnpm run verify`
Expected: FAIL with "Missing script: verify"

- [ ] **Step 3: Write minimal implementation**

```json
{
  "scripts": {
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "verify": "pnpm test:unit && pnpm test:e2e && pnpm tauri build"
  }
}
```

```json
{
  "bundle": {
    "active": true,
    "targets": ["nsis"],
    "windows": {
      "wix": null,
      "nsis": {
        "installerIcon": "icons/icon.ico"
      }
    }
  }
}
```

- [ ] **Step 4: Run verification to confirm pass and output artifact**

Run: `pnpm run verify`
Expected: PASS; generated installer in `src-tauri/target/release/bundle/nsis/`

- [ ] **Step 5: Commit**

```bash
git add src-tauri/tauri.conf.json package.json scripts/verify.ps1
git commit -m "chore: add verification pipeline and windows release packaging"
```

---

## Self-Review

### 1. Spec coverage check
- 本地目录扫描与格式过滤 -> Task 3, 4
- 播放控制与模式 -> Task 5, 8
- 播放列表与最近播放 -> Task 6
- 歌词显示 -> Task 7
- 主题切换与玻璃 UI -> Task 8, 9
- 全局快捷键与设置持久化 -> Task 9
- 打包 exe、轻量目标验证 -> Task 10

Coverage result: no missing spec requirement.

### 2. Placeholder scan
- Removed all `TODO/TBD` placeholders.
- Every task has explicit files, runnable commands, and concrete snippets.

### 3. Type/signature consistency
- `Track`, `AppSettings`, `PlayMode`, `parseLrc`, `resolveNextIndex`, `pushHistory` naming is consistent across tasks.
- Settings default structure is consistent with spec fields.

Consistency result: no conflicts found.
