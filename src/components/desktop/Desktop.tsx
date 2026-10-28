"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { DesktopShortcut } from "@/components/desktop/DesktopShortcut";
import { DesktopWindow } from "@/components/desktop/DesktopWindow";
import { ScrollExploreHint } from "@/components/desktop/ScrollExploreHint";
import {
  IconDocument,
  IconGitHub,
  IconLinkedIn,
} from "@/components/icons/UiIcons";
import { desktopShortcuts } from "@/config/desktop";
import { siteConfig } from "@/config/site";
import { useDesktopStore } from "@/state/desktop-store";
import type { DesktopWindowType } from "@/types/desktop";

export function Desktop() {
  // Primitive IDs + useShallow keep the snapshot stable across renders.
  // Returning a fresh window-object array each time causes an infinite loop.
  const openWindowTypes = useDesktopStore(
    useShallow((state) =>
      Object.values(state.windows)
        .filter((windowState) => windowState.isOpen)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((windowState) => windowState.type),
    ),
  );
  const clearActiveWindow = useDesktopStore((state) => state.clearActiveWindow);
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="desktop-root">
      <div className="desktop-wallpaper" aria-hidden="true" />

      <header className="desktop-brand">
        <p className="desktop-brand__eyebrow">Personal workspace</p>
        <h1 className="desktop-brand__title">{siteConfig.shortName}</h1>
        <p className="desktop-brand__role">{siteConfig.roleLine}</p>
        <p className="desktop-brand__subtitle">{siteConfig.description}</p>
        <p className="desktop-brand__cta">
          <Link className="desktop-brand__projects-link" href="/projects/">
            View projects
          </Link>
        </p>
      </header>

      <nav className="desktop-chrome" aria-label="Site links">
        <a
          className="desktop-header-button"
          href={siteConfig.resumePath}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconDocument className="desktop-header-button__icon" />
          Resume
        </a>
        <a
          className="desktop-header-button"
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconGitHub className="desktop-header-button__icon" />
          GitHub
        </a>
        <a
          className="desktop-header-button"
          href={siteConfig.linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconLinkedIn className="desktop-header-button__icon" />
          LinkedIn
        </a>
        <a
          className="desktop-header-button"
          href={`mailto:${siteConfig.email}`}
        >
          Email
        </a>
        <a className="desktop-header-button" href="/list/">
          List view
        </a>
      </nav>

      <nav className="desktop-shortcuts" aria-label="Desktop shortcuts">
        {desktopShortcuts.map((shortcut) => (
          <DesktopShortcut key={shortcut.id} shortcut={shortcut} />
        ))}
      </nav>

      <div
        className="desktop-window-layer"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            clearActiveWindow();
          }
        }}
      >
        {openWindowTypes.map((windowType: DesktopWindowType) => (
          <DesktopWindow
            key={windowType}
            windowType={windowType}
            viewport={viewport}
          />
        ))}
      </div>

      <ScrollExploreHint />
    </div>
  );
}
