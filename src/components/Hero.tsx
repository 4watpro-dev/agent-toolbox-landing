import { AnimatePresence, motion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'
import { Avatar } from '@/components/avatar/Avatar'
import BlurText from '@/components/BlurText'
import RotatingText, { type RotatingTextRef } from '@/components/RotatingText'
import { AGENTS } from '@/data/agents'
import Waitlist from '@/components/Waitlist'
import { useMediaQuery, useReducedMotion } from '@/lib/hooks'

const TOPICS = AGENTS.map((a) => a.topic)

export default function Hero() {
  const rotatorRef = useRef<RotatingTextRef>(null)
  const [active, setActive] = useState(0)

  return (
    <section
      id="top"
      className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-28 pb-20 sm:px-6 sm:pt-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:pt-40 lg:pb-28"
    >
      <div className="min-w-0 text-center lg:text-left">
        <p className="chip">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" aria-hidden="true" />
          Tes agents IA, posés sur ton bureau
        </p>

        <h1 className="mt-6 font-display text-[2.15rem] leading-[1.08] font-extrabold tracking-tight text-balance min-[400px]:text-[2.5rem] sm:text-6xl lg:text-[4.25rem]">
          Des agents IA qui s’occupent de{' '}
          <RotatingText
            ref={rotatorRef}
            texts={TOPICS}
            onNext={setActive}
            rotationInterval={3200}
            highlight
            highlightColor="#c8f031"
            mainClassName="mt-2 inline-flex align-bottom text-accent-text lg:mt-3"
            staggerDuration={0.02}
            effect="slide"
          />
        </h1>

        <Subtitle />

        <div className="mt-9">
          <Waitlist />
        </div>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted lg:justify-start">
          <span>Bientôt sur macOS</span>
          <span aria-hidden="true">·</span>
          <span>Tes données restent sur ta machine</span>
          <span aria-hidden="true">·</span>
          <a href="#demo" className="underline decoration-[var(--accent-line)] underline-offset-4 hover:text-text">
            Voir comment ça marche
          </a>
        </p>
      </div>

      <Stage active={active} onPick={(i) => rotatorRef.current?.jumpTo(i)} />
    </section>
  )
}

/** Mémoïsé : il ne doit pas rejouer son animation quand l'agent actif change. */
const Subtitle = memo(function Subtitle() {
  return (
    <BlurText
      text="Crée des assistants avec du caractère. Ils t’attendent dans un coin de l’écran, et rien ne part sans ton feu vert."
      className="mx-auto mt-6 max-w-xl justify-center text-lg leading-relaxed text-muted lg:mx-0 lg:justify-start"
      animateBy="words"
      delay={35}
      trigger="load"
      stepDuration={0.25}
    />
  )
})

/** Regard des fantômes : suit le curseur, dans la limite de ±4 unités. */
function useLook(target: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [look, setLook] = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const onMove = (e: PointerEvent): void => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = target.current?.getBoundingClientRect()
        if (!box) return
        const clamp = (v: number): number => Math.max(-4, Math.min(4, Math.round(v * 2) / 2))
        setLook({
          x: clamp((e.clientX - (box.left + box.width / 2)) / 90),
          y: clamp((e.clientY - (box.top + box.height / 2)) / 110)
        })
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [target, enabled])
  return look
}

/** Scène : les trois agents, celui qui parle passe devant et prend la bulle. */
function Stage({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const reduced = useReducedMotion()
  const roomy = useMediaQuery('(min-width: 400px)')
  const ref = useRef<HTMLDivElement>(null)
  const look = useLook(ref, !reduced)
  const agent = AGENTS[active]
  const size = roomy ? 118 : 92

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md min-w-0">
      <div
        aria-hidden="true"
        className="absolute inset-[12%] hidden rounded-full blur-3xl transition-colors duration-700 md:block"
        style={{ background: `${agent.color}55` }}
      />
      <div className="glass relative rounded-[2rem] px-4 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6">
        <div className="min-h-[5.5rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={agent.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="mx-auto max-w-xs rounded-2xl border border-border bg-surface-2 px-4 py-3 text-[0.95rem] leading-snug"
            >
              <span className="block text-xs font-semibold tracking-wide text-muted uppercase">{agent.name}</span>
              {agent.line}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-end justify-center">
          {AGENTS.map((a, i) => {
            const on = i === active
            return (
              <motion.button
                key={a.id}
                type="button"
                onClick={() => onPick(i)}
                aria-label={`${a.name}, ${a.role}`}
                aria-pressed={on}
                className="avatar-hop flex flex-col items-center rounded-2xl p-1"
                animate={{ scale: on ? 1 : 0.74 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <Avatar config={a.avatar} state={on ? 'listening' : 'idle'} size={size} look={look} />
                <span className={`mt-1 text-sm font-semibold ${on ? 'text-text' : 'text-muted'}`}>{a.name}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
