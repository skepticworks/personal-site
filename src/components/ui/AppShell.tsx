import { ExperienceViewport } from "@/components/experience/ExperienceViewport";
import { ExperienceModeControls } from "@/components/ui/ExperienceModeControls";
import { SelectionSummary } from "@/components/ui/SelectionSummary";
import { SiteIdentity } from "@/components/ui/SiteIdentity";

/**
 * Application shell demonstrating DOM UI and WebGL experience separation.
 * Visual styling is intentionally temporary.
 */
export function AppShell() {
  return (
    <div
      style={{
        display: "grid",
        gap: "1.5rem",
        padding: "1.5rem",
        maxWidth: "72rem",
        margin: "0 auto",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        color: "#e2e8f0",
        background: "#020617",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <SiteIdentity />

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "minmax(0, 1fr)",
        }}
        className="app-shell-main"
      >
        <aside
          style={{
            display: "grid",
            gap: "1.25rem",
            alignContent: "start",
          }}
        >
          <ExperienceModeControls />
          <SelectionSummary />
          <section aria-labelledby="architecture-note-heading">
            <h2 id="architecture-note-heading">Architecture note</h2>
            <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.5 }}>
              Controls and metadata live in the DOM. The canvas on the right is
              a replaceable React Three Fiber viewport. Critical portfolio
              information will remain reachable without WebGL.
            </p>
          </section>
        </aside>

        <section aria-labelledby="viewport-heading">
          <h2 id="viewport-heading">Experience viewport</h2>
          <div style={{ height: "min(60vh, 28rem)", marginTop: "0.75rem" }}>
            <ExperienceViewport />
          </div>
        </section>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .app-shell-main {
            grid-template-columns: minmax(16rem, 22rem) minmax(0, 1fr);
            align-items: start;
          }
        }

        button {
          appearance: none;
          border: 1px solid #334155;
          background: #0f172a;
          color: #e2e8f0;
          padding: 0.4rem 0.7rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font: inherit;
        }

        button:hover {
          border-color: #64748b;
        }

        button:focus-visible {
          outline: 2px solid #93c5fd;
          outline-offset: 2px;
        }

        h2 {
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }

        dl {
          margin: 0 0 0.75rem;
          display: grid;
          gap: 0.35rem;
          font-size: 0.875rem;
        }

        dt {
          font-weight: 600;
        }

        dd {
          margin: 0;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
