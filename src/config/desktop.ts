import type {
  DesktopPoint,
  DesktopShortcutConfig,
  DesktopSize,
  DesktopWindowDefinition,
  DesktopWindowType,
} from "@/types/desktop";

/**
 * Keep floating windows clear of the hero copy and shortcut column.
 * Tuned for ~1280×800 and up; clampWindowPosition still enforces the viewport.
 */
export const desktopOpenLayout = {
  origin: { x: 360, y: 88 } satisfies DesktopPoint,
  cascadeOffset: 28,
  maxCascade: 5,
} as const;

export const desktopWindowDefinitions: Record<
  DesktopWindowType,
  DesktopWindowDefinition
> = {
  projects: {
    type: "projects",
    title: "Projects",
    defaultSize: { width: 720, height: 560 },
    defaultPosition: { ...desktopOpenLayout.origin },
    minSize: { width: 420, height: 280 },
  },
  about: {
    type: "about",
    title: "About",
    defaultSize: { width: 520, height: 560 },
    defaultPosition: {
      x: desktopOpenLayout.origin.x + desktopOpenLayout.cascadeOffset,
      y: desktopOpenLayout.origin.y + desktopOpenLayout.cascadeOffset,
    },
    minSize: { width: 420, height: 280 },
  },
  skills: {
    type: "skills",
    title: "Skills",
    defaultSize: { width: 540, height: 520 },
    defaultPosition: {
      x: desktopOpenLayout.origin.x + desktopOpenLayout.cascadeOffset * 2,
      y: desktopOpenLayout.origin.y + desktopOpenLayout.cascadeOffset * 2,
    },
    minSize: { width: 420, height: 280 },
  },
  resume: {
    type: "resume",
    title: "Resume",
    defaultSize: { width: 440, height: 260 },
    defaultPosition: {
      x: desktopOpenLayout.origin.x + desktopOpenLayout.cascadeOffset * 3,
      y: desktopOpenLayout.origin.y + desktopOpenLayout.cascadeOffset * 3,
    },
    minSize: { width: 420, height: 200 },
  },
  contact: {
    type: "contact",
    title: "Contact",
    defaultSize: { width: 440, height: 360 },
    defaultPosition: {
      x: desktopOpenLayout.origin.x + desktopOpenLayout.cascadeOffset * 4,
      y: desktopOpenLayout.origin.y + desktopOpenLayout.cascadeOffset * 4,
    },
    minSize: { width: 420, height: 240 },
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
    id: "shortcut-contact",
    label: "Contact",
    iconId: "contact",
    windowType: "contact",
  },
];

export function cascadedOpenPosition(
  openCount: number,
  size: DesktopSize,
  viewport: { width: number; height: number },
): DesktopPoint {
  const step =
    Math.min(Math.max(openCount, 0), desktopOpenLayout.maxCascade) *
    desktopOpenLayout.cascadeOffset;
  const x = desktopOpenLayout.origin.x + step;
  const y = desktopOpenLayout.origin.y + step;
  const maxX = Math.max(0, viewport.width - size.width - 16);
  const maxY = Math.max(0, viewport.height - Math.min(size.height, viewport.height * 0.9));
  return {
    x: Math.min(x, maxX),
    y: Math.min(y, maxY),
  };
}
