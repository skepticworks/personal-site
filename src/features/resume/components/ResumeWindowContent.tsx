import { siteConfig } from "@/config/site";

export function ResumeWindowContent() {
  return (
    <div className="resume-content">
      <p className="resume-content__summary">
        One-page software resume covering test automation, backend services,
        CI/CD, and project work (Unity AI pipeline, ALPR simulator, Polaris).
      </p>
      <div className="resume-content__actions">
        <a
          className="desktop-action-button"
          href={siteConfig.resumePath}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open PDF
        </a>
        <a
          className="desktop-action-button desktop-action-button--secondary"
          href={siteConfig.resumePath}
          download="Tyler_Matthews_Resume.pdf"
        >
          Download
        </a>
      </div>
    </div>
  );
}
