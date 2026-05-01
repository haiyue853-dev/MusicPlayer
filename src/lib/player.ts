import { convertFileSrc } from '@tauri-apps/api/core'
import type { Track } from '../types/media'

export function resolveAudioSrc(path: string, converter: (path: string) => string = convertFileSrc) {
  return converter(path)
}

type HtmlAudioPlayer = {
  load: (track: Track) => void
  play: () => Promise<void>
  pause: () => void
  seek: (seconds: number) => void
  setVolume: (volume: number) => void
  getCurrentTime: () => number
  onEnded: (handler: () => void) => void
}

export function createPlayerAdapter(): HtmlAudioPlayer {
  const audio = new Audio()

  return {
    load: (track) => {
      audio.src = resolveAudioSrc(track.path)
      audio.load()
    },
    play: () => audio.play(),
    pause: () => audio.pause(),
    seek: (seconds) => {
      audio.currentTime = seconds
    },
    setVolume: (volume) => {
      audio.volume = Math.min(1, Math.max(0, volume))
    },
    getCurrentTime: () => audio.currentTime,
    onEnded: (handler) => {
      audio.onended = handler
    },
  }
}
