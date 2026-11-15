import { motion } from 'motion/react'
import { setTheme, useTheme } from '@/lib/theme'

/** Interrupteur clair / sombre, façon pastille de l'app. */
export default function ThemeToggle() {
  const theme = useTheme()
  const light = theme === 'light'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Mode clair"
      title={light ? 'Passer en mode sombre' : 'Passer en mode clair'}
      onClick={() => setTheme(light ? 'dark' : 'light')}
      className="relative flex h-10 w-[4.5rem] shrink-0 items-center rounded-full border border-border bg-surface p-1 transition-colors hover:bg-surface-2"
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="grid size-8 place-items-center rounded-full bg-accent text-accent-text shadow-[0_2px_8px_rgb(0_0_0/25%)]"
        style={{ marginLeft: light ? 'auto' : 0 }}
      >
        {light ? <SunIcon /> : <MoonIcon />}
      </motion.span>
      <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${light ? 'left-2.5' : 'right-2.5'}`} aria-hidden="true">
        {light ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  )
}
