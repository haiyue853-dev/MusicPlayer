export type Track = {
  id: string
  path: string
  title: string
  artist: string
  album: string
  duration: number
  cover?: string
  lrcPath?: string
}

export type AppSettings = {
  theme: 'light' | 'dark'
  volume: number
  lastScanDir?: string
}
