import { invokeScan } from '../../lib/tauri'
import type { Track } from '../../types/media'
import { applyScanChunk } from '../../store/useLibraryStore'

export async function scanAndMerge(dir: string, prev: Track[]) {
  const result = await invokeScan(dir)
  return applyScanChunk(prev, result)
}
