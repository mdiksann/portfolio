'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent, useReducedMotion, type Variants } from 'framer-motion'
import { CodeXml, Menu } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

const EXPAND_SCROLL_THRESHOLD = 80
const NAV_HEIGHT = 56
const spring = { type: 'spring', damping: 20, stiffness: 300 } as const

function subscribeResize(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

function getViewportWidth() {
  return window.innerWidth
}

export type AnimatedNavFramerProps = {
  activePage?: 'home' | 'work' | 'blog'
}

export function AnimatedNavFramer({ activePage = 'home' }: AnimatedNavFramerProps) {
  const { lang, toggleLang, t } = useLanguage()
  const [expandedOverride, setExpanded] = React.useState<boolean | null>(null)
  const viewportWidth = React.useSyncExternalStore(subscribeResize, getViewportWidth, () => 1024)
  const isMobile = viewportWidth < 640
  const isExpanded = expandedOverride ?? !isMobile
  const expandedWidth = Math.min(isMobile ? 360 : 480, viewportWidth - 32)
  const headerRef = React.useRef<HTMLElement>(null)
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const menuId = React.useId()
  const lastScrollY = React.useRef(0)
  const scrollPositionOnCollapse = React.useRef(0)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const transition = reduceMotion ? { duration: 0 } : spring

  React.useEffect(() => {
    const home = document.getElementById('home')
    const header = headerRef.current
    if (!home || !header) return
    const observer = new IntersectionObserver(([entry]) => {
      header.dataset.dimmed = String(!entry.isIntersecting)
    }, { rootMargin: '-80px 0px 0px 0px' })
    observer.observe(home)
    return () => observer.disconnect()
  }, [activePage])

  function collapse() {
    if (menuRef.current?.contains(document.activeElement)) toggleRef.current?.focus()
    setExpanded(false)
  }

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current
    if (!isExpanded && latest > previous) scrollPositionOnCollapse.current = latest
    if (isExpanded && latest > previous && latest > 150) {
      collapse()
      scrollPositionOnCollapse.current = latest
    } else if (!isMobile && !isExpanded && latest < previous && (
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD || latest < 80
    )) {
      setExpanded(true)
    }
    lastScrollY.current = latest
  })

  const navItems = [
    [t('nav.work'), '/#projects', 'work'],
    [t('nav.experience'), '/#experience'],
    [t('nav.stack'), '/#stack'],
    [t('nav.contact'), '/#contact'],
    [t('nav.blog'), '/blog', 'blog'],
  ]

  const containerVariants: Variants = {
    expanded: { y: 0, opacity: 1, width: expandedWidth, height: isMobile ? 216 : NAV_HEIGHT, borderRadius: isMobile ? 24 : 28 },
    collapsed: { y: 0, opacity: 1, width: isMobile ? 80 : NAV_HEIGHT, height: isMobile ? 40 : NAV_HEIGHT, borderRadius: 28 },
  }
  const itemVariants: Variants = {
    expanded: { opacity: 1, x: 0, scale: 1 },
    collapsed: { opacity: 0, x: isMobile ? 20 : -20, scale: 0.95 },
  }
  const languageButton = (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t('nav.switchLang')}
      title={t('nav.switchLang')}
      className={cn('site-dock__link grid cursor-pointer place-items-center rounded-full border border-current/20 font-mono text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2', isMobile ? 'absolute right-[44px] top-[3px] h-[32px] w-[32px] text-[10px]' : 'h-[44px] w-[44px]')}
    >
      {lang.toUpperCase()}
    </button>
  )

  return (
    <header ref={headerRef} data-dimmed={activePage !== 'home'} className="site-header fixed right-4 top-4 z-50 sm:left-1/2 sm:right-auto sm:top-6 sm:-translate-x-1/2">
      <motion.nav
        aria-label={t('nav.label')}
        initial={reduceMotion ? false : { y: -80, opacity: 0 }}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
        transition={transition}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            collapse()
            toggleRef.current?.focus()
          }
        }}
        className="site-dock relative max-w-[calc(100vw-2rem)] overflow-hidden rounded-full border border-white/10 shadow-[0_18px_38px_rgba(0,0,0,0.22)] backdrop-blur-xl"
      >
        <motion.button
          ref={toggleRef}
          type="button"
          aria-label={t('nav.toggleMenu')}
          aria-expanded={isExpanded}
          aria-controls={menuId}
          onClick={() => isExpanded ? collapse() : setExpanded(true)}
          whileHover={reduceMotion ? undefined : { scale: 1.06 }}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          className="site-dock__icon absolute right-[3px] top-[3px] grid h-[32px] w-[32px] cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 sm:left-[5px] sm:right-auto sm:top-[5px] sm:h-[44px] sm:w-[44px]"
        >
          <motion.span
            variants={{ expanded: { opacity: 1, rotate: 0, scale: 1 }, collapsed: { opacity: 0, rotate: -180, scale: 0.8 } }}
            transition={transition}
            className="absolute"
          >
            <CodeXml aria-hidden="true" className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </motion.span>
          <motion.span
            variants={{ expanded: { opacity: 0, scale: 0.8 }, collapsed: { opacity: 1, scale: 1 } }}
            transition={transition}
            className="absolute"
          >
            <Menu aria-hidden="true" className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </motion.span>
        </motion.button>

        <motion.div
          ref={menuRef}
          id={menuId}
          inert={!isExpanded}
          variants={{ expanded: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } }, collapsed: { transition: { staggerChildren: reduceMotion ? 0 : 0.04, staggerDirection: -1 } } }}
          style={{ width: Math.max(0, expandedWidth - (isMobile ? 26 : 64)) }}
          className={cn(isMobile ? 'absolute right-3 top-[55px] grid grid-cols-2 gap-2' : 'absolute left-[3.625rem] top-[5px] flex h-[44px] items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', !isExpanded && 'pointer-events-none')}
        >
          {navItems.map(([name, href, page]) => (
            <motion.div key={href} variants={itemVariants} transition={transition} className="shrink-0">
              <Link
                href={href}
                onClick={() => { if (isMobile) collapse() }}
                aria-current={activePage === page ? 'page' : undefined}
                className={cn('inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-3 text-[0.8125rem] font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2', isMobile && 'w-full justify-center', activePage === page ? 'site-dock__icon' : 'site-dock__link')}
              >
                {name}
              </Link>
            </motion.div>
          ))}
          {!isMobile && (
            <motion.div variants={itemVariants} transition={transition} className="shrink-0">
              {languageButton}
            </motion.div>
          )}
        </motion.div>
        {isMobile && languageButton}
      </motion.nav>
    </header>
  )
}
