import type { LyricLine } from './parseLrc'

export function findActiveLyricIndex(lines: LyricLine[], currentTime: number) {
  if (!lines.length) return -1
  let idx = -1
  for (let i = 0; i < lines.length; i += 1) {
    if (currentTime >= lines[i].time) idx = i
    else break
  }
  return idx
}
