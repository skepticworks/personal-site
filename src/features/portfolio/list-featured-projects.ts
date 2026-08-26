import {
  getFeaturedProjects,
  getProjectById,
  getProjectBySlug,
  listPortfolioProjects,
} from "@/features/portfolio/data/projects";
import type { PortfolioProject } from "@/types/portfolio";

/** Feature-level accessor for featured portfolio projects. */
export function listFeaturedPortfolioProjects(): PortfolioProject[] {
  return getFeaturedProjects();
}

export function listProjects(): PortfolioProject[] {
  return listPortfolioProjects();
}

export function resolveProject(id: string): PortfolioProject | undefined {
  return getProjectById(id);
}

export function resolveProjectBySlug(
  slug: string,
): PortfolioProject | undefined {
  return getProjectBySlug(slug);
}
