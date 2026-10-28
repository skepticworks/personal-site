export interface AboutContent {
  name: string;
  headline: string;
  biography: string[];
  education: string;
  credentials: string[];
  professionalInterests: string[];
  technicalInterests: string[];
  astronomyInterests: string[];
  focusAreas: string[];
}

/**
 * Profile copy sourced from resume (Tyler Matthews — NextEra / software track).
 */
export const aboutContent: AboutContent = {
  name: "Tyler Matthews",
  headline:
    "Computer Science graduate · Test automation · Backend systems · CI/CD & reliability",
  biography: [
    "Computer Science graduate (UCF, 2026) focused on test automation, CI/CD, and reliable, observable systems. Wrote 300+ automated tests (pytest, Jest, Vitest), deployed applications to DigitalOcean with Docker, and run CI/CD through GitHub Actions.",
    "Hands-on with root-cause analysis, logging, health checks, retries, and cross-team integration troubleshooting across backend APIs, data pipelines, and cloud-hosted software.",
    "Based in Jupiter, Florida. Interested in software engineering, backend systems, automation, and QA/cloud roles — alongside deep-sky imaging and interactive astronomy on this site.",
  ],
  education:
    "B.S. Computer Science, University of Central Florida, August 2026 · GPA 3.62",
  credentials: ["AWS cybersecurity course badge"],
  professionalInterests: [
    "Software engineering roles",
    "Backend systems & APIs",
    "Test automation & CI/CD",
    "Automation and data pipelines",
    "Cloud & reliability",
  ],
  technicalInterests: [
    "Python, TypeScript, Java, SQL",
    "pytest, Vitest, Jest, Postman",
    "Node.js, Express, REST APIs, Docker",
    "MongoDB, MySQL, pandas, GeoJSON pipelines",
  ],
  astronomyInterests: [
    "Deep-sky imaging",
    "Wide-field galaxy photography",
    "Interactive sky exploration",
  ],
  focusAreas: [
    "Software engineering",
    "Backend systems & APIs",
    "Test automation & CI/CD",
    "Automation and data pipelines",
    "Cloud & reliability",
  ],
};
