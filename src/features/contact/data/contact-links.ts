export type ContactLinkKind = "email" | "github" | "linkedin" | "other";

export interface ContactLink {
  id: string;
  kind: ContactLinkKind;
  label: string;
  href: string;
  description: string;
}

/**
 * Placeholder contact methods. Replace href values with real profiles/email.
 * Prefer configuration here over scattering URLs across components.
 */
export const contactLinks: ContactLink[] = [
  {
    id: "email",
    kind: "email",
    label: "Email",
    href: "mailto:you@example.com",
    description: "Replace with your preferred contact address.",
  },
  {
    id: "github",
    kind: "github",
    label: "GitHub",
    href: "https://github.com/example",
    description: "Public repositories and experiments.",
  },
  {
    id: "linkedin",
    kind: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/example",
    description: "Professional profile placeholder.",
  },
];
