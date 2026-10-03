import type { ComponentProps } from 'react'
import type { Metadata } from 'next'
import { Footer } from '@/components/ContactFooter'
import { Header } from '@/components/Header'
import { ProjectsSection } from '@/components/ProjectsSection'
import { getProfile, getProjects } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Work - Muhammad Iksan',
  description: 'All portfolio projects by Muhammad Iksan.',
}

type ProjectsProps = ComponentProps<typeof ProjectsSection>

type ProfileView = {
  name?: string | null
  titles?: { title?: string | null }[] | null
  location?: string | null
  status?: string | null
  email?: string | null
  socials?: { github?: string; linkedin?: string; twitter?: string }
}

export default async function WorkPage() {
  const [profile, projects] = await Promise.all([
    getProfile(),
    getProjects(),
  ])

  const profileView = profile as unknown as ProfileView
  const titles = profileView.titles?.map((t) => t.title).filter((title): title is string => Boolean(title)) || []

  return (
    <>
      <Header activePage="work" />
      <main className="w-full bg-surface pt-8">
        <ProjectsSection
          projects={projects as unknown as ProjectsProps['projects']}
          allWork
        />
      </main>
      <Footer
        name={profileView.name || undefined}
        titles={titles}
        location={profileView.location || undefined}
        socials={profileView.socials}
      />
    </>
  )
}
