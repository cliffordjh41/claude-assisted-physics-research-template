
import { useState, useCallback } from "react"

export interface LinkItem {
  id: string
  folderId: string
  title: string
  url: string
  thumbnail?: string
  order: number
}

export interface LinkFolder {
  id: string
  name: string
  order: number
}

interface LinksLibrary {
  folders: LinkFolder[]
  links: LinkItem[]
}

const STORAGE_KEY = "thrifty-links"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function load(): LinksLibrary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as LinksLibrary
  } catch { /* ignore */ }
  return { folders: [], links: [] }
}

function save(lib: LinksLibrary): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lib))
}

function getThumbnail(url: string): string | undefined {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/
  )
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://vumbnail.com/${vimeoMatch[1]}.jpg`

  // Favicon fallback
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return undefined
  }
}

export function isVideoUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be|vimeo\.com)/.test(url)
}

export function useLinks() {
  const [library, setLibrary] = useState<LinksLibrary>(() => {
    const data = load()
    if (data.folders.length === 0) {
      const seed: LinksLibrary = {
        folders: [{ id: generateId(), name: "Bookmarks", order: 0 }],
        links: [],
      }
      save(seed)
      return seed
    }
    return data
  })

  const persist = useCallback((next: LinksLibrary) => {
    save(next)
    setLibrary(next)
  }, [])

  // Folders
  const createFolder = useCallback((name: string) => {
    const folder: LinkFolder = { id: generateId(), name, order: library.folders.length }
    persist({ ...library, folders: [...library.folders, folder] })
  }, [library, persist])

  const updateFolder = useCallback((id: string, updates: Partial<LinkFolder>) => {
    const folders = library.folders.map((f) => (f.id === id ? { ...f, ...updates } : f))
    persist({ ...library, folders })
  }, [library, persist])

  const deleteFolder = useCallback((id: string) => {
    persist({
      folders: library.folders.filter((f) => f.id !== id),
      links: library.links.filter((l) => l.folderId !== id),
    })
  }, [library, persist])

  const reorderFolders = useCallback((reordered: LinkFolder[]) => {
    const folders = reordered.map((f, i) => ({ ...f, order: i }))
    persist({ ...library, folders })
  }, [library, persist])

  // Links
  const getLinksForFolder = useCallback((folderId: string): LinkItem[] => {
    return library.links
      .filter((l) => l.folderId === folderId)
      .sort((a, b) => a.order - b.order)
  }, [library.links])

  const addLink = useCallback((folderId: string, title: string, url: string) => {
    const folderLinks = library.links.filter((l) => l.folderId === folderId)
    const link: LinkItem = {
      id: generateId(),
      folderId,
      title,
      url,
      thumbnail: getThumbnail(url),
      order: folderLinks.length,
    }
    persist({ ...library, links: [...library.links, link] })
  }, [library, persist])

  const updateLink = useCallback((linkId: string, updates: Partial<LinkItem>) => {
    const links = library.links.map((l) => (l.id === linkId ? { ...l, ...updates } : l))
    persist({ ...library, links })
  }, [library, persist])

  const deleteLink = useCallback((linkId: string) => {
    persist({ ...library, links: library.links.filter((l) => l.id !== linkId) })
  }, [library, persist])

  const reorderLinks = useCallback((folderId: string, reordered: LinkItem[]) => {
    const updated = reordered.map((l, i) => ({ ...l, order: i }))
    const other = library.links.filter((l) => l.folderId !== folderId)
    persist({ ...library, links: [...other, ...updated] })
  }, [library, persist])

  const addFromClipboard = useCallback(async (folderId: string): Promise<boolean> => {
    try {
      const text = await navigator.clipboard.readText()
      const trimmed = text.trim()
      if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        return false
      }
      let title: string
      try {
        title = new URL(trimmed).hostname.replace("www.", "")
      } catch {
        title = trimmed.slice(0, 40)
      }
      addLink(folderId, title, trimmed)
      return true
    } catch {
      return false
    }
  }, [addLink])

  const folders = library.folders.sort((a, b) => a.order - b.order)

  return {
    folders,
    getLinksForFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    reorderFolders,
    addLink,
    addFromClipboard,
    updateLink,
    deleteLink,
    reorderLinks,
  }
}
