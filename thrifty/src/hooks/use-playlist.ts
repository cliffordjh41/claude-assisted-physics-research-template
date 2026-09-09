
import { useState, useCallback } from "react"

export interface Track {
  id: string
  title: string
  url: string
  playlistId: string
  order: number
}

export interface Playlist {
  id: string
  name: string
  order: number
}

interface MusicLibrary {
  playlists: Playlist[]
  tracks: Track[]
}

const STORAGE_KEY = "thrifty-music"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function load(): MusicLibrary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as MusicLibrary
  } catch { /* ignore */ }
  return { playlists: [], tracks: [] }
}

function save(lib: MusicLibrary): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lib))
}

function createSeed(): MusicLibrary {
  const playlistId = generateId()
  const lib: MusicLibrary = {
    playlists: [{ id: playlistId, name: "My Music", order: 0 }],
    tracks: [
      { id: generateId(), title: "Sample Track", url: "/sample-track.mp3", playlistId, order: 0 },
    ],
  }
  save(lib)
  return lib
}

export function usePlaylist() {
  const [library, setLibrary] = useState<MusicLibrary>(() => {
    const data = load()
    return data.playlists.length > 0 ? data : createSeed()
  })

  const persist = useCallback((next: MusicLibrary) => {
    save(next)
    setLibrary(next)
  }, [])

  // Playlists
  const createPlaylist = useCallback((name: string) => {
    const playlist: Playlist = { id: generateId(), name, order: library.playlists.length }
    persist({ ...library, playlists: [...library.playlists, playlist] })
  }, [library, persist])

  const deletePlaylist = useCallback((id: string) => {
    persist({
      playlists: library.playlists.filter((p) => p.id !== id),
      tracks: library.tracks.filter((t) => t.playlistId !== id),
    })
  }, [library, persist])

  const renamePlaylist = useCallback((id: string, name: string) => {
    const playlists = library.playlists.map((p) => (p.id === id ? { ...p, name } : p))
    persist({ ...library, playlists })
  }, [library, persist])

  // Tracks
  const getTracksForPlaylist = useCallback((playlistId: string): Track[] => {
    return library.tracks
      .filter((t) => t.playlistId === playlistId)
      .sort((a, b) => a.order - b.order)
  }, [library.tracks])

  const addTrack = useCallback((playlistId: string, title: string, url: string) => {
    const playlistTracks = library.tracks.filter((t) => t.playlistId === playlistId)
    const track: Track = {
      id: generateId(),
      title,
      url,
      playlistId,
      order: playlistTracks.length,
    }
    persist({ ...library, tracks: [...library.tracks, track] })
  }, [library, persist])

  const deleteTrack = useCallback((id: string) => {
    persist({ ...library, tracks: library.tracks.filter((t) => t.id !== id) })
  }, [library, persist])

  const reorderTracks = useCallback((playlistId: string, reordered: Track[]) => {
    const updated = reordered.map((t, i) => ({ ...t, order: i }))
    const other = library.tracks.filter((t) => t.playlistId !== playlistId)
    persist({ ...library, tracks: [...other, ...updated] })
  }, [library, persist])

  const reorderPlaylists = useCallback((reorderedIds: { id: string }[]) => {
    const reordered = reorderedIds.map((item, i) => {
      const pl = library.playlists.find((p) => p.id === item.id)!
      return { ...pl, order: i }
    })
    persist({ ...library, playlists: reordered })
  }, [library, persist])

  const playlists = library.playlists.sort((a, b) => a.order - b.order)
  const tracks = library.tracks

  return {
    playlists,
    tracks,
    getTracksForPlaylist,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addTrack,
    deleteTrack,
    reorderTracks,
    reorderPlaylists,
  }
}
