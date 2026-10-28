import Link from "next/link";

import { siteConfig } from "@/config/site";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-doc">
      <header className="site-doc__header">
        <div className="site-doc__brand">
          <Link href="/" className="site-doc__home">
            {siteConfig.name}
          </Link>
          <p className="site-doc__tagline">{siteConfig.description}</p>
        </div>
        <nav className="site-doc__nav" aria-label="Site">
          <Link href="/">Desktop</Link>
          <Link href="/list">List view</Link>
          <Link href="/projects">Projects</Link>
          <a href={siteConfig.resumePath} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </nav>
      </header>
      <main className="site-doc__main">{children}</main>
    </div>
  );
}
