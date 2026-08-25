import type { DesktopShortcutIconId } from "@/types/desktop";

interface ShortcutIconProps {
  iconId: DesktopShortcutIconId;
}

export function ShortcutIcon({ iconId }: ShortcutIconProps) {
  switch (iconId) {
    case "projects":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <rect x="4" y="7" width="24" height="18" rx="2" fill="currentColor" opacity="0.15" />
          <path
            d="M6 11h20v12H6V11Zm2 2v8h7v-8H8Zm9 0v3h7v-3h-7Zm0 5v3h7v-3h-7Z"
            fill="currentColor"
          />
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <circle cx="16" cy="16" r="11" fill="currentColor" opacity="0.15" />
          <circle cx="16" cy="12" r="4" fill="currentColor" />
          <path
            d="M8.5 24.5c1.8-3.4 4.4-5 7.5-5s5.7 1.6 7.5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <rect x="4" y="8" width="24" height="16" rx="2" fill="currentColor" opacity="0.15" />
          <path
            d="m6 10 10 8 10-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M6 22V10l10 8 10-8v12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <rect x="6" y="6" width="20" height="20" rx="3" fill="currentColor" opacity="0.2" />
        </svg>
      );
  }
}
