import { aboutContent } from "@/features/about/data/about-content";

export function AboutWindowContent() {
  return (
    <div className="about-content">
      <header className="about-content__header">
        <p className="about-content__eyebrow">Profile</p>
        <h3>{aboutContent.name}</h3>
        <p className="about-content__headline">{aboutContent.headline}</p>
      </header>

      <section aria-labelledby="about-bio-heading">
        <h4 id="about-bio-heading">About</h4>
        {aboutContent.biography.map((paragraph, index) => (
          <p key={`bio-${index}`}>{paragraph}</p>
        ))}
      </section>

      <section aria-labelledby="about-education-heading">
        <h4 id="about-education-heading">Education</h4>
        <p>{aboutContent.education}</p>
        {aboutContent.credentials.length > 0 ? (
          <ul className="about-content__list">
            {aboutContent.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section aria-labelledby="about-focus-heading">
        <h4 id="about-focus-heading">Focus areas</h4>
        <ul className="about-content__list">
          {aboutContent.focusAreas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-interests-heading">
        <h4 id="about-interests-heading">Interests & strengths</h4>
        <ul className="about-content__list">
          {aboutContent.interests.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
