import { getFeaturedProjects } from "@/data/mock-projects";
import type { PortfolioProject } from "@/types/portfolio";

/** Feature-level accessor for featured portfolio projects. */
export function listFeaturedPortfolioProjects(): PortfolioProject[] {
  return getFeaturedProjects();
}
