import { create } from 'zustand'
import type { Track } from '../types/media'

export function applyScanChunk(prev: Track[], chunk: Track[]) {
  return [...prev, ...chunk]
}

type LibraryState = {
  tracks: Track[]
  isScanning: boolean
  currentDir: string | null
  setTracks: (tracks: Track[]) => void
  setScanning: (isScanning: boolean) => void
  setCurrentDir: (dir: string | null) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  tracks: [],
  isScanning: false,
  currentDir: null,
  setTracks: (tracks) => set({ tracks }),
  setScanning: (isScanning) => set({ isScanning }),
  setCurrentDir: (currentDir) => set({ currentDir }),
}))
