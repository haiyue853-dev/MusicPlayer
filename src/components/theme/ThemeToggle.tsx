type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button type="button" className="theme-toggle" data-testid="theme-toggle" onClick={onToggle}>
      <span className="theme-dot" />
      {theme === 'light' ? 'Light Glass' : 'Dark Glass'}
    </button>
  )
}
