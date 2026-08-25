import { publicEnv } from "@/config/env";
import { siteConfig } from "@/config/site";
import { listFeaturedPortfolioProjects } from "@/features/portfolio/list-featured-projects";

/**
 * Server-friendly project identity panel. Portfolio content remains available
 * through normal DOM markup for accessibility and progressive enhancement.
 */
export function SiteIdentity() {
  const featured = listFeaturedPortfolioProjects();

  return (
    <header>
      <p style={{ margin: 0, fontSize: "0.75rem", letterSpacing: "0.04em" }}>
        Foundation scaffolding · {publicEnv.appEnvironment}
      </p>
      <h1 style={{ margin: "0.35rem 0" }}>{siteConfig.name}</h1>
      <p style={{ margin: 0, maxWidth: "40rem" }}>{siteConfig.description}</p>
      {featured.length > 0 ? (
        <p style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}>
          Featured project: {featured[0]?.title}
        </p>
      ) : null}
    </header>
  );
}
