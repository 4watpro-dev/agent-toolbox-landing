import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Avatar } from '@/components/avatar/Avatar'
import { Kbd, Reveal, Section, SectionHeading } from '@/components/ui'
import { AGENTS, type Agent } from '@/data/agents'

const FILTERS = ['Tous', 'Travail', 'Écriture', 'Code', 'Perso', 'Autre']

/** Comme dans l'app : les favoris d'abord. Mailo est le favori de la démo. */
const FAVORITE = 'mailo'
const GALLERY = [...AGENTS].sort((a, b) => Number(b.id === FAVORITE) - Number(a.id === FAVORITE))

/**
 * Faux bureau : la bulle dans le coin ouvre le panneau d'agents, fidèle à l'app.
 * Le panneau reste sombre dans les deux thèmes, comme l'app.
 */
export default function Demo() {
  const [open, setOpen] = useState(false)
  const [chat, setChat] = useState<Agent | null>(null)
  const bubbleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setOpen(false)
        bubbleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = (): void => {
    setOpen((o) => !o)
    setChat(null)
  }

  return (
    <Section id="demo" labelledBy="demo-title">
      <SectionHeading
        id="demo-title"
        eyebrow="Toujours là, jamais dans les pattes"
        title="Une petite bulle dans un coin de l’écran"
        intro="Elle reste au premier plan, se déplace où tu veux et s’ouvre d’un clic. Essaie : clique sur la bulle en bas à droite."
      />

      <Reveal className="mx-auto mt-12 max-w-4xl">
        <div className="glass overflow-hidden rounded-[1.75rem]">
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
                  {chat ? <ChatView agent={chat} onBack={() => setChat(null)} /> : <Gallery onPick={setChat} />}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indice */}
            <AnimatePresence>
              {!open && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass absolute right-24 bottom-7 hidden rounded-full px-3 py-1.5 text-sm sm:block"
                >
                  Clique-moi <span aria-hidden="true">👉</span>
                </motion.p>
              )}
            </AnimatePresence>

            <button
              ref={bubbleRef}
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="demo-panel"
              aria-label={open ? 'Fermer le panneau des agents' : 'Ouvrir le panneau des agents'}
              className="avatar-hop app-bubble absolute right-3 bottom-3 grid size-16 place-items-center rounded-full sm:right-5 sm:bottom-5"
            >
              {!open && <span className="bubble-ping" aria-hidden="true" />}
              <Avatar config={AGENTS[2].avatar} size={44} groundShadow={false} state={open ? 'happy' : 'idle'} />
            </button>
          </div>
        </div>

        <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
          Ou ouvre-la de n’importe où avec <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>Espace</Kbd>
          <span>(Ctrl à la place de ⌘ sous Windows, et c’est modifiable)</span>
        </p>
      </Reveal>
    </Section>
  )
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
      <div className="space-y-3 border-b border-white/10 p-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-xl border-2 border-[var(--app-accent)] bg-black/25 px-3 py-2 text-sm text-[var(--app-muted)]">
            Rechercher un agent
          </div>
          <GearIcon />
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
        <div className="rounded-xl bg-[var(--app-accent)] py-2 text-center text-sm font-semibold text-[#171a12]">
          + Créer un agent
        </div>
      </div>
    </>
  )
}

function ChatView({ agent, onBack }: { agent: Agent; onBack: () => void }) {
  const [state, setState] = useState<'thinking' | 'happy'>('thinking')
  useEffect(() => {
    const t = setTimeout(() => setState('happy'), 1100)
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
      <div className="p-3">
        <div className="rounded-xl border border-white/12 bg-black/25 px-3 py-2 text-sm text-[var(--app-muted)]">
          Écris à {agent.name}…
        </div>
      </div>
    </div>
  )
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--app-muted)" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  )
}
