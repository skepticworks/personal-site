export interface AboutContent {
  name: string;
  headline: string;
  biography: string[];
  education: string;
  credentials: string[];
  focusAreas: string[];
  interests: string[];
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
    "Based in Jupiter, Florida. Looking for software engineering, backend, automation, and QA/cloud roles.",
  ],
  education:
    "B.S. Computer Science, University of Central Florida, August 2026 · GPA 3.62",
  credentials: ["AWS cybersecurity course badge"],
  focusAreas: [
    "Software engineering",
    "Backend systems & APIs",
    "Test automation & CI/CD",
    "Automation and data pipelines",
    "Cloud & reliability",
  ],
  interests: [
    "Building reliable backend services and APIs",
    "Test automation with pytest, Vitest, Jest, and Postman",
    "CI/CD with GitHub Actions and Docker-based deploys",
    "Data pipelines and structured geospatial formats (GeoJSON, IMDF)",
    "Deep-sky imaging and interactive astronomy (this site's sky explorer)",
  ],
};
