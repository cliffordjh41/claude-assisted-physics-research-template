import type { LucideIcon } from 'lucide-react'

import { SigilArc } from './SigilArc'
import { SigilCross } from './SigilCross'
import { SigilEye } from './SigilEye'
import { SigilDelta } from './SigilDelta'
import { SigilWave } from './SigilWave'

export { SigilArc, SigilCross, SigilEye, SigilDelta, SigilWave }

export const SIGILS: { id: string; name: string; Icon: LucideIcon }[] = [
  { id: 'arc',   name: 'Arc',   Icon: SigilArc   },
  { id: 'cross', name: 'Cross', Icon: SigilCross },
  { id: 'eye',   name: 'Eye',   Icon: SigilEye   },
  { id: 'delta', name: 'Delta', Icon: SigilDelta },
  { id: 'wave',  name: 'Wave',  Icon: SigilWave  },
]
