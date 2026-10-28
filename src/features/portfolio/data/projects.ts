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
      "Python backend + Unity editor tooling that generates Unity-ready 2D textures, sprites, and icons on local or hosted GPU workers.",
    description:
      "Building a full-stack AI pipeline for production-ready 2D game assets (textures, sprites, icons, UI) with a Python backend on local and hosted GPU workers, persistent job processing, and model management. Includes Unity-native configuration, preview, and import tooling, plus authentication, storage, and deployment packaging.",
    highlights: [
      "Persistent job processing with logging, health checks, retries, and error handling for diagnosable GPU jobs",
      "Local and hosted GPU worker execution with model management across the job lifecycle",
      "100+ automated pytest tests that catch regressions as new generation features ship",
      "Root-caused extreme job times to models persisting in GPU memory and forcing CPU offload; fixed with explicit load/offload",
      "Unity-native configuration, preview, and import tooling",
    ],
    category: "software",
    status: "active",
    technologies: ["Python", "pytest", "GPU workers", "Unity", "Docker"],
    links: {
      repository: "https://github.com/skepticworks/Unity-AI-Asset-Generator",
    },
    images: [],
    featured: true,
    sortOrder: 10,
    startedAt: "2026-01-01",
  },
  {
    id: "proj-alpr-traffic-simulator",
    title: "ALPR Traffic Simulator",
    slug: "alpr-traffic-simulator",
    summary:
      "Local-first TypeScript/React app that simulates synthetic vehicle traffic on real OpenStreetMap road networks and records what a hypothetical ALPR camera network would observe.",
    description:
      "A local-first browser SPA that simulates synthetic traffic on real OpenStreetMap roads and records what a hypothetical license plate reader camera network would observe. Simulation work runs in Web Workers, data persists with IndexedDB, and the map UI is built with MapLibre. Runs as a browser SPA; not publicly deployed.",
    highlights: [
      "MapLibre map UI over real OpenStreetMap road networks",
      "Simulation work isolated in Web Workers",
      "IndexedDB persistence for local-first data",
      "~200 Vitest tests with ~83% line / ~91% function coverage on the core engine (simulation engine ~95%)",
      "Runs as a browser SPA; not publicly deployed",
    ],
    category: "software",
    status: "completed",
    technologies: [
      "TypeScript",
      "React",
      "MapLibre",
      "Web Workers",
      "IndexedDB",
      "Vitest",
    ],
    links: {},
    images: [],
    featured: true,
    sortOrder: 20,
    startedAt: "2026-01-01",
  },
  {
    id: "proj-polaris",
    title: "Polaris: Accessible Indoor Navigation",
    slug: "polaris-indoor-navigation",
    summary:
      "Mapping lead on a 5-person team building IMDF-compliant indoor navigation data tooling.",
    description:
      "Mapping lead on a 5-person team, owning the backend data tooling behind the app's indoor routing. Built a data-conversion pipeline producing IMDF-compliant navigation data, reducing manual processing, and hand-curated the full HEC building dataset. Developed tools to georeference GeoJSON building data and generate the navigation graph used by app routing, then integrated the IMDF bundle into the mobile app while validating decoder compatibility.",
    highlights: [
      "5-person team; mapping lead owning backend data tooling for indoor routing",
      "GeoJSON georeferencing to real-world coordinates",
      "Navigation graph line/point generation for app routing",
      "IMDF-compliant conversion pipeline; hand-curated the full HEC building dataset",
      "Integrated with the mobile app's IMDF decoder; wrote pytest and Jest tests",
    ],
    category: "software",
    status: "completed",
    technologies: ["GeoJSON", "IMDF", "pytest", "Jest", "Python"],
    links: {},
    images: [],
    featured: true,
    sortOrder: 30,
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
    highlights: [
      "Desktop-metaphor portfolio with accessible window management",
      "Scroll-driven transition into an interactive React Three Fiber sky",
      "Published astrophotography captures with metadata and viewers",
      "Static export suitable for production hosting on tylermatthews.dev",
    ],
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
      repository: "https://github.com/skepticworks/personal-site",
    },
    images: [],
    featured: true,
    sortOrder: 40,
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
