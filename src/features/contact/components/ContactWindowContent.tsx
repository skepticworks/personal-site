import { contactIntro, contactLinks } from "@/features/contact/data/contact-links";

export function ContactWindowContent() {
  return (
    <div className="contact-content">
      <p className="contact-content__intro">{contactIntro}</p>
      <ul className="contact-list">
        {contactLinks.map((link) => {
          const isExternal = link.kind !== "email";
          return (
            <li key={link.id}>
              <a
                className="contact-list__link"
                href={link.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className="contact-list__label">{link.label}</span>
                <span className="contact-list__description">
                  {link.description}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
