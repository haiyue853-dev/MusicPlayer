import { describe, it, expect } from 'vitest'
import { normalizeSettings } from '../../src/store/useSettingsStore'

describe('normalizeSettings', () => {
  it('fills missing fields with defaults', () => {
    expect(normalizeSettings({ theme: 'dark' } as any)).toEqual({
      theme: 'dark',
      volume: 0.8,
      lastScanDir: undefined,
    })
  })
})
