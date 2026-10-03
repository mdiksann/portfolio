'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const editorialContainer: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.08 },
  },
}

const editorialItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

const splitWord: Variants = {
  hidden: { opacity: 0, y: '105%' },
  visible: { opacity: 1, y: '0%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
}

export function HeroSection({
  titles,
  about,
  location,
  status,
}: {
  name?: string
  titles?: string[]
  about?: string
  location?: string
  status?: string
  profileImage?: { url: string; alt?: string } | null
}) {
  const { t, lang } = useLanguage()
  const titleText = titles?.filter(Boolean).join(' / ') || 'Backend Developer'
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -24])
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 36])
  const accentY = useTransform(scrollYProgress, [0, 1], [0, -48])
  const headline = t('hero.headline')
  const words = headline.split(' ')

  return (
    <motion.section id="home" ref={heroRef} className="hero-stage hero-parallax-layers relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 pb-20 pt-36 text-center">
      <motion.div aria-hidden="true" className="hero-parallax-layer hero-parallax-layer--grid" style={reduceMotion ? undefined : { y: gridY }} />
      <motion.div aria-hidden="true" className="hero-parallax-layer hero-parallax-layer--accent" style={reduceMotion ? undefined : { y: accentY }} />

      <motion.div
        className="hero-content hero-editorial-stagger relative z-10 mx-auto flex w-full min-w-0 max-w-5xl flex-col items-center"
        variants={editorialContainer}
        initial={reduceMotion ? false : 'hidden'}
        animate={reduceMotion ? undefined : 'visible'}
        style={reduceMotion ? undefined : { y: contentY }}
      >
        <motion.h1 aria-label={headline} className="text-split-reveal w-full min-w-0 text-balance font-sans text-[clamp(2.9rem,7.1vw,6.8rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-hero" variants={editorialItem}>
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={`mr-[0.22em] inline-block align-top ${word === 'Making' ? 'overflow-visible' : 'overflow-hidden'} last:mr-0`}
            >
              <motion.span aria-hidden="true" className="inline-block align-top" variants={splitWord}>
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p variants={editorialItem} className="mt-7 max-w-2xl text-balance text-[1.0625rem] leading-7 text-hero-muted sm:text-[1.1875rem] sm:leading-8">
          {lang === 'en' ? (about || t('hero.about')) : t('hero.about')}
        </motion.p>

        <motion.div variants={editorialItem} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a className="inline-flex items-center gap-2 rounded-full bg-hero px-6 py-3 text-[0.875rem] font-semibold text-hero-invert transition-transform active:scale-[0.98]" href="#projects">
            <span>{t('hero.viewWork')}</span>
            <span aria-hidden="true" className="font-mono text-[1rem] leading-none">↓</span>
          </a>
          <a className="hero-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.875rem] font-semibold backdrop-blur-md transition-colors" href="#contact">
            <span>{t('hero.contactMe')}</span>
          </a>
        </motion.div>

        <motion.div variants={editorialItem} className="hero-meta mt-16 grid w-full max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {[
            [t('hero.locationLabel'), location || t('hero.locationValue')],
            [t('hero.focusLabel'), titleText],
            [t('hero.statusLabel'), lang === 'en' ? (status || t('hero.statusValue')) : t('hero.statusValue')],
          ].map(([label, value]) => (
            <div key={label} className="hero-stat rounded-2xl p-4 backdrop-blur-md">
              <span className="block font-mono text-[0.6875rem] tracking-[0.04em] text-hero-soft">{label}</span>
              <span className="mt-1 block text-[0.875rem] font-medium leading-5 text-hero">{value}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
