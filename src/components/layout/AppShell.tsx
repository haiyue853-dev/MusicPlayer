import { BottomPlayerBar } from '../player/BottomPlayerBar'

export function AppShell() {
  return (
    <div className="glass-root" data-testid="app-shell">
      <aside className="sidebar" data-testid="sidebar">
        Sidebar
      </aside>
      <main className="main-content" data-testid="main-content">
        Music Library
      </main>
      <BottomPlayerBar />
    </div>
  )
}
