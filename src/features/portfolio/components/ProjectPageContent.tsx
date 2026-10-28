import Link from "next/link";

import { projectStatusLabel } from "@/features/portfolio/data/projects";
import type { PortfolioProject } from "@/types/portfolio";

export function ProjectPageContent({ project }: { project: PortfolioProject }) {
  return (
    <article className="project-page">
      <p className="project-page__crumb">
        <Link href="/projects/">Projects</Link>
        <span aria-hidden="true"> / </span>
        <span>{project.title}</span>
      </p>
      <header className="project-page__header">
        <h1>{project.title}</h1>
        <p className="project-page__meta">
          {projectStatusLabel(project.status)}
          {project.dateLabel ? ` · ${project.dateLabel}` : ""}
          {` · ${project.category}`}
        </p>
        <p className="project-page__summary">{project.summary}</p>
      </header>

      {project.images.length > 0 ? (
        <section
          className="project-page__media"
          aria-labelledby="project-media"
        >
          <h2 id="project-media">Media</h2>
          <div className="project-page__images">
            {project.images.map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="project-overview">
        <h2 id="project-overview">Overview</h2>
        <p>{project.description}</p>
      </section>

      {project.highlights.length > 0 ? (
        <section aria-labelledby="project-highlights">
          <h2 id="project-highlights">Highlights</h2>
          <ul>
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="project-tech">
        <h2 id="project-tech">Technologies</h2>
        <ul className="project-page__tech">
          {project.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </section>

      {(project.links.repository ||
        project.links.demo ||
        project.links.documentation) && (
        <section aria-labelledby="project-links">
          <h2 id="project-links">Links</h2>
          <ul className="project-page__links">
            {project.links.repository ? (
              <li>
                <a
                  href={project.links.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Repository
                </a>
              </li>
            ) : null}
            {project.links.demo ? (
              <li>
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live demo
                </a>
              </li>
            ) : null}
            {project.links.documentation ? (
              <li>
                <a
                  href={project.links.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
              </li>
            ) : null}
          </ul>
        </section>
      )}
    </article>
  );
}
