"use client";

import type { CSSProperties } from "react";
import { useLanguage } from "@/context/LanguageContext";

type SkillCategory = {
  id: string;
  category: string;
  description?: string;
  order?: number;
  items?: { name: string; logoUrl?: string }[];
};

const accents = [
  "#ff6b4a",
  "#2dd4bf",
  "#7967ff",
  "#f0b429",
  "#111111",
  "#5d7cff",
  "#21b26b",
  "#d760ff",
];

const toolLogos: Record<string, string> = {
  "Node.js":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  Express:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  Go: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
  JWT: "https://cdn.simpleicons.org/jsonwebtokens/000000",
  "Next.js":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  React:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  TypeScript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "Tailwind CSS":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  PostgreSQL:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  SQLite:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg",
  Redis:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
  Docker:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/docker.png",
  Terraform:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/terraform.png",
  Vercel:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  ESLint:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eslint/eslint-original.svg",
  "Payload CMS": "https://cdn.simpleicons.org/payloadcms/000000",
  Postman:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/postman.png",
  Linux:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/linux.png",
  Opencode:
    "https://unpkg.com/@lobehub/icons-static-png@latest/light/opencode.png",
  VSCode:
    "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/vscode.png",
  Codex: "https://unpkg.com/@lobehub/icons-static-png@latest/light/codex.png",
};

const fallbackMarks: Record<string, string> = {
  "REST API": "{}",
};

function getToolStyle(
  name: string,
  logoUrl: string | undefined,
  index: number,
  center = 0,
) {
  const logo = logoUrl || toolLogos[name];

  return {
    "--tool-accent": accents[index % accents.length],
    "--tool-logo": logo ? `url("${logo}")` : undefined,
    "--tool-rotate": `${(index - center) * 5.5}deg`,
    "--tool-y": `${Math.abs(index - center) * 0.45}rem`,
  } as CSSProperties;
}

export function SkillsSection({ skills }: { skills: SkillCategory[] }) {
  const { t } = useLanguage();

  if (!skills || skills.length === 0) return null;

  const toolsGroup =
    skills.find((skill) => skill.order === 4) ??
    skills.find((skill) => skill.category === "Tools & Workflow");
  const tools = (toolsGroup?.items?.filter((item) => item.name) || []).slice(
    0,
    12,
  );
  const center = (tools.length - 1) / 2;
  const title = t("skills.title");
  const description = t("skills.description");

  return (
    <section
      className="portfolio-section skills-board w-full px-6 py-[5rem] md:py-[7rem]"
      id="stack"
    >
      <div className="mx-auto max-w-[72rem]">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-sans text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-primary">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[1.05rem] leading-8 text-secondary">
            {description}
          </p>
        </div>

        <div className="tool-deck reveal-child" role="list" aria-label={title}>
          {tools.map((tool, i) => {
            const hasLogo = Boolean(tool.logoUrl || toolLogos[tool.name]);

            return (
              <div
                aria-label={tool.name}
                className="tool-card"
                key={tool.name}
                role="listitem"
                style={getToolStyle(tool.name, tool.logoUrl, i, center)}
                tabIndex={0}
              >
                <span className="tool-card__tooltip">{tool.name}</span>
                <span
                  className={hasLogo ? "tool-card__logo" : "tool-card__mark"}
                >
                  {hasLogo
                    ? ""
                    : fallbackMarks[tool.name] || tool.name.slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
