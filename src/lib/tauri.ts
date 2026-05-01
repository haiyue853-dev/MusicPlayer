import { invoke } from '@tauri-apps/api/core'

export function normalizeTrackId(path: string) {
  return path.replaceAll('\\', '/').toLowerCase()
}

export async function invokeScan(dir: string) {
  return invoke('scan_library', { dir })
}
