/**
 * Site-level constants that are safe to import from client or server code.
 */

export const siteConfig = {
  name: "Tyler Matthews",
  shortName: "Tyler Matthews",
  title: {
    default: "Tyler Matthews | Software Engineer (Backend, Automation, QA)",
    template: "%s | Tyler Matthews",
  },
  description:
    "Computer Science graduate (UCF '26) building backend services, test automation, and data pipelines, plus an interactive astronomy observatory.",
  locale: "en-US",
  url: "https://tylermatthews.dev",
  email: "tyler.matthews@outlook.com",
  location: {
    city: "Jupiter",
    region: "FL",
    country: "US",
  },
  jobTitle: "Software Engineer",
  alumniOf: "University of Central Florida",
  sameAs: [
    "https://github.com/skepticworks",
    "https://www.linkedin.com/in/tyler-matthews-53b379296/",
  ] as const,
  resumePath: "/resume.pdf",
  githubUrl: "https://github.com/skepticworks",
  linkedInUrl: "https://www.linkedin.com/in/tyler-matthews-53b379296/",
  siteRepoUrl: "https://github.com/skepticworks/personal-site",
} as const;

/** Absolute site origin used for metadata, sitemap, and JSON-LD. */
export function getSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return siteConfig.url;
}
