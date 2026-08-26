import type { PortfolioProject } from "@/types/portfolio";

/**
 * Portfolio project records. Adding a project should primarily mean editing
 * this data — not JSX in the Projects window.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "proj-ai-asset-pipeline",
    title: "AI Asset Generation Pipeline for Unity",
    slug: "ai-asset-generation-pipeline",
    summary:
      "Full-stack AI-assisted pipeline for production-ready 2D Unity game assets.",
    description:
      "Developing a full-stack AI-assisted asset generation pipeline for Unity, focused on producing production-ready 2D game assets including textures, sprites, icons, and UI elements. Building a Python-based generation backend with local and remote GPU execution, persistent job processing, model management, reproducible generation workflows, and Unity-native tooling for asset configuration, preview, and import. Current work includes image-to-image generation, inpainting, seamless texture generation, batch processing, deployment packaging, authentication, storage, and hosted GPU worker integration.",
    category: "software",
    status: "active",
    technologies: [
      "Python",
      "Unity",
      "GPU workers",
      "Image generation",
      "Docker",
    ],
    links: {},
    images: [],
    featured: true,
    sortOrder: 10,
    startedAt: "2026-01-01",
  },
  {
    id: "proj-polaris",
    title: "Polaris: Accessible Indoor Navigation",
    slug: "polaris-indoor-navigation",
    summary:
      "Team project converting source datasets into IMDF-compliant indoor navigation data.",
    description:
      "Developed components of a data-conversion pipeline that transformed source datasets into structured, IMDF-compliant indoor navigation data, reducing manual processing. Created tools to align GeoJSON floorplans with real-world coordinate systems while maintaining accurate structured location data. Built navigation-line and point-generation workflows that translated source geometry into structured data consumed by application routing functionality. Troubleshot data and integration issues and collaborated with mobile development teammates to connect generated data with an existing navigation application.",
    category: "software",
    status: "maintained",
    technologies: [
      "GeoJSON",
      "IMDF",
      "Data pipelines",
      "Python",
      "Structured location data",
    ],
    links: {},
    images: [],
    featured: true,
    sortOrder: 20,
    startedAt: "2026-01-01",
  },
  {
    id: "proj-personal-site",
    title: "Personal Portfolio & Observatory",
    slug: "personal-portfolio-observatory",
    summary:
      "Interactive desktop portfolio paired with a celestial sky explorer and astrophotography.",
    description:
      "A Next.js application that presents software work through a desktop metaphor and an interactive React Three Fiber night-sky experience for deep-sky navigation and personal astrophotography.",
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
      repository: "https://github.com/skepticworks",
    },
    images: [],
    featured: true,
    sortOrder: 30,
    startedAt: "2026-08-01",
    relatedCaptureIds: ["cap-orion-2024", "cap-andromeda-2025"],
  },
];

export function listPortfolioProjects(): PortfolioProject[] {
  return [...portfolioProjects].sort(compareProjectOrder);
}

export function getFeaturedProjects(): PortfolioProject[] {
  return listPortfolioProjects().filter((project) => project.featured);
}

export function getProjectById(id: string): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.id === id);
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  const normalized = slug.trim().toLowerCase();
  return portfolioProjects.find(
    (project) => project.slug.toLowerCase() === normalized,
  );
}

function compareProjectOrder(a: PortfolioProject, b: PortfolioProject): number {
  const orderA = a.sortOrder ?? Number.POSITIVE_INFINITY;
  const orderB = b.sortOrder ?? Number.POSITIVE_INFINITY;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return a.id.localeCompare(b.id);
}
