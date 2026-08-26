export type ContactLinkKind = "email" | "github" | "linkedin" | "other";

export interface ContactLink {
  id: string;
  kind: ContactLinkKind;
  label: string;
  href: string;
  description: string;
}

/**
 * Public contact methods. Prefer configuration here over scattering URLs.
 * Phone numbers are omitted from the site to limit spam exposure.
 */
export const contactLinks: ContactLink[] = [
  {
    id: "email",
    kind: "email",
    label: "Email",
    href: "mailto:tyler.matthews@outlook.com",
    description: "tyler.matthews@outlook.com",
  },
  {
    id: "github",
    kind: "github",
    label: "GitHub",
    href: "https://github.com/skepticworks",
    description: "github.com/skepticworks",
  },
];

export const contactIntro =
  "Based in Jupiter, FL. Reach out by email or find public work on GitHub.";
