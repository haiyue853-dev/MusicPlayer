import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import type { AppSettings, Track } from '../types/media'

export function normalizeTrackId(path: string) {
  return path.replaceAll('\\', '/').toLowerCase()
}

export async function invokeScan(dir: string) {
  return invoke<Track[]>('scan_library', { dir })
}

export async function loadSettings() {
  return invoke<AppSettings>('load_settings')
}

export async function saveSettings(settings: AppSettings) {
  return invoke('save_settings', { settings })
}

export async function pickFolder() {
  const selected = await open({
    directory: true,
    multiple: false,
    title: '选择音乐文件夹',
  })
  return typeof selected === 'string' ? selected : null
}
