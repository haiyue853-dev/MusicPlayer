import { create } from 'zustand'

export type Settings = {
  theme: 'light' | 'dark'
  volume: number
  lastScanDir?: string
}

export function normalizeSettings(input: Partial<Settings>): Settings {
  return {
    theme: input.theme ?? 'light',
    volume: input.volume ?? 0.8,
    lastScanDir: input.lastScanDir,
  }
}

type SettingsState = {
  settings: Settings
  setSettings: (next: Partial<Settings>) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: normalizeSettings({}),
  setSettings: (next) =>
    set((state) => ({
      settings: normalizeSettings({ ...state.settings, ...next }),
    })),
}))
