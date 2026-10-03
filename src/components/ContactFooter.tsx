"use client";

import { useLanguage } from "@/context/LanguageContext";

export function ContactSection({
  email,
  location,
}: {
  email?: string;
  location?: string;
  socials?: { github?: string; linkedin?: string; twitter?: string };
}) {
  const { t } = useLanguage();

  return (
    <section
      className="portfolio-section contact-panel w-full px-6 pb-[5rem] pt-[3rem] md:pb-[7rem]"
      id="contact"
    >
      <div className="mx-auto max-w-[72rem]">
        <div className="contact-card">
          <div className="section-heading max-w-3xl">
            <span className="section-mark section-mark--invert">
              {t("contact.eyebrow")}
            </span>
            <h2 className="text-balance font-sans text-[clamp(2.5rem,7vw,6.25rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-on-inverse">
              {t("contact.title")}
            </h2>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-7 text-on-inverse-muted">
              {t("contact.description")}
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-cell">
              <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-on-inverse-soft">
                {t("contact.directChannel")}
              </span>
              {email && (
                <a
                  className="mt-3 flex items-center justify-between gap-4 rounded-full bg-on-inverse px-4 py-3 font-mono text-[0.75rem] tracking-[0.02em] text-inverse-surface transition-transform active:scale-[0.98]"
                  href={`mailto:${email}`}
                >
                  <span className="truncate">{email}</span>
                  <span aria-hidden="true">@</span>
                </a>
              )}
            </div>
            <div className="contact-cell">
              <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-on-inverse-soft">
                {t("contact.base")}
              </span>
              <span className="mt-3 block font-sans text-[1.125rem] font-medium text-on-inverse">
                {location || t("hero.locationValue")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({
  name,
  titles,
  location,
  socials,
}: {
  name?: string;
  titles?: string[];
  location?: string;
  socials?: { github?: string; linkedin?: string; twitter?: string };
}) {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-surface-variant bg-surface">
      <div className="max-w-[72rem] mx-auto px-6 py-[4.5rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-sans text-[1.125rem] leading-6 tracking-[-0.015em] font-medium text-on-surface">
              {name}
            </span>
            <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-on-surface-variant">
              {titles?.join(", ")}
            </span>
          </div>
          <p className="font-mono text-[0.6875rem] tracking-[0.04em] text-on-surface-variant">
            {location || t("hero.locationValue")} &middot; &copy;{" "}
            {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6 font-mono text-[0.75rem] tracking-[0.02em]">
          {socials?.github && (
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              href={socials.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub &#8599;
            </a>
          )}
          {socials?.linkedin && (
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn &#8599;
            </a>
          )}
          {socials?.twitter && (
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              href={socials.twitter}
              target="_blank"
              rel="noreferrer"
            >
              X/Twitter &#8599;
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
