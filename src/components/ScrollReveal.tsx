'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function ScrollReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="scroll-reveal"
      initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.99 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
