"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { blogContentMap } from "@/lib/blog-content";
import type { BlogPost } from "@/lib/blog";

export function BlogListView({ posts }: { posts: BlogPost[] }) {
  const { lang, t } = useLanguage();

  return (
    <div className="mx-auto max-w-[72rem]">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          className="inline-flex items-center rounded-full border border-outline-variant px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.02em] text-primary transition-colors hover:border-primary"
          href="/"
        >
          {t("blog.backHome")}
        </Link>
        <span className="section-mark mb-0">{t("blog.eyebrow")}</span>
      </div>
      <div className="mb-14 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <h1 className="max-w-3xl text-balance text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-primary">
            {t("blog.title")}
          </h1>
        </div>
        <p className="max-w-md text-base leading-8 text-secondary md:justify-self-end">
          {t("blog.description")}
        </p>
      </div>

      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => {
            const cover = post.coverImage || post.project?.thumbnail;
            const contentOverride = blogContentMap[String(post.id)]?.[lang];
            const title = contentOverride?.title || post.title;
            const excerpt = contentOverride?.excerpt || post.excerpt;
            const localeCode = lang === "id" ? "id-ID" : "en-GB";

            return (
              <article key={post.id} className="min-w-0">
                <Link
                  href={`/blog/${post.id}`}
                  aria-labelledby={`post-${post.id}-title`}
                  className="project-card blog-card group flex h-full min-w-0 flex-col transition-colors hover:border-primary motion-reduce:transition-none"
                >
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-secondary">
                    <span className="font-mono">
                      {t("blog.architectureNotes")}
                    </span>
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString(
                          localeCode,
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            timeZone: "UTC",
                          },
                        )}
                      </time>
                    )}
                  </div>
                  <h2
                    id={`post-${post.id}-title`}
                    className="text-balance text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-primary"
                  >
                    {title}
                  </h2>
                  <p className="mt-4 text-[0.9375rem] leading-7 text-secondary">
                    {excerpt}
                  </p>
                  {!!post.project?.techStack?.length && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {post.project.techStack.map(
                        ({ tech }, index) =>
                          tech && (
                            <span
                              key={index}
                              className="rounded-full bg-surface-container px-3 py-1.5 font-mono text-xs text-on-surface-variant"
                            >
                              {tech}
                            </span>
                          ),
                      )}
                    </div>
                  )}
                  {cover?.url && (
                    <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-surface-variant bg-surface-container-lowest">
                      <Image
                        src={cover.url}
                        alt={cover.alt || `Architecture diagram for ${title}`}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 6rem), (max-width: 1200px) 45vw, 510px"
                        className="object-contain p-3"
                      />
                    </div>
                  )}
                  <div className="mt-auto pt-8">
                    <span className="inline-flex min-h-11 items-center gap-3 font-mono text-xs text-primary underline-offset-4 group-hover:underline">
                      {t("blog.readArticle")} <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <section
          className="project-card flex min-h-64 flex-col items-start justify-center"
          aria-labelledby="empty-blog-title"
        >
          <h2
            id="empty-blog-title"
            className="text-2xl font-semibold tracking-tight text-primary"
          >
            {t("blog.emptyTitle")}
          </h2>
          <p className="mt-3 max-w-lg leading-7 text-secondary">
            {t("blog.emptyDescription")}
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-on-primary"
            href="/work"
          >
            {t("blog.exploreProjects")}
          </Link>
        </section>
      )}
    </div>
  );
}
