import { skillGroups } from "@/features/skills/data/skills";

export function SkillsWindowContent() {
  return (
    <div className="skills-content">
      <p className="skills-content__intro">
        Technical skills grouped the way they show up in day-to-day engineering
        work.
      </p>
      <div className="skills-groups">
        {skillGroups.map((group) => (
          <section
            key={group.id}
            className="skills-group"
            aria-labelledby={`skills-${group.id}`}
          >
            <h3 id={`skills-${group.id}`}>{group.label}</h3>
            <ul className="skills-group__list">
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
