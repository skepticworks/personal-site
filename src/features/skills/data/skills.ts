export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

/**
 * Grouped skills for the Skills desktop window — aligned with the public resume.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      "Python",
      "Java",
      "C",
      "JavaScript",
      "TypeScript",
      "SQL",
      "PowerShell",
      "Bash",
    ],
  },
  {
    id: "backend-web",
    label: "Backend & Web",
    skills: ["Node.js", "Express", "REST APIs", "React", "Next.js"],
  },
  {
    id: "testing-qa",
    label: "Testing & QA",
    skills: ["pytest", "Vitest", "Jest", "Postman"],
  },
  {
    id: "devops-cloud",
    label: "DevOps & Cloud",
    skills: ["Docker", "GitHub Actions CI/CD", "DigitalOcean", "Linux"],
  },
  {
    id: "data",
    label: "Data",
    skills: [
      "MongoDB",
      "MySQL",
      "pandas",
      "NumPy",
      "GeoJSON",
      "IMDF",
      "IndexedDB",
    ],
  },
];
