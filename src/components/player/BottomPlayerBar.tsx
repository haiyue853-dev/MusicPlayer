import { ModeSwitch } from './ModeSwitch'
import type { PlayMode } from '../../store/usePlayerStore'

type BottomPlayerBarProps = {
  title: string
  artist: string
  isPlaying: boolean
  mode: PlayMode
  progress: number
  volume: number
  onPrev: () => void
  onPlayPause: () => void
  onNext: () => void
  onModeChange: (mode: PlayMode) => void
  onSeek: (seconds: number) => void
  onVolumeChange: (volume: number) => void
}

export function BottomPlayerBar(props: BottomPlayerBarProps) {
  const {
    title,
    artist,
    isPlaying,
    mode,
    progress,
    volume,
    onPrev,
    onPlayPause,
    onNext,
    onModeChange,
    onSeek,
    onVolumeChange,
  } = props

  return (
    <footer className="bottom-player" data-testid="bottom-player">
      <div className="now-playing">
        <div className="title">{title || '未选择歌曲'}</div>
        <div className="artist">{artist || 'Unknown'}</div>
      </div>
      <div className="controls">
        <button type="button" onClick={onPrev}>Prev</button>
        <button type="button" onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={onNext}>Next</button>
        <ModeSwitch mode={mode} onChange={onModeChange} />
      </div>
      <div className="sliders">
        <input type="range" min={0} max={3600} step={1} value={progress} onChange={(e) => onSeek(Number(e.target.value))} />
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => onVolumeChange(Number(e.target.value))} />
      </div>
    </footer>
  )
}
