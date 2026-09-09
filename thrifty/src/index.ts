// thrifty-ui — barrel export for the shared library package.
// Consumers import like: `import { Button, AppShell, useLoopIndex } from "thrifty-ui"`.
// CSS surface is at `thrifty-ui/styles.css` (the index.css alongside this file).

// ── Radix wrappers + base primitives ──────────────────────────

export { Button, buttonVariants } from "./components/ui/button"
export { Badge, badgeVariants } from "./components/ui/badge"
export { Input } from "./components/ui/input"
export { Textarea } from "./components/ui/textarea"
export { Label } from "./components/ui/label"
export { Checkbox } from "./components/ui/checkbox"
export { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group"
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet"

// ── Radix wrappers (continued) ────────────────────────────────

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./components/ui/tooltip"
export { VisuallyHidden } from "./components/ui/visually-hidden"
export { AccessibleIcon } from "./components/ui/accessible-icon"
export { Separator } from "./components/ui/separator"
export { Slider } from "./components/ui/slider"
export { Switch } from "./components/ui/switch"
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "./components/ui/popover"
export { Progress } from "./components/ui/progress"
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/ui/accordion"
export { HoverCard, HoverCardTrigger, HoverCardContent } from "./components/ui/hover-card"
export { ScrollArea, ScrollBar } from "./components/ui/scroll-area"
export { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar"
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./components/ui/collapsible"
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./components/ui/alert-dialog"
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from "./components/ui/toast"

// ── Radix wrappers (menus, navigation, forms) ─────────────────

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu"
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./components/ui/context-menu"
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarRadioGroup,
} from "./components/ui/menubar"
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "./components/ui/navigation-menu"
export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "./components/ui/toolbar"
export { Toggle } from "./components/ui/toggle"
export { AspectRatio } from "./components/ui/aspect-ratio"
export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormValidityState,
  FormSubmit,
} from "./components/ui/form"
export {
  OneTimePasswordField,
  OneTimePasswordFieldInput,
  OneTimePasswordFieldHiddenInput,
} from "./components/ui/otp-field"
export {
  PasswordToggleField,
  PasswordToggleFieldInput,
  PasswordToggleFieldToggle,
  PasswordToggleFieldIcon,
  PasswordToggleFieldSlot,
} from "./components/ui/password-toggle-field"
export { Announce } from "./components/ui/announce"

// ── Internal primitives (no Radix equivalent) ─────────────────

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/ui/breadcrumb"
export { SkipLink } from "./components/ui/skip-link"
export { Meter } from "./components/ui/meter"
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./components/ui/pagination"
export { Resizable } from "./components/ui/resizable"
export type { ResizableProps } from "./components/ui/resizable"
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicators,
} from "./components/ui/carousel"
export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "./components/ui/combobox"

// ── Overlay + dialog primitives ───────────────────────────────

export { Drawer } from "./components/ui/drawer"
export type { DrawerSide } from "./components/ui/drawer"
export { Popup, PopupTrigger, PopupClose } from "./components/ui/popup"
export type { PopupSize } from "./components/ui/popup"
export {
  PanelDialog,
  PanelDialogTrigger,
  PanelDialogClose,
} from "./components/ui/panel-dialog"
export type { PanelDialogSize, PanelDialogNavigation } from "./components/ui/panel-dialog"

// ── Custom widgets ────────────────────────────────────────────

export {
  SlidableColumn,
  SlidableColumnHandles,
  SlidableColumnHeader,
  SlidableColumnContent,
  SlidableColumnFooter,
  COLUMN_WIDTH,
} from "./components/ui/slidable-column"
export {
  Column,
  ColumnHeader,
  ColumnContent,
  ColumnFooter,
} from "./components/ui/column"
export type { ColumnProps } from "./components/ui/column"
export { ColumnToolBar } from "./components/ui/tool-bar"
export { BottomBar } from "./components/ui/bottom-bar"
export type { BottomBarItem } from "./components/ui/bottom-bar"
export { ThemeModeToggle } from "./components/ui/theme-mode-toggle"
export type { ThemeModeToggleProps } from "./components/ui/theme-mode-toggle"
export {
  SlidingPanels,
  SlidingPanel,
  SlidingPanelHeader,
  SlidingPanelContent,
  SlidingPanelFooter,
  useSlidingPanels,
} from "./components/ui/sliding-panels"
export { FlipContainer } from "./components/ui/flip-container"
export { Sortable, SortableItem, SortableHandle } from "./components/ui/sortable"
export { Tree, TreeItem } from "./components/ui/tree"
export { VisualizerTiles } from "./components/ui/visualizer-tiles"

// ── Theme + Character ─────────────────────────────────────────
export { ThemeScope, useThemeRoot } from "./components/ThemeScope"
export type { ThemeMode } from "./components/ThemeScope"
export { BoxFace, BoxEyes, BoxMouth } from "./components/BoxFace"

// ── Panel primitives ──────────────────────────────────────────

export {
  TabNavigationFooter,
  NavigationFooter,
  ToggleRow,
  SelectableRow,
  CheckboxItem,
  SwatchGrid,
  ToggleOption,
  IconGrid,
} from "./components/panel-primitives"

// ── Panels ────────────────────────────────────────────────────

// MusicPlayer is the lone showcase example panel kept in the published kit —
// the kit ships primitives + shell, not a panel catalog.
export { MusicPlayerPanel } from "./components/panels/MusicPlayerPanel"

// Theming panels — the studio's design-tool surface, extracted into the kit
// (2026-06-23). Controlled by `{ theme, onThemeChange }`; ColorPanel adds
// local Undo + a Copy-CSS-to-clipboard control.
export { ColorPanel } from "./components/panels/ColorPanel"
export { StylePanel } from "./components/panels/StylePanel"
export { TypographyPanel } from "./components/panels/TypographyPanel"
export { EffectsPanel } from "./components/panels/EffectsPanel"

// ── Hooks ─────────────────────────────────────────────────────

export { useLoopIndex } from "./hooks/use-loop-index"
export { usePanelChrome } from "./hooks/use-panel-chrome"
export { useDraggable } from "./hooks/use-draggable"
export { useEyeTracking } from "./hooks/use-eye-tracking"
export { useIsMobile } from "./hooks/use-mobile"
export { useAudioPlayer, subscribeFrequency } from "./hooks/use-audio-player"
export { useChat } from "./hooks/use-chat"
export type { Message } from "./hooks/use-chat"
export { usePlaylist } from "./hooks/use-playlist"
export { useResizable } from "./hooks/use-resizable"
export { useSortable } from "./hooks/use-sortable"
export { useSwipeDismiss } from "./hooks/use-swipe-dismiss"
export type { SwipeDirection } from "./hooks/use-swipe-dismiss"
export { useMouseParallax } from "./hooks/use-mouse-parallax"
export { useAnchoredZoom } from "./hooks/use-anchored-zoom"
export { useRovingTabindex } from "./hooks/use-roving-tabindex"
export type { RovingOrientation } from "./hooks/use-roving-tabindex"
export { useFocusOnChange } from "./hooks/use-focus-on-change"
export { useViewTransition } from "./hooks/use-view-transition"

// ── Lib utilities ─────────────────────────────────────────────

export { cx } from "./lib/utils"
export {
  hexToOklch,
  oklchToHex,
  parseOklch,
} from "./lib/color-utils"
export { themeToCss } from "./lib/theme-to-css"

// ── Theme data ────────────────────────────────────────────────
// A ready default theme + a generator (Tailwind palette family → Theme),
// so a consumer can start from a sane theme and mint their own.
export { DEFAULT_THEME, THEME_PRESETS, generateTheme } from "./data/themes"
export { COLOR_FAMILIES } from "./data/colors"
export type { ColorFamily } from "./data/colors"

// ── Types ─────────────────────────────────────────────────────

export type { Theme, ThemeColors, ThemeStyling } from "./types/theme"
export type { PanelProps } from "./types/panel"

// ── Panel config types (shapes for each panel's `panelData`) ───

export type {
  MusicConfig,
  MusicConfigTrack,
  MusicConfigPlaylist,
} from "./components/panels/MusicPlayerPanel"
