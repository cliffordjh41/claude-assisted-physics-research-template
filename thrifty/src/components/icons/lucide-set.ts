import type { LucideIcon } from 'lucide-react'
import {
  // Navigation
  Home, Menu, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Search, Filter,
  // Identity
  User, Users, LogIn, LogOut, Lock, Key, Bell, Star,
  // Actions
  Plus, Minus, X, Check, Pencil, Trash2, Download, Upload,
  // Communication
  Mail, MessageSquare, Phone, Send, Globe, Link2, Share2, Bookmark,
  // Media
  Image, Camera, Video, Music, Mic, File, FileText, Folder,
  // Data / UI
  BarChart2, LayoutGrid, List, Settings, CalendarDays, Clock, CreditCard, Zap,
} from 'lucide-react'

export const LUCIDE_ICON_SET: { id: string; name: string; Icon: LucideIcon }[] = [
  // Navigation
  { id: 'l-home',         name: 'Home',         Icon: Home         },
  { id: 'l-menu',         name: 'Menu',         Icon: Menu         },
  { id: 'l-chevron-left', name: 'ChevLeft',     Icon: ChevronLeft  },
  { id: 'l-chevron-right',name: 'ChevRight',    Icon: ChevronRight },
  { id: 'l-arrow-left',   name: 'ArrowLeft',    Icon: ArrowLeft    },
  { id: 'l-arrow-right',  name: 'ArrowRight',   Icon: ArrowRight   },
  { id: 'l-search',       name: 'Search',       Icon: Search       },
  { id: 'l-filter',       name: 'Filter',       Icon: Filter       },
  // Identity
  { id: 'l-user',         name: 'User',         Icon: User         },
  { id: 'l-users',        name: 'Users',        Icon: Users        },
  { id: 'l-log-in',       name: 'LogIn',        Icon: LogIn        },
  { id: 'l-log-out',      name: 'LogOut',       Icon: LogOut       },
  { id: 'l-lock',         name: 'Lock',         Icon: Lock         },
  { id: 'l-key',          name: 'Key',          Icon: Key          },
  { id: 'l-bell',         name: 'Bell',         Icon: Bell         },
  { id: 'l-star',         name: 'Star',         Icon: Star         },
  // Actions
  { id: 'l-plus',         name: 'Plus',         Icon: Plus         },
  { id: 'l-minus',        name: 'Minus',        Icon: Minus        },
  { id: 'l-x',            name: 'X',            Icon: X            },
  { id: 'l-check',        name: 'Check',        Icon: Check        },
  { id: 'l-pencil',       name: 'Pencil',       Icon: Pencil       },
  { id: 'l-trash',        name: 'Trash',        Icon: Trash2       },
  { id: 'l-download',     name: 'Download',     Icon: Download     },
  { id: 'l-upload',       name: 'Upload',       Icon: Upload       },
  // Communication
  { id: 'l-mail',         name: 'Mail',         Icon: Mail         },
  { id: 'l-message',      name: 'Message',      Icon: MessageSquare},
  { id: 'l-phone',        name: 'Phone',        Icon: Phone        },
  { id: 'l-send',         name: 'Send',         Icon: Send         },
  { id: 'l-globe',        name: 'Globe',        Icon: Globe        },
  { id: 'l-link',         name: 'Link',         Icon: Link2        },
  { id: 'l-share',        name: 'Share',        Icon: Share2       },
  { id: 'l-bookmark',     name: 'Bookmark',     Icon: Bookmark     },
  // Media
  { id: 'l-image',        name: 'Image',        Icon: Image        },
  { id: 'l-camera',       name: 'Camera',       Icon: Camera       },
  { id: 'l-video',        name: 'Video',        Icon: Video        },
  { id: 'l-music',        name: 'Music',        Icon: Music        },
  { id: 'l-mic',          name: 'Mic',          Icon: Mic          },
  { id: 'l-file',         name: 'File',         Icon: File         },
  { id: 'l-file-text',    name: 'FileText',     Icon: FileText     },
  { id: 'l-folder',       name: 'Folder',       Icon: Folder       },
  // Data / UI
  { id: 'l-bar-chart',    name: 'BarChart',     Icon: BarChart2    },
  { id: 'l-grid',         name: 'Grid',         Icon: LayoutGrid   },
  { id: 'l-list',         name: 'List',         Icon: List         },
  { id: 'l-settings',     name: 'Settings',     Icon: Settings     },
  { id: 'l-calendar',     name: 'Calendar',     Icon: CalendarDays },
  { id: 'l-clock',        name: 'Clock',        Icon: Clock        },
  { id: 'l-credit-surface',  name: 'CreditCard',   Icon: CreditCard   },
  { id: 'l-zap',          name: 'Zap',          Icon: Zap          },
]
