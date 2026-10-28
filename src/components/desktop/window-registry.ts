import type { ComponentType } from "react";

import { AboutWindowContent } from "@/features/about/components/AboutWindowContent";
import { ContactWindowContent } from "@/features/contact/components/ContactWindowContent";
import { ProjectsWindowContent } from "@/features/portfolio/components/ProjectsWindowContent";
import { ResumeWindowContent } from "@/features/resume/components/ResumeWindowContent";
import { SkillsWindowContent } from "@/features/skills/components/SkillsWindowContent";
import { desktopWindowDefinitions } from "@/config/desktop";
import type {
  DesktopSize,
  DesktopWindowType,
} from "@/types/desktop";

export interface WindowRegistryEntry {
  type: DesktopWindowType;
  title: string;
  defaultSize: DesktopSize;
  minSize: DesktopSize;
  Content: ComponentType;
}

export const windowRegistry: Record<DesktopWindowType, WindowRegistryEntry> = {
  projects: {
    ...desktopWindowDefinitions.projects,
    Content: ProjectsWindowContent,
  },
  about: {
    ...desktopWindowDefinitions.about,
    Content: AboutWindowContent,
  },
  contact: {
    ...desktopWindowDefinitions.contact,
    Content: ContactWindowContent,
  },
  resume: {
    ...desktopWindowDefinitions.resume,
    Content: ResumeWindowContent,
  },
  skills: {
    ...desktopWindowDefinitions.skills,
    Content: SkillsWindowContent,
  },
};

export function getWindowDefinition(
  type: DesktopWindowType,
): WindowRegistryEntry {
  return windowRegistry[type];
}
