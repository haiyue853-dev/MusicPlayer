import { create } from 'zustand'
import type { Track } from '../types/media'

export type PlayMode = 'order' | 'repeat-one' | 'repeat-all' | 'shuffle'

export function resolveNextIndex(input: { mode: PlayMode; currentIndex: number; total: number }) {
  const { mode, currentIndex, total } = input
  if (total === 0) return -1
  if (mode === 'repeat-one') return currentIndex
  if (mode === 'repeat-all') return (currentIndex + 1) % total
  if (mode === 'shuffle') return Math.floor(Math.random() * total)
  return currentIndex + 1 < total ? currentIndex + 1 : -1
}

export function pushHistory(history: string[], currentId: string, limit: number) {
  const without = history.filter((id) => id !== currentId)
  return [currentId, ...without].slice(0, limit)
}

type PlayerState = {
  queue: Track[]
  currentIndex: number
  isPlaying: boolean
  mode: PlayMode
  volume: number
  progress: number
  history: string[]
  setQueue: (queue: Track[]) => void
  playAt: (index: number) => void
  setPlaying: (isPlaying: boolean) => void
  setMode: (mode: PlayMode) => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  next: () => void
  prev: () => void
  pushCurrentToHistory: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  mode: 'order',
  volume: 0.8,
  progress: 0,
  history: [],
  setQueue: (queue) => set({ queue }),
  playAt: (index) => set({ currentIndex: index, isPlaying: true, progress: 0 }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setMode: (mode) => set({ mode }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  next: () => {
    const s = get()
    const nextIndex = resolveNextIndex({ mode: s.mode, currentIndex: s.currentIndex, total: s.queue.length })
    if (nextIndex >= 0) set({ currentIndex: nextIndex, isPlaying: true, progress: 0 })
    else set({ isPlaying: false })
  },
  prev: () => {
    const s = get()
    if (!s.queue.length) return
    const prevIndex = s.currentIndex <= 0 ? 0 : s.currentIndex - 1
    set({ currentIndex: prevIndex, isPlaying: true, progress: 0 })
  },
  pushCurrentToHistory: () => {
    const s = get()
    const current = s.queue[s.currentIndex]
    if (!current) return
    set({ history: pushHistory(s.history, current.id, 100) })
  },
}))
