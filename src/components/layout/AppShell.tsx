import type { Track } from '../../types/media'
import type { PlayMode } from '../../store/usePlayerStore'
import { BottomPlayerBar } from '../player/BottomPlayerBar'
import { TrackTable } from '../library/TrackTable'

type AppShellProps = {
  tracks: Track[]
  activeTrackId?: string
  isScanning: boolean
  scanDir?: string | null
  isPlaying: boolean
  mode: PlayMode
  progress: number
  volume: number
  nowTitle: string
  nowArtist: string
  onPickFolder: () => void
  onSelectTrack: (track: Track, index: number) => void
  onPrev: () => void
  onPlayPause: () => void
  onNext: () => void
  onModeChange: (mode: PlayMode) => void
  onSeek: (seconds: number) => void
  onVolumeChange: (volume: number) => void
}

export function AppShell(props: AppShellProps) {
  return (
    <div className="glass-root" data-testid="app-shell">
      <aside className="sidebar" data-testid="sidebar">
        <button type="button" className="pick-btn" onClick={props.onPickFolder}>
          选择音乐文件夹
        </button>
        <div className="scan-info">{props.isScanning ? '扫描中...' : props.scanDir ? `当前目录: ${props.scanDir}` : '尚未选择目录'}</div>
      </aside>

      <main className="main-content" data-testid="main-content">
        <h2>Music Library</h2>
        <TrackTable tracks={props.tracks} activeTrackId={props.activeTrackId} onSelect={props.onSelectTrack} />
      </main>

      <BottomPlayerBar
        title={props.nowTitle}
        artist={props.nowArtist}
        isPlaying={props.isPlaying}
        mode={props.mode}
        progress={props.progress}
        volume={props.volume}
        onPrev={props.onPrev}
        onPlayPause={props.onPlayPause}
        onNext={props.onNext}
        onModeChange={props.onModeChange}
        onSeek={props.onSeek}
        onVolumeChange={props.onVolumeChange}
      />
    </div>
  )
}
