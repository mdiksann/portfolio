"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ProjectsSection } from "@/components/ProjectsSection";
import type { ComponentProps } from "react";

type ProjectsProps = ComponentProps<typeof ProjectsSection>;

export function WorkView({
  projects,
}: {
  projects: ProjectsProps["projects"];
}) {
  const { t } = useLanguage();

  return (
    <ProjectsSection
      projects={projects}
      eyebrow={t("projects.allWorkEyebrow")}
      title={t("projects.allWorkTitle")}
      description={t("projects.allWorkDescription")}
      headerAction={
        <Link
          className="inline-flex items-center rounded-full border border-outline-variant px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.02em] text-primary transition-colors hover:border-primary"
          href="/"
        >
          {t("nav.backHome")}
        </Link>
      }
    />
  );
}
