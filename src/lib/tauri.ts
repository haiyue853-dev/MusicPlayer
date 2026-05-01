import { invoke } from '@tauri-apps/api/core'
import type { AppSettings } from '../types/media'

export function normalizeTrackId(path: string) {
  return path.replaceAll('\\', '/').toLowerCase()
}

export async function invokeScan(dir: string) {
  return invoke('scan_library', { dir })
}

export async function loadSettings() {
  return invoke<AppSettings>('load_settings')
}

export async function saveSettings(settings: AppSettings) {
  return invoke('save_settings', { settings })
}
