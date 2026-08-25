import type { PortfolioProject } from "@/types/portfolio";

/**
 * Portfolio project records. Adding a project should primarily mean editing
 * this data — not JSX in the Projects window.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "proj-personal-site",
    title: "Personal Portfolio & Observatory",
    slug: "personal-portfolio-observatory",
    summary:
      "Interactive personal workspace combining a desktop portfolio with a planned astronomy experience.",
    description:
      "A Next.js application that presents software work through a desktop metaphor and prepares for a React Three Fiber celestial explorer. This record is easy to replace as the real project narrative solidifies.",
    category: "web",
    status: "active",
    technologies: [
      "Next.js",
      "TypeScript",
      "React Three Fiber",
      "Three.js",
      "Zustand",
    ],
    links: {
      repository: "https://github.com/example/personalpage",
      demo: "https://example.com",
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
    summary:
      "Small utilities exploring equatorial coordinates and catalog lookups.",
    description:
      "Prototype tooling for right ascension / declination handling and object lookup. Not yet part of the public UI; included here as a realistic placeholder project card.",
    category: "tooling",
    status: "concept",
    technologies: ["TypeScript", "Node.js"],
    links: {
      repository: "https://github.com/example/sky-tools",
    },
    images: [],
    featured: false,
    startedAt: "2026-07-15",
  },
  {
    id: "proj-capture-pipeline",
    title: "Capture Preview Pipeline",
    slug: "capture-preview-pipeline",
    summary:
      "Offline workflow notes for producing web-safe astrophotography derivatives.",
    description:
      "Placeholder project describing how full-resolution masters stay offline while thumbnails and compressed previews are prepared for the site. Demonstrates data-driven project cards without hosting originals.",
    category: "software",
    status: "maintained",
    technologies: ["TypeScript", "Image tooling"],
    links: {
      documentation: "https://example.com/docs/assets",
    },
    images: [],
    featured: false,
    startedAt: "2026-06-01",
    updatedAt: "2026-08-01",
  },
];

export function listPortfolioProjects(): PortfolioProject[] {
  return portfolioProjects;
}

export function getFeaturedProjects(): PortfolioProject[] {
  return portfolioProjects.filter((project) => project.featured);
}

export function getProjectById(id: string): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.id === id);
}
