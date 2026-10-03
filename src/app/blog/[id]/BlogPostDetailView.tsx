"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LinkJSXConverter,
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import { useLanguage } from "@/context/LanguageContext";
import { blogContentMap } from "@/lib/blog-content";
import { projectTranslations } from "@/lib/translations";
import type { BlogPost } from "@/lib/blog";

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const doc = linkNode.fields.doc;
      if (!doc) return "/blog";
      const id = typeof doc.value === "object" ? doc.value?.id : doc.value;
      if (doc.relationTo === "posts" && id) return `/blog/${id}`;
      if (doc.relationTo === "projects" && id) return `/work#project-${id}`;
      if (
        doc.relationTo === "media" &&
        typeof doc.value === "object" &&
        typeof doc.value?.url === "string"
      )
        return doc.value.url;
      return "/blog";
    },
  }),
  upload: ({ node }) => {
    const media = node.value;
    if (typeof media !== "object" || !media?.url) return null;

    return (
      <a
        href={media.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open full-size image: ${media.alt || "Architecture diagram"}`}
      >
        <Image
          src={media.url}
          alt={media.alt || "Architecture diagram"}
          width={media.width || 1440}
          height={media.height || 810}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full"
        />
      </a>
    );
  },
});

export function BlogPostDetailView({ post }: { post: BlogPost }) {
  const { lang, t } = useLanguage();

  const contentOverride = blogContentMap[String(post.id)]?.[lang];
  const title = contentOverride?.title || post.title;
  const excerpt = contentOverride?.excerpt || post.excerpt;
  const content = contentOverride?.content || post.content;

  const cover = post.coverImage || post.project?.thumbnail;
  const localeCode = lang === "id" ? "id-ID" : "en-GB";

  const localizedProject = post.project
    ? projectTranslations[post.project.slug]?.[lang]
    : undefined;
  const projectName = localizedProject?.name || post.project?.name;
  const projectDescription =
    localizedProject?.description || post.project?.description;

  return (
    <article className="mx-auto max-w-[72rem]">
      <Link
        href="/blog"
        className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm text-secondary underline-offset-4 hover:text-primary hover:underline"
      >
        <span aria-hidden="true">←</span> {t("blog.allArticles")}
      </Link>

      <header className="max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-secondary">
          {projectName && <span className="font-mono">{projectName}</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(localeCode, {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          )}
        </div>
        <h1 className="text-balance text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-primary">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-secondary">
          {excerpt}
        </p>
      </header>

      {cover?.url && (
        <figure className="mt-12">
          <a
            href={cover.url}
            target="_blank"
            rel="noreferrer"
            aria-label={t("blog.openDiagram")}
            className="block overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest p-3 md:p-6"
          >
            <Image
              src={cover.url}
              alt={cover.alt || `Architecture diagram for ${title}`}
              width={cover.width || 1440}
              height={cover.height || 810}
              sizes="(max-width: 1200px) calc(100vw - 3rem), 1100px"
              className="max-h-[42rem] w-full object-contain"
            />
          </a>
          <figcaption className="mt-3 text-sm text-secondary">
            {t("blog.caption")}
          </figcaption>
        </figure>
      )}

      <div
        className={`mt-12 grid gap-12 border-t border-outline-variant pt-10 md:mt-16 md:pt-14 ${post.project ? "lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16" : ""}`}
      >
        <RichText
          className="blog-prose min-w-0 max-w-[48rem]"
          converters={converters}
          data={content}
        />

        {post.project && (
          <aside
            className="min-w-0 border-t border-outline-variant pt-6 lg:sticky lg:top-28 lg:self-start lg:border-t-0 lg:pt-0"
            aria-label={t("blog.relatedProject")}
          >
            <p className="text-sm text-secondary">{t("blog.aboutProject")}</p>
            <h2 className="mt-3 text-xl font-semibold leading-7 tracking-tight text-primary">
              {projectName}
            </h2>
            {projectDescription && (
              <p className="mt-3 text-sm leading-6 text-secondary">
                {projectDescription}
              </p>
            )}
            {!!post.project.techStack?.length && (
              <ul
                className="mt-5 flex flex-wrap gap-2"
                aria-label={t("blog.technologyStack")}
              >
                {post.project.techStack.map(
                  ({ tech }, index) =>
                    tech && (
                      <li
                        key={index}
                        className="rounded-full bg-surface-container px-3 py-1.5 font-mono text-xs text-on-surface-variant"
                      >
                        {tech}
                      </li>
                    ),
                )}
              </ul>
            )}
            <Link
              href={`/work#project-${post.project.id}`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("blog.viewProject")}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        )}
      </div>

      <div className="mt-16 border-t border-outline-variant pt-8">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center rounded-full border border-outline-variant px-5 py-3 text-sm font-medium text-primary transition-colors hover:border-primary motion-reduce:transition-none"
        >
          {t("blog.backToBlog")}
        </Link>
      </div>
    </article>
  );
}
