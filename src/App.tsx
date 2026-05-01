import { useEffect, useMemo, useRef, useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ThemeToggle } from './components/theme/ThemeToggle'
import { createPlayerAdapter } from './lib/player'
import { pickFolder } from './lib/tauri'
import { scanAndMerge } from './modules/library/scan'
import { useLibraryStore } from './store/useLibraryStore'
import { usePlayerStore } from './store/usePlayerStore'
import type { Track } from './types/media'
import './styles/glass.css'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const playerRef = useRef(createPlayerAdapter())

  const { tracks, isScanning, currentDir, setTracks, setScanning, setCurrentDir } = useLibraryStore()
  const {
    queue,
    currentIndex,
    isPlaying,
    mode,
    progress,
    volume,
    setQueue,
    playAt,
    setPlaying,
    setMode,
    setVolume,
    setProgress,
    next,
    prev,
    pushCurrentToHistory,
  } = usePlayerStore()

  const currentTrack = useMemo(() => queue[currentIndex], [queue, currentIndex])

  useEffect(() => {
    playerRef.current.onEnded(() => {
      pushCurrentToHistory()
      next()
    })
  }, [next, pushCurrentToHistory])

  useEffect(() => {
    playerRef.current.setVolume(volume)
  }, [volume])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(playerRef.current.getCurrentTime())
      }, 300)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, setProgress])

  useEffect(() => {
    if (!currentTrack) return
    playerRef.current.load(currentTrack)
    if (isPlaying) {
      playerRef.current.play().catch(() => setPlaying(false))
    }
  }, [currentTrack, isPlaying, setPlaying])

  async function handlePickFolder() {
    try {
      const dir = await pickFolder()
      if (!dir) return
      setScanning(true)
      setCurrentDir(dir)
      const scanned = await scanAndMerge(dir, [])
      setTracks(scanned)
      setQueue(scanned)
      if (scanned.length > 0) {
        playAt(0)
      }
    } catch (error) {
      alert('打开文件夹失败，请确认系统文件选择权限可用')
      console.error(error)
    } finally {
      setScanning(false)
    }
  }

  function handleSelectTrack(_track: Track, index: number) {
    playAt(index)
  }

  function handlePlayPause() {
    if (!currentTrack) return
    if (isPlaying) {
      playerRef.current.pause()
      setPlaying(false)
      return
    }
    playerRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }

  function handleNext() {
    next()
  }

  function handlePrev() {
    prev()
  }

  function handleSeek(seconds: number) {
    playerRef.current.seek(seconds)
    setProgress(seconds)
  }

  function handleVolume(nextVolume: number) {
    setVolume(nextVolume)
  }

  return (
    <div className="app-root" data-theme={theme}>
      <header className="topbar">
        <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
      </header>
      <AppShell
        tracks={tracks}
        activeTrackId={currentTrack?.id}
        isScanning={isScanning}
        scanDir={currentDir}
        isPlaying={isPlaying}
        mode={mode}
        progress={progress}
        volume={volume}
        nowTitle={currentTrack?.title ?? ''}
        nowArtist={currentTrack?.artist ?? ''}
        onPickFolder={handlePickFolder}
        onSelectTrack={handleSelectTrack}
        onPrev={handlePrev}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onModeChange={setMode}
        onSeek={handleSeek}
        onVolumeChange={handleVolume}
      />
    </div>
  )
}
