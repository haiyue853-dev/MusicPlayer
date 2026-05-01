import { describe, it, expect } from 'vitest'
import { createPlaylist, addTrackToPlaylist, removeTrackFromPlaylist } from '../../src/store/usePlaylistStore'

describe('playlist store helpers', () => {
  it('adds and removes tracks from playlist', () => {
    const p = createPlaylist('p1', 'My List')
    const withTrack = addTrackToPlaylist(p, 'track-1')
    const withoutTrack = removeTrackFromPlaylist(withTrack, 'track-1')

    expect(withTrack.trackIds).toEqual(['track-1'])
    expect(withoutTrack.trackIds).toEqual([])
  })
})
