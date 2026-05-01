export type PlayMode = 'order' | 'repeat-one' | 'repeat-all' | 'shuffle'

export function resolveNextIndex(input: { mode: PlayMode; currentIndex: number; total: number }) {
  const { mode, currentIndex, total } = input
  if (total === 0) return -1
  if (mode === 'repeat-one') return currentIndex
  if (mode === 'repeat-all') return (currentIndex + 1) % total
  if (mode === 'shuffle') return Math.floor(Math.random() * total)
  return currentIndex + 1 < total ? currentIndex + 1 : -1
}
