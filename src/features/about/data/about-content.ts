export interface AboutContent {
  name: string;
  headline: string;
  biography: string[];
  professionalInterests: string[];
  technicalInterests: string[];
  astronomyInterests: string[];
  focusAreas: string[];
}

/**
 * Profile copy sourced from resume (Tyler Matthews).
 */
export const aboutContent: AboutContent = {
  name: "Tyler Matthews",
  headline:
    "Computer Science graduate · Software engineering · Backend systems · Data & automation",
  biography: [
    "Computer Science graduate with hands-on experience developing backend APIs, data-processing pipelines, database-backed applications, and cloud-hosted software systems.",
    "Proficient in Python, Java, JavaScript/TypeScript, SQL, Linux, REST APIs, and databases. Experienced troubleshooting technical workflows, working with structured data, and collaborating across development teams.",
    "Based in Jupiter, Florida. Interested in software engineering, backend systems, automation, and data-focused roles — alongside deep-sky imaging and interactive astronomy on this site.",
  ],
  professionalInterests: [
    "Software engineering roles",
    "Backend systems & APIs",
    "Automation and data pipelines",
    "Cross-functional collaboration",
  ],
  technicalInterests: [
    "Python, Java, TypeScript",
    "Node.js, Express, REST APIs",
    "MongoDB, MySQL, Docker",
    "pandas, NumPy, GeoJSON pipelines",
  ],
  astronomyInterests: [
    "Deep-sky imaging",
    "Wide-field galaxy photography",
    "Interactive sky exploration",
  ],
  focusAreas: [
    "Backend systems",
    "Data & automation",
    "Full-stack web",
    "Astrophotography",
  ],
};
