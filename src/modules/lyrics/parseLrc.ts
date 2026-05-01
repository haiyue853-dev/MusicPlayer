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
    .filter(Boolean)
    .sort((a, b) => (a as LyricLine).time - (b as LyricLine).time) as LyricLine[]
}
