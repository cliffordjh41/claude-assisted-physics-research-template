
import { useCallback, useRef, useState } from "react"

export interface SortableItemData {
  id: string
  type?: string
  parentId?: string
  [key: string]: unknown
}

export interface UseSortableConfig<T extends SortableItemData = SortableItemData> {
  items: T[]
  onReorder: (items: T[]) => void
  direction?: "vertical" | "horizontal"
  group?: string
  maxChildren?: number
  allowedTypes?: string[]
  disabled?: boolean
}

export interface UseSortableReturn<T extends SortableItemData = SortableItemData> {
  items: T[]
  draggingId: string | null
  dropTargetId: string | null
  getDragProps: (id: string) => DragProps
  getDropProps: (containerId?: string) => DropProps
  isDragging: (id: string) => boolean
  isDropTarget: (id: string) => boolean
  moveItem: (fromIndex: number, toIndex: number) => void
}

export interface DragProps {
  draggable: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  "data-sortable-id": string
}

export interface DropProps {
  onDragOver: (e: React.DragEvent) => void
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  "data-sortable-container": string
}

/** Native sortable hook -- HTML5 drag-and-drop, no external dependencies */
export function useSortable<T extends SortableItemData = SortableItemData>(
  config: UseSortableConfig<T>
): UseSortableReturn<T> {
  const {
    items,
    onReorder,
    direction = "vertical",
    group,
    maxChildren,
    allowedTypes,
    disabled = false,
  } = config

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const dragDataRef = useRef<{ id: string; type?: string; group?: string } | null>(null)

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return
      if (fromIndex < 0 || toIndex < 0) return
      if (fromIndex >= items.length || toIndex >= items.length) return

      const newItems = [...items]
      const [removed] = newItems.splice(fromIndex, 1)
      newItems.splice(toIndex, 0, removed)
      onReorder(newItems)
    },
    [items, onReorder]
  )

  const canDrop = useCallback(
    (itemType?: string): boolean => {
      if (maxChildren !== undefined && items.length >= maxChildren) {
        return false
      }
      if (allowedTypes && itemType && !allowedTypes.includes(itemType)) {
        return false
      }
      return true
    },
    [items.length, maxChildren, allowedTypes]
  )

  const getDragProps = useCallback(
    (id: string): DragProps => {
      const item = items.find((i) => i.id === id)

      return {
        draggable: !disabled,
        onDragStart: (e: React.DragEvent) => {
          if (disabled) {
            e.preventDefault()
            return
          }

          dragDataRef.current = {
            id,
            type: item?.type,
            group,
          }

          e.dataTransfer.effectAllowed = "move"
          e.dataTransfer.setData(
            "application/json",
            JSON.stringify(dragDataRef.current)
          )

          setDraggingId(id)
        },
        onDragEnd: () => {
          setDraggingId(null)
          setDropTargetId(null)
          dragDataRef.current = null
        },
        "data-sortable-id": id,
      }
    },
    [items, disabled, group]
  )

  const getDropProps = useCallback(
    (containerId?: string): DropProps => {
      return {
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault()

          const dragData = dragDataRef.current
          if (!dragData) return

          if (group && dragData.group !== group) return

          if (!canDrop(dragData.type)) {
            e.dataTransfer.dropEffect = "none"
            return
          }

          e.dataTransfer.dropEffect = "move"

          const target = e.target as HTMLElement
          const sortableElement = target.closest("[data-sortable-id]") as HTMLElement

          if (sortableElement) {
            const targetId = sortableElement.dataset.sortableId
            if (targetId && targetId !== draggingId) {
              setDropTargetId(targetId)
            }
          }
        },
        onDragEnter: (e: React.DragEvent) => {
          e.preventDefault()
        },
        onDragLeave: (e: React.DragEvent) => {
          const relatedTarget = e.relatedTarget as HTMLElement
          const currentTarget = e.currentTarget as HTMLElement

          if (!currentTarget.contains(relatedTarget)) {
            setDropTargetId(null)
          }
        },
        onDrop: (e: React.DragEvent) => {
          e.preventDefault()

          const dragData = dragDataRef.current
          if (!dragData) return

          if (group && dragData.group !== group) return
          if (!canDrop(dragData.type)) return

          const target = e.target as HTMLElement
          const sortableElement = target.closest("[data-sortable-id]") as HTMLElement

          if (sortableElement) {
            const targetId = sortableElement.dataset.sortableId
            if (targetId && targetId !== dragData.id) {
              const fromIndex = items.findIndex((i) => i.id === dragData.id)
              const toIndex = items.findIndex((i) => i.id === targetId)

              if (fromIndex !== -1 && toIndex !== -1) {
                const rect = sortableElement.getBoundingClientRect()
                const midpoint = direction === "vertical"
                  ? rect.top + rect.height / 2
                  : rect.left + rect.width / 2
                const mousePos = direction === "vertical" ? e.clientY : e.clientX

                const insertAfter = mousePos > midpoint
                const adjustedToIndex = insertAfter ? toIndex + 1 : toIndex
                const finalToIndex = fromIndex < adjustedToIndex
                  ? adjustedToIndex - 1
                  : adjustedToIndex

                moveItem(fromIndex, finalToIndex)
              }
            }
          }

          setDraggingId(null)
          setDropTargetId(null)
          dragDataRef.current = null
        },
        "data-sortable-container": containerId || "root",
      }
    },
    [items, group, canDrop, draggingId, direction, moveItem]
  )

  const isDragging = useCallback(
    (id: string): boolean => draggingId === id,
    [draggingId]
  )

  const isDropTarget = useCallback(
    (id: string): boolean => dropTargetId === id,
    [dropTargetId]
  )

  return {
    items,
    draggingId,
    dropTargetId,
    getDragProps,
    getDropProps,
    isDragging,
    isDropTarget,
    moveItem,
  }
}
