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
