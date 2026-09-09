
import { useState, useCallback, useMemo, useRef } from "react"

// ── Config types ──────────────────────────────────────────────

export interface MusicConfigTrack {
  id: string
  title: string
  url: string
}

export interface MusicConfigPlaylist {
  id: string
  name: string
  tracks: MusicConfigTrack[]
}

export interface MusicConfig {
  playlists: MusicConfigPlaylist[]
}

// ── Internal helpers ──────────────────────────────────────────
import { Button } from "../ui/button"
import { VisualizerTiles } from "../ui/visualizer-tiles"
import { SlidingPanels, SlidingPanel } from "../ui/sliding-panels"
import { Sortable, SortableItem, SortableHandle } from "../ui/sortable"
import { useAudioPlayer } from "../../hooks/use-audio-player"
import { usePanelChrome } from "../../hooks/use-panel-chrome"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  ListMusic,
  Plus,
  GripVertical,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react"
import { cx } from "../../lib/utils"
import type { PanelProps } from "../../types/panel"

// ── Public props ──────────────────────────────────────────────

export interface MusicPlayerPanelProps extends PanelProps {
  // panelData is the playlist source (cast to MusicConfig internally). The
  // panel is controlled: it renders that data and reports edits through the
  // optional callbacks below; omit the callbacks for a read-only player.
  /** Enables the add-track (file picker) affordance. */
  onAddTrack?: (playlistId: string, title: string, url: string) => void
  /** Enables the remove-track affordance. */
  onRemoveTrack?: (playlistId: string, trackId: string) => void
  /** Enables drag-reordering tracks within a playlist. */
  onReorderTracks?: (playlistId: string, tracks: MusicConfigTrack[]) => void
  /** Enables the create-playlist affordance. */
  onCreatePlaylist?: (name: string) => void
  /** Enables renaming a playlist. */
  onRenamePlaylist?: (playlistId: string, name: string) => void
  /** Enables deleting a playlist. */
  onDeletePlaylist?: (playlistId: string) => void
  /** Enables drag-reordering playlists. */
  onReorderPlaylists?: (playlists: MusicConfigPlaylist[]) => void
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

// --- Expandable playlist card with nested sortable tracks ---
// Every affordance is presence-driven: a control renders only when its
// callback prop is supplied. With none supplied the card is read-only.

interface ExpandablePlaylistCardProps {
  playlist: MusicConfigPlaylist
  currentTrackId?: string | null
  reorderablePlaylists?: boolean
  onRenamePlaylist?: (id: string, name: string) => void
  onDeletePlaylist?: (id: string) => void
  onAddTrack?: (playlistId: string, title: string, url: string) => void
  onRemoveTrack?: (playlistId: string, trackId: string) => void
  onReorderTracks?: (playlistId: string, tracks: MusicConfigTrack[]) => void
  onPlayTrack?: (track: MusicConfigTrack) => void
  isPlaying?: boolean
}

function ExpandablePlaylistCard({
  playlist,
  currentTrackId,
  reorderablePlaylists,
  onRenamePlaylist,
  onDeletePlaylist,
  onAddTrack,
  onRemoveTrack,
  onReorderTracks,
  onPlayTrack,
  isPlaying,
}: ExpandablePlaylistCardProps) {
  const tracks = playlist.tracks
  const [expanded, setExpanded] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(playlist.name)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleStartEditing = () => {
    if (!onRenamePlaylist) return
    setIsEditingName(true)
    setEditedName(playlist.name)
    setTimeout(() => nameInputRef.current?.focus(), 0)
  }

  const handleSaveName = () => {
    setIsEditingName(false)
    if (editedName.trim() && editedName !== playlist.name) {
      onRenamePlaylist?.(playlist.id, editedName.trim())
    } else {
      setEditedName(playlist.name)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const title = file.name.replace(/\.[^/.]+$/, "")
    const url = URL.createObjectURL(file)
    onAddTrack?.(playlist.id, title, url)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (!expanded) setExpanded(true)
  }

  const handleReorder = (items: { id: string }[]) => {
    const reordered = items.map((item) => tracks.find((t) => t.id === item.id)!)
    onReorderTracks?.(playlist.id, reordered)
  }

  const trackRow = (track: MusicConfigTrack) => (
    <div
      className={cx(
        "flex items-stretch border rounded-md overflow-hidden cursor-pointer transition-colors",
        track.id === currentTrackId
          ? "border-action bg-action/5"
          : "border-line bg-mute/30 hover:bg-highlight/50"
      )}
      onClick={() => onPlayTrack?.(track)}
    >
      {onReorderTracks && (
        <SortableHandle
          id={track.id}
          className="px-1.5 py-1 flex items-center border-r border-line text-mute-fg"
        >
          <GripVertical className="size-2.5" />
        </SortableHandle>
      )}
      <div className="flex-1 min-w-0 px-2 py-1 flex items-center gap-1.5">
        {track.id === currentTrackId && isPlaying && (
          <Music className="size-2.5 text-action shrink-0" />
        )}
        <span className="text-[10px] truncate text-foreground">{track.title}</span>
      </div>
      {onRemoveTrack && (
        <Button
          variant="ghost"
          size="icon"
          className="size-5 self-center mr-0.5 text-mute-fg hover:text-alert"
          onClick={(e) => {
            e.stopPropagation()
            onRemoveTrack(playlist.id, track.id)
          }}
        >
          <X className="size-2.5" />
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-1">
      {onAddTrack && (
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      )}

      {/* Playlist card */}
      <div className="flex items-stretch bg-surface border rounded-md overflow-hidden hover:bg-highlight/50 transition-colors">
        {reorderablePlaylists && (
          <SortableHandle
            id={playlist.id}
            className="px-2 py-1.5 flex items-center justify-center border-r border-line text-mute-fg"
          >
            <GripVertical className="size-3" />
          </SortableHandle>
        )}

        <button
          className="px-1.5 flex items-center hover:bg-highlight"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
        </button>

        {/* Name — click to edit when renaming is enabled */}
        <div
          className={cx(
            "flex-1 min-w-0 px-2 py-1.5 flex items-center gap-1.5",
            onRenamePlaylist && "cursor-text"
          )}
          onClick={handleStartEditing}
        >
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName()
                if (e.key === "Escape") { setIsEditingName(false); setEditedName(playlist.name) }
              }}
              className="flex-1 bg-transparent border-b border-foreground text-[11px] font-(--theme-font-weight) outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-[11px] font-(--theme-font-weight) truncate text-foreground">{playlist.name}</span>
          )}
          <span className="text-[9px] text-mute-fg shrink-0">{tracks.length}</span>
        </div>

        {(onAddTrack || onDeletePlaylist) && (
          <div className="flex items-center gap-0.5 px-1">
            {onAddTrack && (
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="size-3" />
              </Button>
            )}
            {onDeletePlaylist && (
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-mute-fg hover:text-alert"
                onClick={() => onDeletePlaylist(playlist.id)}
              >
                <Trash2 className="size-2.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Expanded tracks */}
      {expanded && (
        <div className="ml-6 space-y-1">
          {tracks.length === 0 ? (
            <p className="text-[9px] text-mute-fg text-center py-2">No tracks</p>
          ) : onReorderTracks ? (
            <Sortable
              items={tracks.map((t) => ({ id: t.id }))}
              onReorder={handleReorder}
              direction="vertical"
              className="space-y-1"
            >
              {tracks.map((track) => (
                <SortableItem key={track.id} id={track.id} handle>
                  {trackRow(track)}
                </SortableItem>
              ))}
            </Sortable>
          ) : (
            tracks.map((track) => <div key={track.id}>{trackRow(track)}</div>)
          )}
        </div>
      )}
    </div>
  )
}

// --- Main component ---

export function MusicPlayerPanel({
  onFooter,
  panelData,
  onAddTrack,
  onRemoveTrack,
  onReorderTracks,
  onCreatePlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
  onReorderPlaylists,
}: MusicPlayerPanelProps) {
  const [panelIndex, setPanelIndex] = useState(0)
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null)
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // panelData is the single source of truth. Manage affordances are
  // presence-driven: each renders only when its callback is supplied;
  // with none supplied the panel is a read-only player.
  const config = panelData as MusicConfig | undefined
  const playlists = config?.playlists ?? []
  const canManagePlaylists = Boolean(
    onCreatePlaylist || onRenamePlaylist || onDeletePlaylist || onReorderPlaylists
  )
  // The playlist-select drawer + its footer trigger only make sense when
  // there's more than one to pick from.
  const showPlaylistPicker = playlists.length > 1

  // Ensure active playlist is set
  const effectivePlaylistId = activePlaylistId ?? playlists[0]?.id ?? null
  const currentPlaylist = playlists.find((p) => p.id === effectivePlaylistId) ?? null
  const currentTracks = useMemo<MusicConfigTrack[]>(
    () => config?.playlists?.find((p) => p.id === effectivePlaylistId)?.tracks ?? [],
    [config, effectivePlaylistId]
  )

  // Current track
  const currentTrack = useMemo(
    () => currentTracks.find((t) => t.id === currentTrackId) ?? currentTracks[0] ?? null,
    [currentTracks, currentTrackId]
  )
  const currentSrc = currentTrack?.url ?? ""

  // Auto-advance to next track
  const handleEnded = useCallback(() => {
    if (!currentTrack || currentTracks.length === 0) return
    const idx = currentTracks.findIndex((t) => t.id === currentTrack.id)
    if (idx < currentTracks.length - 1) {
      setCurrentTrackId(currentTracks[idx + 1].id)
    }
  }, [currentTrack, currentTracks])

  // frequencyData is intentionally NOT pulled into snapshot consumption
  // here — VisualizerTiles self-subscribes via subscribeFrequency for
  // ref-based DOM mutation (no React rerender per frame).
  const { isPlaying, currentTime, duration, toggle, seek } =
    useAudioPlayer(currentSrc, { onEnded: handleEnded })

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const skipBack = useCallback(() => {
    if (!currentTrack || currentTracks.length === 0) return
    const idx = currentTracks.findIndex((t) => t.id === currentTrack.id)
    if (idx > 0) {
      setCurrentTrackId(currentTracks[idx - 1].id)
    } else {
      seek(0)
    }
  }, [currentTrack, currentTracks, seek])

  const skipForward = useCallback(() => {
    if (!currentTrack || currentTracks.length === 0) return
    const idx = currentTracks.findIndex((t) => t.id === currentTrack.id)
    if (idx < currentTracks.length - 1) {
      setCurrentTrackId(currentTracks[idx + 1].id)
    }
  }, [currentTrack, currentTracks])

  const playTrack = useCallback((track: { id: string }) => {
    setCurrentTrackId(track.id)
  }, [])

  const handleReorderCurrentTracks = (items: { id: string }[]) => {
    if (!effectivePlaylistId || !onReorderTracks) return
    const reordered = items.map((item) => currentTracks.find((t) => t.id === item.id)!)
    onReorderTracks(effectivePlaylistId, reordered)
  }

  const handleReorderPlaylists = (items: { id: string }[]) => {
    if (!onReorderPlaylists) return
    const reordered = items.map((item) => playlists.find((p) => p.id === item.id)!)
    onReorderPlaylists(reordered)
  }

  const handleSelectPlaylist = (id: string) => {
    setActivePlaylistId(id)
    setDrawerOpen(false)
  }

  const footer = useMemo(
    () => (
      <>
        {showPlaylistPicker && (
          <button
            onClick={() => { if (panelIndex === 0) setDrawerOpen(!drawerOpen) }}
            className={cx(
              "flex-1 py-3 px-3 flex items-center justify-between transition-colors",
              drawerOpen
                ? "bg-foreground text-background"
                : "text-mute-fg hover:text-foreground hover:bg-mute/50"
            )}
          >
            <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) truncate text-foreground">
              {currentPlaylist?.name ?? "No Playlist"}
            </span>
            <ChevronUp
              className={cx(
                "size-3 shrink-0 transition-transform duration-200",
                drawerOpen && "rotate-180"
              )}
            />
          </button>
        )}
        {canManagePlaylists && (
          <button
            onClick={() => { setDrawerOpen(false); setPanelIndex(panelIndex === 1 ? 0 : 1) }}
            className={cx(
              "px-2.5 py-3 border-l border-line transition-colors",
              panelIndex === 1
                ? "bg-foreground text-background"
                : "text-mute-fg hover:text-foreground hover:bg-mute/50"
            )}
          >
            {panelIndex === 1 ? <ChevronLeft className="size-3.5" /> : <ListMusic className="size-3.5" />}
          </button>
        )}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panelIndex, drawerOpen, currentPlaylist?.name, showPlaylistPicker, canManagePlaylists]
  )

  const { footer: footerEl } = usePanelChrome({ onFooter, footer })

  // Playlist management body — rendered only when canManagePlaylists
  const playlistManagement = (
    <>
      <div className="shrink-0 h-11 px-3 border-b border-line flex items-center justify-between">
        <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">Playlists</span>
        {onCreatePlaylist && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => onCreatePlaylist(`Playlist ${playlists.length + 1}`)}
          >
            <Plus className="size-3" />
          </Button>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
        {playlists.length > 0 ? (
          <Sortable
            items={playlists.map((p) => ({ id: p.id }))}
            onReorder={handleReorderPlaylists}
            direction="vertical"
            className="space-y-1.5"
          >
            {playlists.map((pl) => (
              <SortableItem key={pl.id} id={pl.id} handle>
                <ExpandablePlaylistCard
                  playlist={pl}
                  currentTrackId={currentTrack?.id}
                  reorderablePlaylists={Boolean(onReorderPlaylists)}
                  onRenamePlaylist={onRenamePlaylist}
                  onDeletePlaylist={onDeletePlaylist}
                  onAddTrack={onAddTrack}
                  onRemoveTrack={onRemoveTrack}
                  onReorderTracks={onReorderTracks}
                  onPlayTrack={playTrack}
                  isPlaying={isPlaying}
                />
              </SortableItem>
            ))}
          </Sortable>
        ) : (
          <p className="text-[9px] text-mute-fg text-center py-4">No playlists</p>
        )}
      </div>
    </>
  )

  const playerTrackRow = (track: MusicConfigTrack) => (
    <div
      className={cx(
        "flex items-stretch border rounded-md overflow-hidden cursor-pointer transition-colors",
        track.id === currentTrack?.id
          ? "border-action bg-action/5"
          : "border-line bg-surface hover:bg-highlight/50"
      )}
      onClick={() => playTrack(track)}
    >
      {onReorderTracks && (
        <SortableHandle
          id={track.id}
          className="px-1.5 py-1.5 flex items-center border-r border-line text-mute-fg"
        >
          <GripVertical className="size-2.5" />
        </SortableHandle>
      )}
      <div className="flex-1 min-w-0 px-2 py-1.5 flex items-center gap-1.5">
        {track.id === currentTrack?.id && isPlaying && (
          <Music className="size-2.5 text-action shrink-0" />
        )}
        <span className="text-[10px] font-(--theme-font-weight) truncate text-foreground">{track.title}</span>
      </div>
      {onRemoveTrack && effectivePlaylistId && (
        <Button
          variant="ghost"
          size="icon"
          className="size-5 self-center mr-0.5 text-mute-fg hover:text-alert"
          onClick={(e) => {
            e.stopPropagation()
            onRemoveTrack(effectivePlaylistId, track.id)
          }}
        >
          <X className="size-2.5" />
        </Button>
      )}
    </div>
  )

  // Player body
  const playerBody = (
    <div className="flex flex-col h-full relative">
      {/* Player — top section */}
      <div className="shrink-0">
        {/* Visualizer */}
        <div className="px-3 pt-3 pb-1">
          <VisualizerTiles
            isPlaying={isPlaying}
            className="h-48 w-full"
          />
        </div>

        {/* Progress bar */}
        <div className="px-3 py-1.5 space-y-0.5">
          <div
            className="h-1 w-full rounded-full bg-mute cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              seek(pct * duration)
            }}
          >
            <div
              className="h-full rounded-full bg-action transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-mute-fg">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 py-1">
          <Button variant="ghost" size="sm" className="size-7 p-0" onClick={skipBack} aria-label="Previous track">
            <SkipBack className="size-3.5" />
          </Button>
          <Button size="sm" className="size-9 rounded-full p-0" onClick={toggle} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="sm" className="size-7 p-0" onClick={skipForward} aria-label="Next track">
            <SkipForward className="size-3.5" />
          </Button>
        </div>

        {/* Track info */}
        <div className="px-3 py-1.5 text-center">
          <div className="text-xs font-(--theme-font-weight) truncate text-foreground">
            {currentTrack?.title ?? "No Track"}
          </div>
          <div className="text-[9px] text-mute-fg">
            {isPlaying ? "Now Playing" : "Paused"}
          </div>
        </div>
      </div>

      {/* Track list — bottom, scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
        {currentTracks.length === 0 ? (
          <p className="text-[9px] text-mute-fg text-center py-4">No tracks yet</p>
        ) : onReorderTracks ? (
          <Sortable
            items={currentTracks.map((t) => ({ id: t.id }))}
            onReorder={handleReorderCurrentTracks}
            direction="vertical"
            className="space-y-1"
          >
            {currentTracks.map((track) => (
              <SortableItem key={track.id} id={track.id} handle>
                {playerTrackRow(track)}
              </SortableItem>
            ))}
          </Sortable>
        ) : (
          <div className="space-y-1">
            {currentTracks.map((track) => (
              <div key={track.id}>{playerTrackRow(track)}</div>
            ))}
          </div>
        )}
      </div>

      {/* Playlist drawer — slides up over content. Only rendered when
          there's more than one playlist to pick from. */}
      {showPlaylistPicker && (
        <div
          className={cx(
            "absolute left-0 right-0 bottom-0 bg-background border-t border-line transition-transform duration-200 ease-out overflow-y-auto",
            drawerOpen ? "translate-y-0" : "translate-y-full"
          )}
          style={{ maxHeight: "60%" }}
        >
          {playlists.map((pl) => (
            <button
              key={pl.id}
              className={cx(
                "w-full px-4 py-2 text-left text-[10px] font-(--theme-font-weight) hover:bg-mute/50 transition-colors truncate text-foreground",
                pl.id === effectivePlaylistId && "bg-mute"
              )}
              onClick={() => handleSelectPlaylist(pl.id)}
            >
              {pl.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <SlidingPanels activeIndex={panelIndex} onIndexChange={setPanelIndex} className="flex-1 min-h-0">
        <SlidingPanel>{playerBody}</SlidingPanel>
        {canManagePlaylists && <SlidingPanel>{playlistManagement}</SlidingPanel>}
      </SlidingPanels>
      {footerEl}
    </div>
  )
}
