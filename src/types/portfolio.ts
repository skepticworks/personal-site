import type { WebImageAsset } from "@/types/assets";

export type ProjectCategory =
  | "software"
  | "web"
  | "tooling"
  | "research"
  | "other";

export type ProjectStatus =
  | "active"
  | "maintained"
  | "completed"
  | "archived"
  | "concept";

export interface ProjectLinks {
  repository?: string;
  demo?: string;
  documentation?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  /** Short highlight bullets shown in windows and project pages. */
  highlights: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  links: ProjectLinks;
  images: WebImageAsset[];
  featured: boolean;
  /** Lower sorts first in project lists when not using date ordering. */
  sortOrder?: number;
  startedAt: string;
  updatedAt?: string;
  /** Optional link to related astrophotography capture IDs. */
  relatedCaptureIds?: string[];
}
