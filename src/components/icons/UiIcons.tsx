/**
 * Lightweight SVG icons shared by desktop chrome, sky HUD, and capture viewer.
 * Prefer these over raster icons for simple UI glyphs.
 */

interface IconProps {
  className?: string;
  title?: string;
}

function baseProps(className: string | undefined, title: string | undefined) {
  return {
    viewBox: "0 0 24 24",
    className,
    "aria-hidden": title ? undefined : (true as const),
    role: title ? ("img" as const) : undefined,
    children: title ? <title>{title}</title> : null,
  };
}

export function IconClose({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
      {props.children}
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function IconSearch({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
      {props.children}
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M15.5 15.5L20 20" strokeLinecap="round" />
    </svg>
  );
}

export function IconZoomIn({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
      {props.children}
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M15.5 15.5L20 20M10.5 8v5M8 10.5h5" strokeLinecap="round" />
    </svg>
  );
}

export function IconZoomOut({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
      {props.children}
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M15.5 15.5L20 20M8 10.5h5" strokeLinecap="round" />
    </svg>
  );
}

export function IconExpand({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
      {props.children}
      <path
        d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCamera({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.75">
      {props.children}
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13.5" r="3.25" />
      <path d="M9 7l1.2-2h3.6L15 7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSky({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="currentColor">
      {props.children}
      <circle cx="12" cy="12" r="2.2" opacity="0.95" />
      <circle cx="5.5" cy="8" r="1.1" opacity="0.7" />
      <circle cx="18" cy="7.5" r="1.35" opacity="0.8" />
      <circle cx="17.5" cy="16.5" r="1" opacity="0.65" />
      <circle cx="7" cy="17" r="0.9" opacity="0.55" />
      <path
        d="M3.5 14.5c2.2-1.4 4.6-1.4 6.8 0M13.5 11c1.8-1.1 3.9-1.1 5.8 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function IconDeepSky({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.75">
      {props.children}
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" strokeDasharray="2.5 2.2" opacity="0.75" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" strokeLinecap="round" />
    </svg>
  );
}

export function IconInfo({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2">
      {props.children}
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.5V17M12 7.5h.01" strokeLinecap="round" />
    </svg>
  );
}

export function IconReference({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.75">
      {props.children}
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 15l4-3.5 3 2.5 4-4.5 5 5.5" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGitHub({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="currentColor">
      {props.children}
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}

export function IconLinkedIn({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="currentColor">
      {props.children}
      <path d="M6.5 9.5H3.7V20h2.8V9.5zM5.1 4A1.65 1.65 0 1 0 5.1 7.3 1.65 1.65 0 0 0 5.1 4zM20.3 20h-2.8v-5.6c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94V20H10.7V9.5h2.69v1.43h.04c.37-.71 1.29-1.46 2.65-1.46 2.83 0 3.36 1.86 3.36 4.28V20z" />
    </svg>
  );
}

export function IconDocument({ className, title }: IconProps) {
  const props = baseProps(className, title);
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="1.75">
      {props.children}
      <path
        d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V8h4.5M8.5 12h7M8.5 15.5h7M8.5 19h4.5" strokeLinecap="round" />
    </svg>
  );
}
