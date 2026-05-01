import { create } from 'zustand'
import type { Track } from '../types/media'

export function applyScanChunk(prev: Track[], chunk: Track[]) {
  return [...prev, ...chunk]
}

type LibraryState = {
  tracks: Track[]
  isScanning: boolean
  setTracks: (tracks: Track[]) => void
  setScanning: (isScanning: boolean) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  tracks: [],
  isScanning: false,
  setTracks: (tracks) => set({ tracks }),
  setScanning: (isScanning) => set({ isScanning }),
}))
