import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar } from '@/components/avatar/Avatar'
import { Kbd, Reveal, Section, SectionHeading } from '@/components/ui'
import { AGENTS, type Agent } from '@/data/agents'
import type { AvatarState } from '@/lib/avatar'
import { useReducedMotion } from '@/lib/hooks'

const FILTERS = ['Tous', 'Travail', 'Écriture', 'Code', 'Perso', 'Autre']

/** Comme dans l'app : les favoris d'abord. Mailo est le favori de la démo. */
const FAVORITE = 'mailo'
const GALLERY = [...AGENTS].sort((a, b) => Number(b.id === FAVORITE) - Number(a.id === FAVORITE))

/** Agent de la bulle, comme l'icône de l'app. */
const BUBBLE_AGENT = AGENTS.find((a) => a.id === 'riff') ?? AGENTS[0]

/** Questions rapides jouées dans la palette, une par agent. */
const QUICK: Record<string, { q: string; a: string }> = {
  drpro: {
    q: 'Note mon prompt : « Résume ce texte »',
    a: '2 étoiles sur 5. Dis-moi pour qui, quelle longueur et quel ton : je te propose une version à 5 étoiles ?'
  },
  mailo: {
    q: 'Un objet d’email pour la relance de vendredi ?',
    a: '« On vous a gardé une place. » Court, concret, une pointe d’urgence. J’en ai deux autres en réserve.'
  },
  riff: {
    q: 'Un post pour annoncer la date de samedi',
    a: 'Samedi, on monte le son. Billets en vente ce soir à 19 h. Tu veux une version plus sobre ?'
  }
}

/** Durées reprises de l'icône de l'app (widgetMood.ts). */
const SLEEP_AFTER_MS = 7000
const WAKE_SURPRISE_MS = 700
const WAKE_TOTAL_MS = 2000
const CELEBRATE_MS = 2600

/**
 * Faux bureau : la bulle dans le coin ouvre le panneau d'agents, fidèle à l'app.
 * Le panneau et la palette restent sombres dans les deux thèmes, comme l'app.
 */
export default function Demo() {
  const [open, setOpen] = useState(false)
  const [chat, setChat] = useState<Agent | null>(null)
  /** Échange repris de la palette, quand on choisit « Continuer dans le panneau ». */
  const [carried, setCarried] = useState<{ q: string; a: string } | null>(null)
  const [palette, setPalette] = useState(false)
  const bubbleRef = useRef<HTMLButtonElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const mood = useBubbleMood(open || palette, sectionRef)

  const closeAll = useCallback((): void => {
    setOpen(false)
    setPalette(false)
    bubbleRef.current?.focus()
  }, [])

  // Échap ferme ; ⌘ ⇧ Espace ouvre la palette quand la démo est à l'écran.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && (open || palette)) closeAll()
      if (e.code === 'Space' && e.shiftKey && (e.metaKey || e.ctrlKey) && mood.inView) {
        e.preventDefault()
        setOpen(false)
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, palette, closeAll, mood.inView])

  const toggle = (): void => {
    setPalette(false)
    setOpen((o) => !o)
    setChat(null)
    mood.touch()
  }

  return (
    <Section id="demo" labelledBy="demo-title">
      <SectionHeading
        id="demo-title"
        eyebrow="Toujours là, jamais dans les pattes"
        title="Une petite bulle dans un coin de l’écran"
        intro="Elle reste au premier plan, s’aimante au coin le plus proche et s’ouvre d’un clic. Laisse-la tranquille un moment : elle finit par s’assoupir."
      />

      <Reveal className="mx-auto mt-12 max-w-4xl">
        <div ref={sectionRef} className="glass overflow-hidden rounded-[1.75rem]">
          {/* Barre de titre */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
            <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
            <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
            <span className="ml-3 truncate text-xs text-muted">Plan de lancement — brouillon.txt</span>
          </div>

          {/* Bureau */}
          <div className="relative h-[37rem] overflow-hidden sm:h-[35rem]">
            <FakeDocument />

            <AnimatePresence>
              {palette && (
                <Palette
                  key="palette"
                  onClose={closeAll}
                  onAnswered={mood.celebrate}
                  onContinue={(agent) => {
                    setPalette(false)
                    setCarried(QUICK[agent.id])
                    setChat(agent)
                    setOpen(true)
                  }}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {open && (
                <motion.div
                  key="panel"
                  id="demo-panel"
                  role="dialog"
                  aria-label="Panneau Agent Toolbox"
                  initial={{ opacity: 0, scale: 0.85, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 12 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  style={{ transformOrigin: 'bottom right' }}
                  className="app-panel absolute right-3 bottom-[5.25rem] flex max-h-[calc(100%-6rem)] w-[min(22rem,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl sm:right-5"
                >
                  {chat ? (
                    <ChatView
                      agent={chat}
                      carried={carried}
                      onBack={() => {
                        setChat(null)
                        setCarried(null)
                      }}
                      onAnswered={mood.celebrate}
                    />
                  ) : (
                    <Gallery
                      onPick={(a) => {
                        setCarried(null)
                        setChat(a)
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indice */}
            <AnimatePresence>
              {!open && !palette && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass absolute right-24 bottom-7 hidden rounded-full px-3 py-1.5 text-sm sm:block"
                >
                  {mood.scene === 'is-asleep' ? 'Chut… il fait la sieste' : 'Clique-moi'} <span aria-hidden="true">👉</span>
                </motion.p>
              )}
            </AnimatePresence>

            <button
              ref={bubbleRef}
              type="button"
              onClick={toggle}
              onPointerEnter={mood.hoverIn}
              onPointerLeave={mood.hoverOut}
              onFocus={mood.hoverIn}
              onBlur={mood.hoverOut}
              aria-expanded={open}
              aria-controls="demo-panel"
              aria-label={open ? 'Fermer le panneau des agents' : 'Ouvrir le panneau des agents'}
              className="app-bubble absolute right-3 bottom-3 grid size-16 place-items-center rounded-full sm:right-5 sm:bottom-5"
            >
              {!open && !palette && mood.scene !== 'is-asleep' && <span className="bubble-ping" aria-hidden="true" />}
              <span className={`widget-ghost ${mood.scene}`}>
                <Avatar config={BUBBLE_AGENT.avatar} size={44} groundShadow={false} floating={false} state={mood.state} />
              </span>
              {mood.scene === 'is-asleep' && (
                <span className="widget-zzz" aria-hidden="true">
                  z
                </span>
              )}
              {mood.badge && <span className={mood.celebrating ? 'widget-badge is-new' : 'widget-badge'} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
          <span>Une question rapide ?</span>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              setPalette(true)
              mood.touch()
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 transition-colors hover:bg-surface-2"
            aria-label="Ouvrir la palette rapide (Commande Majuscule Espace)"
          >
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>Espace</Kbd>
          </button>
          <span>ouvre la palette au centre de l’écran, depuis n’importe quelle app.</span>
        </div>
      </Reveal>
    </Section>
  )
}

/**
 * Humeur de la bulle, d'après l'icône de l'app : elle s'assoupit sans interaction,
 * sursaute puis sourit au réveil, et fait des bonds quand un agent a répondu.
 */
function useBubbleMood(busy: boolean, ref: React.RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  const [inView, setInView] = useState(false)
  const [away, setAway] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [waking, setWaking] = useState<'surprised' | 'happy' | null>(null)
  const [celebrating, setCelebrating] = useState(false)
  const [badge, setBadge] = useState(false)
  const [tick, setTick] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  // Endormissement : la démo à l'écran, rien d'ouvert, pas de survol.
  useEffect(() => {
    if (!inView || busy || hovered || away) return
    const t = window.setTimeout(() => setAway(true), SLEEP_AFTER_MS)
    return () => window.clearTimeout(t)
  }, [inView, busy, hovered, away, tick])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const later = (fn: () => void, ms: number): void => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const wake = (): void => {
    if (!away) return
    setAway(false)
    setWaking('surprised')
    later(() => setWaking('happy'), WAKE_SURPRISE_MS)
    later(() => setWaking(null), WAKE_TOTAL_MS)
  }

  const touch = (): void => {
    wake()
    setBadge(false)
    setTick((n) => n + 1)
  }

  const celebrate = (): void => {
    setAway(false)
    setBadge(true)
    setCelebrating(true)
    later(() => setCelebrating(false), CELEBRATE_MS)
  }

  // Même ordre de priorité que widgetMood() dans l'app.
  const state: AvatarState = hovered
    ? 'happy'
    : waking
      ? waking
      : celebrating
        ? 'happy'
        : away
          ? 'sleepy'
          : badge
            ? 'happy'
            : 'idle'

  const scene = celebrating && !reduced ? 'is-celebrating' : waking === 'surprised' ? 'is-waking' : away && !hovered ? 'is-asleep' : ''

  return {
    state,
    scene,
    badge,
    celebrating,
    inView,
    touch,
    celebrate,
    hoverIn: () => {
      setHovered(true)
      wake()
    },
    hoverOut: () => {
      setHovered(false)
      setTick((n) => n + 1)
    }
  }
}

function FakeDocument() {
  const line = 'h-2.5 rounded-full bg-surface-2'
  return (
    <div aria-hidden="true" className="space-y-3 p-6 sm:p-10">
      <div className="h-5 w-2/3 rounded-full bg-surface-2 sm:w-1/3" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-11/12`} />
      <div className={`${line} w-4/5`} />
      <div className="h-4" />
      <div className={`${line} w-full`} />
      <div className={`${line} w-3/4`} />
      <div className={`${line} w-5/6`} />
      <div className="h-4" />
      <div className={`${line} w-2/3`} />
      <div className={`${line} w-11/12`} />
    </div>
  )
}

function Gallery({ onPick }: { onPick: (a: Agent) => void }) {
  return (
    <>
      <div className="space-y-4 border-b border-white/10 p-3">
        <div className="flex items-center gap-1.5">
          <div className="min-w-0 flex-1 truncate rounded-xl border-2 border-[var(--app-accent)] bg-black/25 px-3 py-2 text-sm text-[var(--app-muted)]">
            Rechercher un agent ou une conversation
          </div>
          <span className="grid size-8 place-items-center rounded-lg text-[var(--app-muted)]" title="Équipes" aria-hidden="true">
            <TeamIcon />
          </span>
          <span className="grid size-8 place-items-center rounded-lg text-[var(--app-muted)]" title="Réglages" aria-hidden="true">
            ⚙
          </span>
        </div>
        <div className="flex gap-1.5 overflow-hidden" aria-hidden="true">
          {FILTERS.map((f, i) => (
            <span
              key={f}
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${i === 0 ? 'bg-[var(--app-accent)] text-[#171a12]' : 'border border-white/15 text-[var(--app-text)]'}`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <ul className="grid flex-1 grid-cols-2 gap-2.5 overflow-auto p-3">
        {GALLERY.map((a, i) => (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.07 }}
          >
            <button
              type="button"
              onClick={() => onPick(a)}
              className="avatar-hop relative flex h-full w-full flex-col items-center rounded-xl border border-white/12 bg-white/6 px-2 pt-3 pb-3 text-center shadow-[inset_0_1px_0_rgb(255_255_255/9%)] transition-colors hover:bg-white/11"
            >
              <span className={`absolute top-1.5 left-2 text-sm ${a.id === FAVORITE ? 'text-[#f2c14e]' : 'text-white/50'}`} aria-hidden="true">
                {a.id === FAVORITE ? '★' : '☆'}
              </span>
              <span className="absolute top-1 right-2 text-white/50" aria-hidden="true">
                ···
              </span>
              <Avatar config={a.avatar} size={52} floating={false} />
              <span className="mt-1 text-sm font-semibold text-[var(--app-text)]">{a.name}</span>
              <span className="text-xs leading-tight text-[var(--app-muted)]">{a.role}</span>
            </button>
          </motion.li>
        ))}
      </ul>

      <div className="border-t border-white/10 p-3">
        <div className="mx-auto max-w-56 rounded-xl bg-[var(--app-accent)] py-2 text-center text-sm font-semibold text-[#171a12]">
          + Créer un agent
        </div>
      </div>
    </>
  )
}

function ChatView({
  agent,
  carried,
  onBack,
  onAnswered
}: {
  agent: Agent
  carried: { q: string; a: string } | null
  onBack: () => void
  onAnswered: () => void
}) {
  const [state, setState] = useState<'thinking' | 'happy'>(carried ? 'happy' : 'thinking')
  useEffect(() => {
    if (carried) return
    const t = setTimeout(() => {
      setState('happy')
      onAnswered()
    }, 1100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex min-h-80 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 p-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg px-2 py-1 text-sm text-[var(--app-muted)] hover:bg-white/10 hover:text-[var(--app-text)]"
        >
          ← Agents
        </button>
        <span className="ml-auto text-sm font-semibold text-[var(--app-text)]">{agent.name}</span>
      </div>
      {carried ? (
        <div className="flex flex-1 flex-col justify-end gap-2 p-4">
          <Avatar config={agent.avatar} size={64} state="happy" label={`${agent.name}, avatar`} />
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--app-accent)] px-3 py-2 text-sm leading-snug text-[#171a12]">
            {carried.q}
          </p>
          <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-sm leading-snug text-[var(--app-text)]">{carried.a}</p>
        </div>
      ) : (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
        <Avatar config={agent.avatar} size={84} state={state} label={`${agent.name}, avatar`} />
        <AnimatePresence mode="wait">
          {state === 'thinking' ? (
            <motion.p key="dots" exit={{ opacity: 0 }} className="text-sm text-[var(--app-muted)]">
              {agent.name} réfléchit…
            </motion.p>
          ) : (
            <motion.p
              key="msg"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-sm leading-snug text-[var(--app-text)]"
            >
              {agent.line}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/25 px-3 py-2 text-sm text-[var(--app-muted)]">
          <span aria-hidden="true">📎</span>
          Écris à {agent.name}…
        </div>
      </div>
    </div>
  )
}

/**
 * Palette rapide façon Spotlight : la question se tape toute seule, l'agent répond.
 * ⇥ ou un clic change d'agent ; « Continuer dans le panneau » ouvre sa conversation.
 */
function Palette({
  onClose,
  onAnswered,
  onContinue
}: {
  onClose: () => void
  onAnswered: () => void
  onContinue: (agent: Agent) => void
}) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(1)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'typing' | 'thinking' | 'answered'>('typing')
  const [copied, setCopied] = useState(false)
  const agent = GALLERY[index]
  const { q, a } = QUICK[agent.id]
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  // Saisie simulée, puis réflexion, puis réponse.
  useEffect(() => {
    setCopied(false)
    if (reduced) {
      setTyped(q)
      setPhase('answered')
      onAnswered()
      return
    }
    setTyped('')
    setPhase('typing')
    let i = 0
    const timers: number[] = []
    const step = (): void => {
      i += 1
      setTyped(q.slice(0, i))
      if (i < q.length) timers.push(window.setTimeout(step, 28))
      else {
        timers.push(window.setTimeout(() => setPhase('thinking'), 250))
        timers.push(
          window.setTimeout(() => {
            setPhase('answered')
            onAnswered()
          }, 1350)
        )
      }
    }
    timers.push(window.setTimeout(step, 300))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [index, reduced])

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Tab') {
      e.preventDefault()
      setIndex((n) => (n + (e.shiftKey ? GALLERY.length - 1 : 1)) % GALLERY.length)
    }
    if (e.key === 'Escape') onClose()
  }

  const avatarState: AvatarState = phase === 'thinking' ? 'thinking' : phase === 'answered' ? 'happy' : 'listening'

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-label="Palette rapide Agent Toolbox"
      onKeyDown={onKeyDown}
      initial={{ opacity: 0, scale: 0.96, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -6 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="app-panel absolute top-6 left-1/2 z-10 w-[min(32rem,calc(100%-1.5rem))] -translate-x-1/2 rounded-2xl p-3 outline-none sm:top-10"
    >
      <div className="flex items-center gap-3 rounded-xl bg-black/25 px-3 py-2">
        <Avatar config={agent.avatar} state={avatarState} size={40} groundShadow={false} floating={false} />
        <p className="min-h-6 flex-1 text-[0.95rem] text-[var(--app-text)]" aria-live="polite">
          {typed || <span className="text-[var(--app-muted)]">Demander à {agent.name}…</span>}
          {phase === 'typing' && <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-[var(--app-text)]" aria-hidden="true" />}
        </p>
      </div>

      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Agents">
        {GALLERY.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              title={`${c.name} (⌘${i + 1})`}
              className={`flex items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-1 text-xs ${i === index ? 'bg-white/14 text-[var(--app-text)] ring-1 ring-[var(--app-accent)]' : 'text-[var(--app-muted)] hover:bg-white/8'}`}
            >
              <Avatar config={c.avatar} size={22} groundShadow={false} floating={false} />
              {c.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 min-h-16" aria-live="polite">
        {phase === 'thinking' && <p className="text-sm text-[var(--app-muted)]">{agent.name} réfléchit…</p>}
        {phase === 'answered' && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-sm leading-snug text-[var(--app-text)]"
          >
            {a}
          </motion.p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
        <span className="mr-auto text-xs text-[var(--app-muted)]">⇥ changer d’agent · Échap fermer</span>
        <button
          type="button"
          disabled={phase !== 'answered'}
          onClick={() => setCopied(true)}
          className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-[var(--app-text)] disabled:opacity-40"
        >
          {copied ? 'Copié' : 'Copier la réponse'}
        </button>
        <button
          type="button"
          disabled={phase !== 'answered'}
          onClick={() => onContinue(agent)}
          className="rounded-lg bg-[var(--app-accent)] px-2.5 py-1 text-xs font-semibold text-[#171a12] disabled:opacity-40"
        >
          Continuer dans le panneau
        </button>
      </div>
    </motion.div>
  )
}

function TeamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.8a3 3 0 0 1 0 5.4M17.5 14.2A5.5 5.5 0 0 1 20.5 19" />
    </svg>
  )
}
