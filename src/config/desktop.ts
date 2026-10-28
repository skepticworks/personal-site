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
  resume: {
    type: "resume",
    title: "Resume",
    defaultSize: { width: 420, height: 280 },
    defaultPosition: { x: 280, y: 120 },
    minSize: { width: 260, height: 180 },
  },
  skills: {
    type: "skills",
    title: "Skills",
    defaultSize: { width: 520, height: 460 },
    defaultPosition: { x: 200, y: 96 },
    minSize: { width: 280, height: 220 },
  },
  links: {
    type: "links",
    title: "Links",
    defaultSize: { width: 420, height: 360 },
    defaultPosition: { x: 240, y: 160 },
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
    id: "shortcut-skills",
    label: "Skills",
    iconId: "skills",
    windowType: "skills",
  },
  {
    id: "shortcut-resume",
    label: "Resume",
    iconId: "resume",
    windowType: "resume",
  },
  {
    id: "shortcut-links",
    label: "Links",
    iconId: "links",
    windowType: "links",
  },
  {
    id: "shortcut-contact",
    label: "Contact",
    iconId: "contact",
    windowType: "contact",
  },
];
