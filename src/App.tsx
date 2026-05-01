import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ThemeToggle } from './components/theme/ThemeToggle'
import './styles/glass.css'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div data-theme={theme}>
      <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      <AppShell />
    </div>
  )
}
