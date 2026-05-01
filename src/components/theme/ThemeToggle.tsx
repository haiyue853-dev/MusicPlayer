type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button type="button" data-testid="theme-toggle" onClick={onToggle}>
      Theme: {theme}
    </button>
  )
}
