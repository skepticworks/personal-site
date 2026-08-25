import type { PortfolioProject } from "@/types/portfolio";

/**
 * Minimal mock portfolio records for foundation scaffolding.
 * Replace with real content in later milestones.
 */
export const mockProjects: PortfolioProject[] = [
  {
    id: "proj-personal-site",
    title: "Personal Portfolio & Observatory",
    slug: "personal-portfolio-observatory",
    summary:
      "Interactive personal workspace combining software portfolio and astronomy exploration.",
    description:
      "A Next.js application that pairs conventional portfolio UI with a React Three Fiber celestial experience.",
    category: "web",
    status: "active",
    technologies: ["Next.js", "TypeScript", "React Three Fiber", "Three.js"],
    links: {
      repository: "https://github.com/example/personalpage",
    },
    images: [],
    featured: true,
    startedAt: "2026-08-01",
    relatedCaptureIds: ["cap-orion-nebula"],
  },
  {
    id: "proj-sky-tools",
    title: "Sky Tools Experiments",
    slug: "sky-tools-experiments",
    summary: "Small utilities exploring coordinate transforms and catalogs.",
    description:
      "Prototype tooling for equatorial coordinate handling and object lookup—not yet part of the public UI.",
    category: "tooling",
    status: "concept",
    technologies: ["TypeScript"],
    links: {},
    images: [],
    featured: false,
    startedAt: "2026-07-15",
  },
];

export function getFeaturedProjects(): PortfolioProject[] {
  return mockProjects.filter((project) => project.featured);
}

export function getProjectById(id: string): PortfolioProject | undefined {
  return mockProjects.find((project) => project.id === id);
}
