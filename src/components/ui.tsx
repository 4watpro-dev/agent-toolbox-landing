import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import SpotlightCard from '@/components/SpotlightCard'
import { useIsLight } from '@/lib/theme'

/** Apparition au défilement. Le mouvement réduit est géré par le MotionConfig de l'App. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, intro, id }: { eyebrow: string; title: ReactNode; intro?: string; id: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold tracking-wide text-accent-ink uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{intro}</p>}
    </Reveal>
  )
}

export function Section({ id, labelledBy, children, className = '' }: { id: string; labelledBy: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 ${className}`}>
      {children}
    </section>
  )
}

/** SpotlightCard en verre, qui suit le thème du système. */
export function GlowCard({ children, color = '#c8f031', className = '', style }: { children: ReactNode; color?: string; className?: string; style?: CSSProperties }) {
  const light = useIsLight()
  return (
    <SpotlightCard
      theme={light ? 'light' : 'dark'}
      spotlightColor={`${color}${light ? '40' : '33'}`}
      className={`md:backdrop-blur-[18px] ${className}`}
      style={
        {
          '--spotlight-card-surface': 'var(--glass)',
          '--spotlight-card-border': 'var(--border)',
          '--spotlight-card-shadow': 'var(--highlight), var(--shadow)',
          ...style
        } as CSSProperties
      }
    >
      {children}
    </SpotlightCard>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-7 items-center justify-center rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-sans text-xs font-semibold text-text shadow-[inset_0_-1px_0_var(--border)]">
      {children}
    </kbd>
  )
}
