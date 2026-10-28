export type DesktopWindowType =
  | "projects"
  | "about"
  | "contact"
  | "resume"
  | "skills";

export interface DesktopPoint {
  x: number;
  y: number;
}

export interface DesktopSize {
  width: number;
  height: number;
}

/**
 * Serializable window instance tracked by the desktop window manager.
 * Content is resolved from the window registry — never store React trees here.
 */
export interface DesktopWindowState {
  id: DesktopWindowType;
  type: DesktopWindowType;
  isOpen: boolean;
  zIndex: number;
  position: DesktopPoint;
  size: DesktopSize;
}

export type DesktopShortcutIconId =
  | "projects"
  | "about"
  | "contact"
  | "astrophotography"
  | "resume"
  | "skills"
  | "links";

export interface DesktopShortcutConfig {
  id: string;
  label: string;
  iconId: DesktopShortcutIconId;
  windowType: DesktopWindowType;
  /** Optional override; otherwise the window registry supplies defaults. */
  initialPosition?: DesktopPoint;
}

export interface DesktopWindowDefinition {
  type: DesktopWindowType;
  title: string;
  defaultSize: DesktopSize;
  defaultPosition: DesktopPoint;
  minSize: DesktopSize;
}
