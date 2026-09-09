
export const meta = { id: "video", label: "Video", tier: "content" as const, placement: "any" as const }

import { useEffect } from "react"
import { CheckboxItem } from "../panel-primitives"
import { Plus, X } from "lucide-react"
import type { PanelProps } from "../../types/panel"

interface VideoItem {
  id: string
  title: string
  url: string
  poster: string
}

export interface VideoConfig {
  videos: VideoItem[]
  autoplay: boolean
  loop: boolean
  showControls: boolean
}

export const defaultConfig: VideoConfig = {
  videos: [
    {
      id: "bbb",
      title: "Big Buck Bunny",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    },
    {
      id: "elephants-dream",
      title: "Elephants Dream",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    },
    {
      id: "sintel",
      title: "Sintel",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    },
    {
      id: "tears-of-steel",
      title: "Tears of Steel",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    },
  ],
  autoplay: false,
  loop: false,
  showControls: true,
}

export function VideoConfigSurface({
  config,
  onChange,
}: {
  config: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  const typed = config as unknown as VideoConfig
  const videos = typed.videos ?? defaultConfig.videos

  function update(next: VideoConfig) {
    onChange(next as unknown as Record<string, unknown>)
  }

  function updateVideo(id: string, field: keyof VideoItem, value: string) {
    update({ ...typed, videos: videos.map(v => v.id === id ? { ...v, [field]: value } : v) })
  }

  function addVideo() {
    update({ ...typed, videos: [...videos, { id: `video-${Date.now()}`, title: "", url: "", poster: "" }] })
  }

  function removeVideo(id: string) {
    update({ ...typed, videos: videos.filter(v => v.id !== id) })
  }

  function setToggle(field: "autoplay" | "loop" | "showControls", value: boolean) {
    update({ ...typed, [field]: value })
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <CheckboxItem
          label="Autoplay"
          checked={typed.autoplay ?? defaultConfig.autoplay}
          onCheckedChange={v => setToggle("autoplay", v as boolean)}
        />
        <CheckboxItem
          label="Loop"
          checked={typed.loop ?? defaultConfig.loop}
          onCheckedChange={v => setToggle("loop", v as boolean)}
        />
        <CheckboxItem
          label="Show Controls"
          checked={typed.showControls ?? defaultConfig.showControls}
          onCheckedChange={v => setToggle("showControls", v as boolean)}
        />
      </div>
      <div className="border-t border-line/50" />
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50">Videos</p>
        <button
          onClick={addVideo}
          className="flex items-center gap-1 text-[9px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/50 hover:text-foreground transition-colors"
        >
          <Plus className="size-2.5" />Add
        </button>
      </div>
      {videos.map(v => (
        <div key={v.id} className="space-y-1 group">
          <div className="flex items-center gap-1.5">
            <input
              value={v.title}
              onChange={e => updateVideo(v.id, "title", e.target.value)}
              placeholder="Title (optional)"
              className="flex-1 bg-transparent text-[10px] text-foreground border-b border-line focus:border-foreground outline-none py-0.5"
            />
            <button
              onClick={() => removeVideo(v.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-mute-fg/50 hover:text-foreground shrink-0"
            >
              <X className="size-2.5" />
            </button>
          </div>
          <input
            value={v.url}
            onChange={e => updateVideo(v.id, "url", e.target.value)}
            placeholder="Video URL"
            className="w-full bg-transparent text-[10px] text-mute-fg border-b border-line/50 focus:border-foreground outline-none py-0.5"
          />
          <input
            value={v.poster}
            onChange={e => updateVideo(v.id, "poster", e.target.value)}
            placeholder="Poster URL (optional)"
            className="w-full bg-transparent text-[9px] text-mute-fg/60 border-b border-line/30 focus:border-foreground outline-none py-0.5"
          />
        </div>
      ))}
    </div>
  )
}

export function VideoPanel({ onFooter, panelData }: PanelProps) {
  const config = (panelData as unknown as VideoConfig | undefined) ?? defaultConfig
  const videos = config.videos

  useEffect(() => {
    onFooter?.(
      <div className="flex items-stretch flex-1">
        <span className="flex-1 flex items-center px-3 text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </span>
      </div>
    )
    return () => onFooter?.(null)
  }, [onFooter, videos.length])

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        {videos.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-[10px] font-(--theme-font-weight) uppercase tracking-(--theme-letter-spacing) text-mute-fg/30">
              No Videos
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-3">
            {videos.map(v => (
              <div key={v.id} className="aspect-video bg-black overflow-hidden">
                <video
                  src={v.url}
                  poster={v.poster || undefined}
                  autoPlay={config.autoplay}
                  loop={config.loop}
                  controls={config.showControls}
                  muted={config.autoplay}
                  className="w-full h-full object-cover"
                  playsInline
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
