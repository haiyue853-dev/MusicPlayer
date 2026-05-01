import { create } from 'zustand'

export type Playlist = {
  id: string
  name: string
  trackIds: string[]
}

export function createPlaylist(id: string, name: string): Playlist {
  return { id, name, trackIds: [] }
}

export function addTrackToPlaylist(playlist: Playlist, trackId: string): Playlist {
  if (playlist.trackIds.includes(trackId)) return playlist
  return { ...playlist, trackIds: [...playlist.trackIds, trackId] }
}

export function removeTrackFromPlaylist(playlist: Playlist, trackId: string): Playlist {
  return { ...playlist, trackIds: playlist.trackIds.filter((id) => id !== trackId) }
}

type PlaylistState = {
  playlists: Playlist[]
  setPlaylists: (playlists: Playlist[]) => void
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: [],
  setPlaylists: (playlists) => set({ playlists }),
}))
