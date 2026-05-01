import type { Track } from '../types/media'

type PlayerAdapter = {
  load: (track: Track) => void
  play: () => void
  pause: () => void
  seek: (seconds: number) => void
}

export function createPlayerAdapter(): PlayerAdapter {
  return {
    load: () => {},
    play: () => {},
    pause: () => {},
    seek: () => {},
  }
}
