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
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${origin}/list/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${origin}/projects/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: `${origin}/projects/${project.slug}/`,
      lastModified: new Date(project.updatedAt ?? project.startedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
