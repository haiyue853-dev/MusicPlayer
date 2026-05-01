import type { PlayMode } from '../../store/usePlayerStore'

type ModeSwitchProps = {
  mode: PlayMode
  onChange: (mode: PlayMode) => void
}

const MODES: PlayMode[] = ['order', 'repeat-one', 'repeat-all', 'shuffle']

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  const idx = MODES.indexOf(mode)
  return (
    <button
      type="button"
      data-testid="mode-switch"
      onClick={() => onChange(MODES[(idx + 1) % MODES.length])}
    >
      {mode}
    </button>
  )
}
