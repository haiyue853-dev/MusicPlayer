import type { Track } from '../../types/media'

type TrackTableProps = {
  tracks: Track[]
  activeTrackId?: string
  onSelect: (track: Track, index: number) => void
}

export function TrackTable({ tracks, activeTrackId, onSelect }: TrackTableProps) {
  if (!tracks.length) {
    return <div data-testid="track-empty">还没有歌曲，请先选择本地文件夹。</div>
  }

  return (
    <div className="track-table" data-testid="track-table">
      {tracks.map((track, index) => (
        <button
          key={track.id}
          type="button"
          className={`track-row ${activeTrackId === track.id ? 'active' : ''}`}
          onClick={() => onSelect(track, index)}
        >
          <span>{track.title}</span>
          <small>{track.artist}</small>
        </button>
      ))}
    </div>
  )
}
