import type { ComponentProps, ReactNode } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/ContactFooter'
import { getProfile } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function BlogLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile() as unknown as {
    name?: string
    titles?: { title?: string }[]
    location?: string
    socials?: ComponentProps<typeof Footer>['socials']
  }

  return (
    <>
      <Header activePage="blog" />
      <main className="blog-page w-full flex-1 bg-surface px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        {children}
      </main>
      <Footer
        name={profile.name}
        titles={profile.titles?.map(({ title }) => title).filter((title): title is string => Boolean(title))}
        location={profile.location}
        socials={profile.socials}
      />
    </>
  )
}
