import type { Metadata } from "next";
import Link from "next/link";

import { SiteChrome } from "@/components/site/SiteChrome";
import { listPortfolioProjects } from "@/features/portfolio/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software projects by Tyler Matthews — AI asset pipeline, ALPR traffic simulator, Polaris indoor navigation, and this portfolio.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsIndexPage() {
  const projects = listPortfolioProjects();

  return (
    <SiteChrome>
      <h1 className="site-doc__title">Projects</h1>
      <p className="site-doc__lede">
        Server-rendered project summaries for recruiters and crawlers. Open any
        project for the full write-up.
      </p>
      <ul className="project-index">
        {projects.map((project) => (
          <li key={project.id} className="project-index__item">
            <h2>
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            </h2>
            <p>{project.summary}</p>
            <ul className="project-index__highlights">
              {project.highlights.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="project-index__tech">
              {project.technologies.join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </SiteChrome>
  );
}
