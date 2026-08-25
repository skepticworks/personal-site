import type {
  DesktopShortcutConfig,
  DesktopWindowDefinition,
  DesktopWindowType,
} from "@/types/desktop";

export const desktopWindowDefinitions: Record<
  DesktopWindowType,
  DesktopWindowDefinition
> = {
  projects: {
    type: "projects",
    title: "Projects",
    defaultSize: { width: 720, height: 520 },
    defaultPosition: { x: 96, y: 72 },
    minSize: { width: 300, height: 240 },
  },
  about: {
    type: "about",
    title: "About",
    defaultSize: { width: 480, height: 440 },
    defaultPosition: { x: 160, y: 108 },
    minSize: { width: 280, height: 220 },
  },
  contact: {
    type: "contact",
    title: "Contact",
    defaultSize: { width: 420, height: 360 },
    defaultPosition: { x: 220, y: 140 },
    minSize: { width: 260, height: 200 },
  },
};

/**
 * Primary desktop shortcuts. Add future entries here (and a window definition
 * + registry content component) without changing Desktop markup.
 */
export const desktopShortcuts: DesktopShortcutConfig[] = [
  {
    id: "shortcut-projects",
    label: "Projects",
    iconId: "projects",
    windowType: "projects",
  },
  {
    id: "shortcut-about",
    label: "About",
    iconId: "about",
    windowType: "about",
  },
  {
    id: "shortcut-contact",
    label: "Contact",
    iconId: "contact",
    windowType: "contact",
  },
];
