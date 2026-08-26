import type { DesktopShortcutIconId } from "@/types/desktop";

interface ShortcutIconProps {
  iconId: DesktopShortcutIconId;
}

/**
 * Unified desktop shortcut glyphs. Keep strokes/fills consistent so the
 * icon tile system reads as one set rather than mixed placeholders.
 */
export function ShortcutIcon({ iconId }: ShortcutIconProps) {
  switch (iconId) {
    case "projects":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <rect x="4" y="7" width="24" height="18" rx="2.5" fill="currentColor" opacity="0.14" />
          <path
            d="M6 11h20v12H6V11Zm2.2 2.2v8h6.6v-8H8.2Zm8.8 0v3.2h7.8v-3.2h-7.8Zm0 5.2v2.8h7.8v-2.8h-7.8Z"
            fill="currentColor"
          />
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <circle cx="16" cy="16" r="11" fill="currentColor" opacity="0.14" />
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
          <rect x="4" y="8" width="24" height="16" rx="2.5" fill="currentColor" opacity="0.14" />
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
    case "astrophotography":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <rect x="4" y="9" width="24" height="16" rx="2.5" fill="currentColor" opacity="0.14" />
          <circle cx="16" cy="17" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="17" r="2" fill="currentColor" />
          <path
            d="M11 9l1.6-2.5h6.8L21 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "resume":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <rect x="7" y="4" width="18" height="24" rx="2" fill="currentColor" opacity="0.14" />
          <path
            d="M11 10h10M11 15h10M11 20h7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "skills":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <circle cx="16" cy="16" r="11" fill="currentColor" opacity="0.14" />
          <path
            d="M16 7v4.5M16 20.5V25M7 16h4.5M20.5 16H25M9.6 9.6l3.2 3.2M19.2 19.2l3.2 3.2M22.4 9.6l-3.2 3.2M12.8 19.2l-3.2 3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "links":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <path
            d="M13.2 18.8a4.6 4.6 0 0 1 0-6.5l3.2-3.2a4.6 4.6 0 1 1 6.5 6.5l-1.4 1.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M18.8 13.2a4.6 4.6 0 0 1 0 6.5l-3.2 3.2a4.6 4.6 0 1 1-6.5-6.5l1.4-1.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className="desktop-shortcut__glyph">
          <rect x="6" y="6" width="20" height="20" rx="4" fill="currentColor" opacity="0.2" />
        </svg>
      );
  }
}
