import { describe, it, expect } from 'vitest'
import { mergeSettingsAfterPick } from '../../src/lib/tauri'

describe('mergeSettingsAfterPick', () => {
  it('updates lastScanDir while preserving other fields', () => {
    const next = mergeSettingsAfterPick({ theme: 'dark', volume: 0.5 }, 'D:/Music')
    expect(next).toEqual({ theme: 'dark', volume: 0.5, lastScanDir: 'D:/Music' })
  })
})
