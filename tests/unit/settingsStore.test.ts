import { describe, it, expect } from 'vitest'
import { normalizeSettings, applyPickedFolder } from '../../src/store/useSettingsStore'

describe('normalizeSettings', () => {
  it('fills missing fields with defaults', () => {
    expect(normalizeSettings({ theme: 'dark' } as any)).toEqual({
      theme: 'dark',
      volume: 0.8,
      lastScanDir: undefined,
    })
  })

  it('stores selected folder as lastScanDir', () => {
    const next = applyPickedFolder(normalizeSettings({}), 'D:/Music')
    expect(next.lastScanDir).toBe('D:/Music')
  })
})
