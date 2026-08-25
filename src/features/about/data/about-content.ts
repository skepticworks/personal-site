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
 * Placeholder profile copy — replace with real personal content later.
 * Values are intentionally generic and clearly temporary.
 */
export const aboutContent: AboutContent = {
  name: "[Your Name]",
  headline: "Software developer & amateur astronomer",
  biography: [
    "This About window is placeholder content for the portfolio foundation. Replace these paragraphs with a short biography.",
    "The site pairs a desktop-style workspace for software projects with a planned interactive night-sky experience for astrophotography.",
  ],
  professionalInterests: [
    "Product-minded engineering",
    "Thoughtful interface architecture",
    "Reliable web systems",
  ],
  technicalInterests: [
    "TypeScript / React",
    "Real-time and interactive graphics",
    "Developer tooling",
  ],
  astronomyInterests: [
    "Deep-sky imaging",
    "Celestial coordinate systems",
    "Observing planning",
  ],
  focusAreas: ["Full-stack web", "Interactive experiences", "Astrophotography"],
};
