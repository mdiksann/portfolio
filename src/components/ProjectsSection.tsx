"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { projectTranslations } from "@/lib/translations";

type Project = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: { url: string; alt?: string } | null;
  techStack?: { tech: string }[];
  repoUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  metrics?: { value: string; label: string }[];
  order?: number;
};

export function ProjectsSection({
  projects,
  eyebrow,
  title,
  description,
  showAllLink = false,
  allWork = false,
  headerAction,
}: {
  projects: Project[];
  eyebrow?: string;
  title?: string;
  description?: string;
  showAllLink?: boolean;
  allWork?: boolean;
  headerAction?: ReactNode;
}) {
  const { lang, t } = useLanguage();

  const currentEyebrow = eyebrow || t(allWork ? "projects.allWorkEyebrow" : "projects.eyebrow");
  const currentTitle = title || t(allWork ? "projects.allWorkTitle" : "projects.title");
  const currentDescription = description || t(allWork ? "projects.allWorkDescription" : "projects.description");
  const currentHeaderAction = allWork ? (
    <Link className="inline-flex items-center rounded-full border border-outline-variant px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.02em] text-primary transition-colors hover:border-primary" href="/">
      {t("nav.backHome")}
    </Link>
  ) : headerAction;

  return (
    <section
      className="portfolio-section projects-lab w-full px-6 py-[5rem] md:py-[7rem]"
      id="projects"
    >
      <div className="mx-auto max-w-[72rem]">
        {currentHeaderAction && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            {currentHeaderAction}
            <span className="section-mark mb-0">{currentEyebrow}</span>
          </div>
        )}
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div className="section-heading">
            {!currentHeaderAction && (
              <span className="section-mark">{currentEyebrow}</span>
            )}
            <h2 className="max-w-3xl text-balance font-sans text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-primary">
              {currentTitle}
            </h2>
          </div>
          <div className="max-w-md md:justify-self-end">
            <p className="text-[0.9375rem] leading-7 text-secondary">
              {currentDescription}
            </p>
            {showAllLink && (
              <Link
                className="mt-5 inline-flex items-center rounded-full border border-outline-variant px-4 py-2.5 font-mono text-[0.75rem] tracking-[0.02em] text-primary transition-colors hover:border-primary"
                href="/work"
              >
                {t("projects.seeAllProjects")}
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {projects.map((project, i) => {
            const isWide =
              projects.length === 1 ||
              (projects.length > 2 &&
                (i === 0 ||
                  (projects.length % 2 === 0 && i === projects.length - 1)));
            const isInternalSource =
              project.repoUrl?.startsWith("/") &&
              !project.repoUrl.startsWith("//");

            const localized = projectTranslations[project.slug]?.[lang];
            const projectName = localized?.name || project.name;
            const projectDescription =
              localized?.description || project.description;
            const projectMetrics = localized?.metrics || project.metrics;

            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
                className={`reveal-child project-card scroll-mt-28 ${isWide ? "project-card--wide lg:col-span-12" : "project-card--compact lg:col-span-6"}`}
              >
                <div
                  className={`${isWide ? "col-span-full" : "mb-5"} flex items-center justify-between gap-3`}
                >
                  <span className="font-mono text-[0.75rem] tracking-[0.02em] text-secondary">
                    {t("projects.case")} {String(i + 1).padStart(2, "0")}
                  </span>
                  {project.featured && (
                    <span className="rounded-full bg-surface-container-high px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.04em] text-on-surface">
                      {t("projects.featured")}
                    </span>
                  )}
                </div>
                <div
                  className={`flex min-w-0 flex-1 flex-col ${isWide && !project.thumbnail ? "md:col-span-2" : ""}`}
                >
                  <h3 className="mb-3 font-sans text-[clamp(1.65rem,3vw,2.5rem)] font-semibold leading-[1] tracking-[-0.035em] text-primary">
                    {projectName}
                  </h3>
                  {projectDescription && (
                    <p className="max-w-xl text-[0.9375rem] leading-7 text-secondary">
                      {projectDescription}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.techStack?.map((tItem, j) => (
                      <span
                        key={j}
                        className="rounded-full bg-surface-container px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.04em] text-on-surface-variant"
                      >
                        {tItem.tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {project.repoUrl && (
                      <Link
                        className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-3 py-2 font-mono text-[0.75rem] tracking-[0.02em] text-primary transition-colors hover:border-primary"
                        href={project.repoUrl}
                        target={isInternalSource ? undefined : "_blank"}
                        rel={isInternalSource ? undefined : "noreferrer"}
                      >
                        {t("projects.viewSource")}
                        <span aria-hidden="true">
                          {isInternalSource ? "→" : "↗"}
                        </span>
                      </Link>
                    )}
                    {project.liveUrl && (
                      <a
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 font-mono text-[0.75rem] tracking-[0.02em] text-on-primary transition-transform active:scale-[0.98]"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("projects.liveDemo")}
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </div>

                {!isWide &&
                  (project.thumbnail ? (
                    <a
                      href={project.thumbnail.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${t("projects.openImage")}: ${projectName}`}
                      className="project-card__media group relative mt-8 block h-48 overflow-hidden rounded-lg bg-surface-container-low"
                    >
                      <Image
                        src={project.thumbnail.url}
                        alt={project.thumbnail.alt || projectName}
                        width={720}
                        height={420}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/75 p-5 text-white">
                        <div className="flex h-full flex-col justify-between transition-opacity duration-500 group-hover:opacity-60">
                          <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-white/65">
                            {project.slug}
                          </span>
                          <div>
                            <span className="block font-sans text-[1.25rem] font-semibold leading-6">
                              {projectName}
                            </span>
                            <span className="mt-2 block font-mono text-[0.6875rem] tracking-[0.04em] text-white/70">
                              {project.techStack
                                ?.slice(0, 3)
                                .map((tItem) => tItem.tech)
                                .join(" / ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="project-preview mt-8 flex h-48 flex-col justify-between rounded-lg p-5">
                      <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-hero-soft">
                        {project.slug}
                      </span>
                      <div>
                        <span className="block font-sans text-[1.25rem] font-semibold leading-6 text-hero">
                          {projectName}
                        </span>
                        <span className="mt-2 block font-mono text-[0.6875rem] tracking-[0.04em] text-hero-muted">
                          {project.techStack
                            ?.slice(0, 3)
                            .map((tItem) => tItem.tech)
                            .join(" / ")}
                        </span>
                      </div>
                    </div>
                  ))}

                {isWide && project.thumbnail && (
                  <a
                    href={project.thumbnail.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${t("projects.openImage")}: ${projectName}`}
                    className="project-card__media group relative block min-h-[240px] rounded-lg bg-surface-container-low md:min-h-[280px]"
                  >
                    <Image
                      src={project.thumbnail.url}
                      alt={project.thumbnail.alt || projectName}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/75 p-5 text-white">
                      <div className="flex h-full flex-col justify-between transition-opacity duration-500 group-hover:opacity-60">
                        <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-white/65">
                          {project.slug}
                        </span>
                        <div>
                          <span className="block font-sans text-[1.25rem] font-semibold leading-6">
                            {projectName}
                          </span>
                          <span className="mt-2 block font-mono text-[0.6875rem] tracking-[0.04em] text-white/70">
                            {project.techStack
                              ?.slice(0, 3)
                              .map((tItem) => tItem.tech)
                              .join(" / ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                )}
                {isWide && projectMetrics && projectMetrics.length > 0 && (
                  <div className="project-metrics">
                    {projectMetrics.map((m, j) => (
                      <div
                        key={j}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-outline-variant py-3 last:border-b-0"
                      >
                        <span className="text-[0.875rem] leading-5 text-secondary">
                          {m.label}
                        </span>
                        <span className="font-mono text-[1rem] font-medium text-primary">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
