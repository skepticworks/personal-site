import type { MetadataRoute } from "next";

import { getSiteOrigin } from "@/config/site";
import { listPortfolioProjects } from "@/features/portfolio/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const projects = listPortfolioProjects();

  return [
    {
      url: `${origin}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${origin}/list/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${origin}/projects/`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => {
      const lastModifiedSource = project.updatedAt ?? project.endedAt ?? project.startedAt;
      return {
        url: `${origin}/projects/${project.slug}/`,
        ...(lastModifiedSource
          ? { lastModified: new Date(lastModifiedSource) }
          : {}),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    }),
  ];
}
