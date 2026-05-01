import type { LyricLine } from '../../modules/lyrics/parseLrc'

type LyricsPanelProps = {
  lines: LyricLine[]
  activeIndex: number
}

export function LyricsPanel({ lines, activeIndex }: LyricsPanelProps) {
  if (!lines.length) {
    return <div data-testid="lyrics-empty">暂无歌词</div>
  }

  return (
    <div data-testid="lyrics-panel">
      {lines.map((line, index) => (
        <p key={`${line.time}-${index}`} data-active={index === activeIndex}>
          {line.text}
        </p>
      ))}
    </div>
  )
}
