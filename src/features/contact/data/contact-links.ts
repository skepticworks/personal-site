export type ContactLinkKind =
  | "email"
  | "github"
  | "linkedin"
  | "resume"
  | "other";

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
    id: "linkedin",
    kind: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tyler-matthews-53b379296/",
    description: "linkedin.com/in/tyler-matthews-53b379296",
  },
  {
    id: "github",
    kind: "github",
    label: "GitHub",
    href: "https://github.com/skepticworks",
    description: "github.com/skepticworks",
  },
  {
    id: "resume",
    kind: "resume",
    label: "Resume",
    href: "/resume.pdf",
    description: "PDF resume",
  },
];

export const contactIntro = "Based in Jupiter, FL.";
