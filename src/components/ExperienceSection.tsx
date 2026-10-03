"use client";

import { useLanguage } from "@/context/LanguageContext";
import { experienceTranslations } from "@/lib/translations";

type Experience = {
  title?: string;
  company?: string;
  description?: string;
  achievements?: { achievement: string }[];
};

export function ExperienceSection({
  experience,
}: {
  experience?: Experience[];
}) {
  const { lang, t } = useLanguage();

  if (!experience || experience.length === 0) return null;

  const orderedExperience = experience.slice().reverse();

  return (
    <section
      className="portfolio-section experience-track w-full px-6 py-[5rem] md:py-[7rem]"
      id="experience"
    >
      <div className="mx-auto grid max-w-[72rem] grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="section-heading lg:sticky lg:top-32 lg:self-start">
          <span className="section-mark">{t("experience.eyebrow")}</span>
          <h2 className="max-w-xl text-balance font-sans text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-primary">
            {t("experience.title")}
          </h2>
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-7 text-secondary">
            {t("experience.description")}
          </p>
        </div>

        <div className="timeline-stack">
          {orderedExperience.map((exp, i) => {
            const localized = exp.company
              ? experienceTranslations[exp.company]?.[lang]
              : undefined;
            const title = localized?.title || exp.title;
            const company = localized?.company || exp.company;
            const description = localized?.description || exp.description;
            const achievements = localized?.achievements
              ? localized.achievements.map((a) => ({ achievement: a }))
              : exp.achievements;

            return (
              <article key={i} className="reveal-child experience-item">
                <span className="experience-marker" />
                <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <h3 className="font-sans text-[1.35rem] font-semibold leading-7 tracking-[-0.025em] text-primary">
                    {title}
                  </h3>
                  <span className="experience-company">{company}</span>
                </div>
                {description && (
                  <p className="mb-4 max-w-2xl text-[0.9375rem] leading-7 text-secondary">
                    {description}
                  </p>
                )}
                {achievements && achievements.length > 0 && (
                  <ul className="grid gap-2 text-[0.875rem] leading-6 text-on-surface-variant">
                    {achievements.map((a, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="mt-2 h-px w-5 shrink-0 bg-outline" />
                        <span>{a.achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
