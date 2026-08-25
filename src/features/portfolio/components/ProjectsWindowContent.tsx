"use client";

import { useMemo, useState } from "react";

import { listProjects } from "@/features/portfolio/list-featured-projects";
import type { PortfolioProject } from "@/types/portfolio";

function statusLabel(status: PortfolioProject["status"]): string {
  switch (status) {
    case "active":
      return "Active";
    case "maintained":
      return "Maintained";
    case "archived":
      return "Archived";
    case "concept":
      return "Concept";
  }
}

export function ProjectsWindowContent() {
  const projects = useMemo(() => listProjects(), []);
  const [selectedId, setSelectedId] = useState<string>(
    () => projects.find((project) => project.featured)?.id ?? projects[0]?.id ?? "",
  );

  const selected =
    projects.find((project) => project.id === selectedId) ?? projects[0];

  if (!selected) {
    return <p className="desktop-empty">No projects configured yet.</p>;
  }

  return (
    <div className="projects-layout">
      <ul className="projects-list" aria-label="Projects">
        {projects.map((project) => {
          const isSelected = project.id === selected.id;
          return (
            <li key={project.id}>
              <button
                type="button"
                className={`projects-list__item${isSelected ? " is-selected" : ""}`}
                aria-current={isSelected ? "true" : undefined}
                onClick={() => setSelectedId(project.id)}
              >
                <span className="projects-list__title">{project.title}</span>
                <span className="projects-list__summary">{project.summary}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="projects-detail" aria-live="polite">
        <header className="projects-detail__header">
          <h3>{selected.title}</h3>
          <p className="projects-detail__meta">
            <span>{statusLabel(selected.status)}</span>
            <span aria-hidden="true">·</span>
            <span>{selected.category}</span>
            {selected.featured ? (
              <>
                <span aria-hidden="true">·</span>
                <span>Featured</span>
              </>
            ) : null}
          </p>
        </header>
        <p>{selected.description}</p>
        <div className="projects-detail__tech" aria-label="Technologies">
          {selected.technologies.map((tech) => (
            <span key={tech} className="tech-chip">
              {tech}
            </span>
          ))}
        </div>
        <div className="projects-detail__links">
          {selected.links.repository ? (
            <a
              href={selected.links.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository
            </a>
          ) : null}
          {selected.links.demo ? (
            <a
              href={selected.links.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo
            </a>
          ) : null}
          {selected.links.documentation ? (
            <a
              href={selected.links.documentation}
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
