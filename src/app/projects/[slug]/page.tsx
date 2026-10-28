import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site/SiteChrome";
import { ProjectPageContent } from "@/features/portfolio/components/ProjectPageContent";
import {
  getProjectBySlug,
  listPortfolioProjects,
} from "@/features/portfolio/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return listPortfolioProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Project" };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  return (
    <SiteChrome>
      <ProjectPageContent project={project} />
    </SiteChrome>
  );
}
