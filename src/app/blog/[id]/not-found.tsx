'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function BlogPostNotFound() {
  const { t } = useLanguage()
  return (
    <div className="mx-auto max-w-[72rem] py-12">
      <p className="font-mono text-sm text-secondary">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary">{t("blog.notFoundTitle")}</h1>
      <p className="mt-4 max-w-lg leading-7 text-secondary">{t("blog.notFoundDescription")}</p>
      <Link href="/blog" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-on-primary">{t("blog.backToBlog")}</Link>
    </div>
  )
}
