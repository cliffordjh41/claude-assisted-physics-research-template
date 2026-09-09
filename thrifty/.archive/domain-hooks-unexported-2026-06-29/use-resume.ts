
import { useState, useCallback } from "react"

// --- Types ---

export type BlockType = "contact" | "summary" | "work" | "education" | "skill" | "certification" | "language" | "reference"

export type BlockContent =
  | ContactContent
  | SummaryContent
  | WorkContent
  | EducationContent
  | SkillContent
  | CertificationContent
  | LanguageContent
  | ReferenceContent

export interface ContactContent {
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
}

export interface SummaryContent {
  text: string
}

export interface WorkContent {
  company: string
  title: string
  startDate: string
  endDate: string
  current: boolean
  duties: string[]
}

export interface EducationContent {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export interface SkillContent {
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface CertificationContent {
  name: string
  issuer: string
  issueDate: string
  expiryDate: string | null
  credentialId: string
  url: string
}

export interface LanguageContent {
  name: string
  proficiency: "basic" | "conversational" | "professional" | "native"
}

export interface ReferenceContent {
  name: string
  title: string
  company: string
  email: string
  phone: string
  relationship: string
}

export interface ResumeBlock {
  id: string
  type: BlockType
  content: BlockContent
  order: number
}

// --- Limits ---

const BLOCK_LIMITS: Record<BlockType, number> = {
  contact: 1,
  summary: 1,
  work: 10,
  education: 5,
  skill: 20,
  certification: 5,
  language: 10,
  reference: 5,
}

// --- Storage ---

const STORAGE_KEY = "thrifty-resume"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function migrate(blocks: ResumeBlock[]): ResumeBlock[] {
  return blocks.map((b) => {
    if (b.type === "work") {
      const c = b.content as any
      if (!c.duties && typeof c.description === "string") {
        const duties = c.description ? c.description.split(/\.\s+/).filter((s: string) => s.trim()) : []
        const { description: _, ...rest } = c
        return { ...b, content: { ...rest, duties } }
      }
    }
    return b
  })
}

function load(): ResumeBlock[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const blocks = JSON.parse(raw) as ResumeBlock[]
      const migrated = migrate(blocks)
      if (migrated !== blocks) save(migrated)
      return migrated
    }
  } catch { /* ignore */ }
  return []
}

function save(blocks: ResumeBlock[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks))
}

// --- Seed data ---

function createSeed(): ResumeBlock[] {
  const blocks: ResumeBlock[] = [
    {
      id: generateId(),
      type: "contact",
      content: {
        firstName: "Alex",
        lastName: "Morgan",
        email: "alex.morgan@email.com",
        phone: "(555) 123-4567",
        title: "Senior Software Engineer",
      } as ContactContent,
      order: 0,
    },
    {
      id: generateId(),
      type: "summary",
      content: {
        text: "Full-stack engineer with 8+ years building scalable web applications. Passionate about clean architecture, developer tooling, and design systems.",
      } as SummaryContent,
      order: 1,
    },
    {
      id: generateId(),
      type: "work",
      content: {
        company: "Acme Corp",
        title: "Senior Software Engineer",
        startDate: "2021",
        endDate: "",
        current: true,
        duties: [
          "Lead the design system team across 3 product verticals",
          "Built component library used by 40+ engineers",
          "Reduced bundle size by 35% through tree-shaking optimizations",
        ],
      } as WorkContent,
      order: 2,
    },
    {
      id: generateId(),
      type: "work",
      content: {
        company: "StartupXYZ",
        title: "Full Stack Developer",
        startDate: "2018",
        endDate: "2021",
        current: false,
        duties: [
          "Built real-time collaboration features using WebSockets",
          "Reduced page load time by 60% through code splitting",
          "Mentored 3 junior developers",
        ],
      } as WorkContent,
      order: 3,
    },
    {
      id: generateId(),
      type: "education",
      content: {
        institution: "State University",
        degree: "B.S.",
        field: "Computer Science",
        startDate: "2014",
        endDate: "2018",
      } as EducationContent,
      order: 4,
    },
    {
      id: generateId(),
      type: "skill",
      content: { name: "TypeScript", level: "expert" } as SkillContent,
      order: 5,
    },
    {
      id: generateId(),
      type: "skill",
      content: { name: "React", level: "expert" } as SkillContent,
      order: 6,
    },
    {
      id: generateId(),
      type: "skill",
      content: { name: "Node.js", level: "advanced" } as SkillContent,
      order: 7,
    },
    {
      id: generateId(),
      type: "skill",
      content: { name: "PostgreSQL", level: "intermediate" } as SkillContent,
      order: 8,
    },
    {
      id: generateId(),
      type: "certification",
      content: {
        name: "AWS Solutions Architect",
        issuer: "Amazon",
        issueDate: "2023",
        expiryDate: "2026",
        credentialId: "ABC123",
        url: "",
      } as CertificationContent,
      order: 9,
    },
    {
      id: generateId(),
      type: "language",
      content: { name: "English", proficiency: "native" } as LanguageContent,
      order: 10,
    },
    {
      id: generateId(),
      type: "language",
      content: { name: "Spanish", proficiency: "conversational" } as LanguageContent,
      order: 11,
    },
  ]
  save(blocks)
  return blocks
}

// --- Hook ---

export function useResume() {
  const [blocks, setBlocks] = useState<ResumeBlock[]>(() => {
    const data = load()
    return data.length > 0 ? data : createSeed()
  })

  const persist = useCallback((next: ResumeBlock[]) => {
    save(next)
    setBlocks(next)
  }, [])

  const addBlock = useCallback((type: BlockType, content: BlockContent) => {
    const block: ResumeBlock = { id: generateId(), type, content, order: blocks.length }
    persist([...blocks, block])
  }, [blocks, persist])

  const updateBlock = useCallback((id: string, content: BlockContent) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, content } : b))
    persist(updated)
  }, [blocks, persist])

  const deleteBlock = useCallback((id: string) => {
    persist(blocks.filter((b) => b.id !== id))
  }, [blocks, persist])

  const reorderBlocks = useCallback((reordered: ResumeBlock[]) => {
    const updated = reordered.map((b, i) => ({ ...b, order: i }))
    persist(updated)
  }, [persist])

  const getBlocksByType = useCallback((type: BlockType): ResumeBlock[] => {
    return blocks.filter((b) => b.type === type).sort((a, b) => a.order - b.order)
  }, [blocks])

  const canAddBlock = useCallback((type: BlockType): boolean => {
    const count = blocks.filter((b) => b.type === type).length
    return count < BLOCK_LIMITS[type]
  }, [blocks])

  const getLimit = useCallback((type: BlockType): number => {
    return BLOCK_LIMITS[type]
  }, [])

  const addDuty = useCallback((blockId: string, text: string) => {
    const updated = blocks.map((b) => {
      if (b.id !== blockId || b.type !== "work") return b
      const content = b.content as WorkContent
      return { ...b, content: { ...content, duties: [...content.duties, text] } }
    })
    persist(updated)
  }, [blocks, persist])

  const updateDuty = useCallback((blockId: string, dutyIndex: number, text: string) => {
    const updated = blocks.map((b) => {
      if (b.id !== blockId || b.type !== "work") return b
      const content = b.content as WorkContent
      const duties = [...content.duties]
      duties[dutyIndex] = text
      return { ...b, content: { ...content, duties } }
    })
    persist(updated)
  }, [blocks, persist])

  const deleteDuty = useCallback((blockId: string, dutyIndex: number) => {
    const updated = blocks.map((b) => {
      if (b.id !== blockId || b.type !== "work") return b
      const content = b.content as WorkContent
      const duties = content.duties.filter((_, i) => i !== dutyIndex)
      return { ...b, content: { ...content, duties } }
    })
    persist(updated)
  }, [blocks, persist])

  const reorderDuties = useCallback((blockId: string, reordered: string[]) => {
    const updated = blocks.map((b) => {
      if (b.id !== blockId || b.type !== "work") return b
      return { ...b, content: { ...(b.content as WorkContent), duties: reordered } }
    })
    persist(updated)
  }, [blocks, persist])

  const exportJSON = useCallback(() => {
    const data = {
      exportedAt: new Date().toISOString(),
      blocks: blocks.sort((a, b) => a.order - b.order).map((b) => ({
        type: b.type,
        content: b.content,
      })),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [blocks])

  return { blocks, addBlock, updateBlock, deleteBlock, reorderBlocks, getBlocksByType, canAddBlock, getLimit, exportJSON, addDuty, updateDuty, deleteDuty, reorderDuties }
}
