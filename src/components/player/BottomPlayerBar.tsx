export function BottomPlayerBar() {
  return (
    <footer className="bottom-player" data-testid="bottom-player">
      <div>Now Playing</div>
      <div className="controls">
        <button type="button">Prev</button>
        <button type="button">Play</button>
        <button type="button">Next</button>
      </div>
    </footer>
  )
}
