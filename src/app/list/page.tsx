import type { Metadata } from "next";
import Link from "next/link";

import { SiteChrome } from "@/components/site/SiteChrome";
import { aboutContent } from "@/features/about/data/about-content";
import {
  contactIntro,
  contactLinks,
} from "@/features/contact/data/contact-links";
import {
  listPortfolioProjects,
  projectStatusLabel,
} from "@/features/portfolio/data/projects";
import { skillGroups } from "@/features/skills/data/skills";
import { getSiteOrigin, siteConfig } from "@/config/site";

const listUrl = `${getSiteOrigin()}/list/`;

export const metadata: Metadata = {
  title: "List view",
  description: `Plain-text overview of ${siteConfig.name}: about, skills, projects, and contact.`,
  alternates: { canonical: "/list/" },
  openGraph: {
    url: listUrl,
    title: "List view",
    description: `Plain-text overview of ${siteConfig.name}: about, skills, projects, and contact.`,
  },
};

export default function ListViewPage() {
  const projects = listPortfolioProjects();

  return (
    <SiteChrome>
      <h1 className="site-doc__title">List view</h1>
      <p className="site-doc__lede">
        A simple scrollable page with the same content as the interactive
        desktop — useful for screen readers, crawlers, and quick scanning.
      </p>

      <section className="list-section" aria-labelledby="list-about">
        <h2 id="list-about">About</h2>
        <p className="list-section__headline">{aboutContent.headline}</p>
        {aboutContent.biography.map((paragraph, index) => (
          <p key={`bio-${index}`}>{paragraph}</p>
        ))}
        <h3>Education</h3>
        <p>{aboutContent.education}</p>
        <ul>
          {aboutContent.credentials.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>Focus areas</h3>
        <ul>
          {aboutContent.focusAreas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>Interests & strengths</h3>
        <ul>
          {aboutContent.interests.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="list-section" aria-labelledby="list-skills">
        <h2 id="list-skills">Skills</h2>
        {skillGroups.map((group) => (
          <div key={group.id}>
            <h3>{group.label}</h3>
            <p>{group.skills.join(", ")}</p>
          </div>
        ))}
      </section>

      <section className="list-section" aria-labelledby="list-projects">
        <h2 id="list-projects">Projects</h2>
        {projects.map((project) => (
          <article key={project.id} className="list-project">
            <h3>
              <Link href={`/projects/${project.slug}/`}>{project.title}</Link>
            </h3>
            <p className="list-project__meta">
              {projectStatusLabel(project.status)}
              {project.dateLabel ? ` · ${project.dateLabel}` : ""}
            </p>
            <p>{project.summary}</p>
            <p>{project.description}</p>
            <ul>
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              <strong>Tech:</strong> {project.technologies.join(", ")}
            </p>
          </article>
        ))}
      </section>

      <section className="list-section" aria-labelledby="list-contact">
        <h2 id="list-contact">Contact</h2>
        <p>{contactIntro}</p>
        <ul>
          {contactLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                {...(link.kind === "email"
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                {link.label}: {link.description}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </SiteChrome>
  );
}
