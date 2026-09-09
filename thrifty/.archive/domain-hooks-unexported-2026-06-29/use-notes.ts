
import { useState, useCallback } from "react"

export interface Note {
  id: string
  folderId: string
  title: string
  content: string
  order: number
  createdAt: number
  updatedAt: number
}

export interface Folder {
  id: string
  name: string
  order: number
}

interface NotesLibrary {
  folders: Folder[]
  notes: Note[]
}

const STORAGE_KEY = "thrifty-notes"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function load(): NotesLibrary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as NotesLibrary
  } catch { /* ignore */ }
  return { folders: [], notes: [] }
}

function save(lib: NotesLibrary): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lib))
}

export function useNotes() {
  const [library, setLibrary] = useState<NotesLibrary>(() => {
    const data = load()
    if (data.folders.length === 0) {
      const seed: NotesLibrary = {
        folders: [{ id: generateId(), name: "Notes", order: 0 }],
        notes: [],
      }
      save(seed)
      return seed
    }
    return data
  })

  const persist = useCallback((next: NotesLibrary) => {
    save(next)
    setLibrary(next)
  }, [])

  // Folders
  const createFolder = useCallback((name: string) => {
    const folder: Folder = { id: generateId(), name, order: library.folders.length }
    persist({ ...library, folders: [...library.folders, folder] })
  }, [library, persist])

  const updateFolder = useCallback((id: string, updates: Partial<Folder>) => {
    const folders = library.folders.map((f) => (f.id === id ? { ...f, ...updates } : f))
    persist({ ...library, folders })
  }, [library, persist])

  const deleteFolder = useCallback((id: string) => {
    persist({
      folders: library.folders.filter((f) => f.id !== id),
      notes: library.notes.filter((n) => n.folderId !== id),
    })
  }, [library, persist])

  const reorderFolders = useCallback((reordered: Folder[]) => {
    const folders = reordered.map((f, i) => ({ ...f, order: i }))
    persist({ ...library, folders })
  }, [library, persist])

  // Notes
  const getNotesForFolder = useCallback((folderId: string): Note[] => {
    return library.notes
      .filter((n) => n.folderId === folderId)
      .sort((a, b) => a.order - b.order)
  }, [library.notes])

  const createNote = useCallback((folderId: string, title: string, content: string) => {
    const now = Date.now()
    const folderNotes = library.notes.filter((n) => n.folderId === folderId)
    const note: Note = {
      id: generateId(),
      folderId,
      title,
      content,
      order: folderNotes.length,
      createdAt: now,
      updatedAt: now,
    }
    persist({ ...library, notes: [...library.notes, note] })
  }, [library, persist])

  const updateNote = useCallback((noteId: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
    const notes = library.notes.map((n) =>
      n.id === noteId ? { ...n, ...updates, updatedAt: Date.now() } : n
    )
    persist({ ...library, notes })
  }, [library, persist])

  const deleteNote = useCallback((noteId: string) => {
    persist({ ...library, notes: library.notes.filter((n) => n.id !== noteId) })
  }, [library, persist])

  const reorderNotes = useCallback((folderId: string, reordered: Note[]) => {
    const updated = reordered.map((n, i) => ({ ...n, order: i }))
    const other = library.notes.filter((n) => n.folderId !== folderId)
    persist({ ...library, notes: [...other, ...updated] })
  }, [library, persist])

  const folders = library.folders.sort((a, b) => a.order - b.order)

  return {
    folders,
    getNotesForFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    reorderFolders,
    createNote,
    updateNote,
    deleteNote,
    reorderNotes,
  }
}
