import type { ComponentProps } from 'react'
import { getProfile, getProjects, getSkills } from '@/lib/payload'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection, Footer } from '@/components/ContactFooter'
import { ScrollReveal } from '@/components/ScrollReveal'

export const dynamic = 'force-dynamic'

type HeroProps = ComponentProps<typeof HeroSection>
type ProjectsProps = ComponentProps<typeof ProjectsSection>
type ExperienceProps = ComponentProps<typeof ExperienceSection>
type SkillsProps = ComponentProps<typeof SkillsSection>
type ContactProps = ComponentProps<typeof ContactSection>

type ProfileView = {
  name?: string | null
  titles?: { title?: string | null }[] | null
  about?: string | {
    root?: {
      children?: {
        children?: { text?: string | null }[] | null
      }[] | null
    } | null
  } | null
  location?: string | null
  status?: string | null
  email?: string | null
  profileImage?: HeroProps['profileImage']
  experience?: ExperienceProps['experience']
  socials?: ContactProps['socials']
}

export default async function Home() {
  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
  ])

  const profileView = profile as unknown as ProfileView
  const titles = profileView.titles?.map((t) => t.title).filter((title): title is string => Boolean(title)) || []
  const aboutText = typeof profileView.about === 'string'
    ? profileView.about
    : profileView.about?.root?.children?.[0]?.children?.[0]?.text || ''
  const selectedProjects = projects.filter((project) => project.featured).slice(0, 3)

  return (
    <>
      <Header
        name={profileView.name || undefined}
        status={profileView.status || undefined}
        email={profileView.email || undefined}
      />
      <main className="w-full bg-surface">
        <div className="flex flex-col w-full">
          <HeroSection
            name={profileView.name || undefined}
            titles={titles}
            about={aboutText}
            location={profileView.location || undefined}
            status={profileView.status || undefined}
            profileImage={profileView.profileImage}
          />
          <ScrollReveal>
            <ProjectsSection
              projects={selectedProjects as unknown as ProjectsProps['projects']}
              showAllLink
            />
          </ScrollReveal>
          <ScrollReveal>
            <ExperienceSection experience={profileView.experience} />
          </ScrollReveal>
          <ScrollReveal>
            <SkillsSection skills={skills as unknown as SkillsProps['skills']} />
          </ScrollReveal>
          <ScrollReveal>
            <ContactSection
              email={profileView.email || undefined}
              location={profileView.location || undefined}
              socials={profileView.socials}
            />
          </ScrollReveal>
        </div>
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
