import { motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Avatar } from '@/components/avatar/Avatar'
import { Reveal, Section, SectionHeading } from '@/components/ui'
import { formatElapsed, TeamProgress, useNow, WorkingLine, type StepState } from '@/components/WorkingLine'
import { AGENTS } from '@/data/agents'
import type { AvatarState } from '@/lib/avatar'
import { useReducedMotion } from '@/lib/hooks'

const byId = (id: string) => AGENTS.find((a) => a.id === id) ?? AGENTS[0]
const CHIEF = byId('drpro')
const MEMBERS = [
  { agent: byId('mailo'), part: 'L’email aux abonnés, avec trois objets à tester.' },
  { agent: byId('riff'), part: 'Le post d’annonce, prêt à publier ce soir.' }
]

/** Étapes jouées à l'écran : demande, répartition, travail des membres, synthèse. */
const STEPS = 4

export default function Teams() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const now = useNow(step >= 1 && step < STEPS)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setStep(STEPS)
      return
    }
    const timers = [1, 2, 3, 4].map((s, i) =>
      window.setTimeout(() => {
        if (s === 1) setStartedAt(Date.now())
        setStep(s)
      }, 500 + i * 1600)
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [inView, reduced])

  const chiefState: AvatarState = step === 1 ? 'thinking' : step >= 4 ? 'happy' : 'listening'

  // Comme dans l'app : un segment par étape (répartition, chaque membre, réponse).
  const at = (doneFrom: number, currentAt: number): StepState => (step >= doneFrom ? 'done' : step === currentAt ? 'current' : 'pending')
  const steps = [
    { key: 'split', label: `${CHIEF.name} répartit le travail`, state: at(2, 1) },
    ...MEMBERS.map(({ agent }) => ({ key: agent.id, label: `${agent.name} fait sa part`, state: at(3, 2) })),
    { key: 'answer', label: `${CHIEF.name} rédige la réponse`, state: at(4, 3) }
  ]
  const elapsed = startedAt && step < STEPS ? formatElapsed(now - startedAt) : undefined

  return (
    <Section id="equipes" labelledBy="teams-title">
      <SectionHeading
        id="teams-title"
        eyebrow="Des équipes d’agents"
        title="Pour les gros chantiers, ils s’y mettent à plusieurs"
        intro="Un chef d’orchestre répartit le travail entre 1 à 4 membres. Chacun fait sa part, puis le chef te rend une réponse unique, relue et harmonisée."
      />

      <Reveal className="mx-auto mt-14 max-w-4xl">
        <div ref={ref} className="glass rounded-[2rem] p-5 sm:p-8">
          <TeamProgress steps={steps} elapsed={elapsed} />

          {/* Ta demande */}
          <div className="mt-6 ml-auto max-w-md rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-[0.95rem] leading-snug text-accent-text">
            Prépare le lancement de la tournée : un email pour les abonnés et un post pour annoncer les dates.
          </div>

          {/* Le chef répartit */}
          <Line on={step >= 1} />
          <motion.div animate={{ opacity: step >= 1 ? 1 : 0.35 }} className="flex items-center gap-3">
            <Avatar config={CHIEF.avatar} size={64} state={chiefState} floating={false} label={`${CHIEF.name}, chef d’orchestre`} />
            <div>
              <p className="text-xs font-semibold tracking-wide text-accent-ink uppercase">Chef d’orchestre · {CHIEF.name}</p>
              <p className="mt-0.5 text-[0.95rem] text-muted">
                {step >= 2 ? 'Mailo prend l’email, Riff le post. Je relis le tout.' : step >= 1 ? 'Je répartis le travail…' : 'En attente de ta demande'}
              </p>
            </div>
          </motion.div>

          {/* Les membres travaillent */}
          <Line on={step >= 2} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {MEMBERS.map(({ agent, part }) => {
              const working = step === 2
              const done = step >= 3
              return (
                <motion.li
                  key={agent.id}
                  animate={{ opacity: step >= 2 ? 1 : 0.35, y: step >= 2 ? 0 : 6 }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
                  style={{ boxShadow: done ? `inset 0 0 0 1px ${agent.color}66` : undefined }}
                >
                  <Avatar config={agent.avatar} size={52} state={working ? 'thinking' : done ? 'happy' : 'idle'} floating={false} />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {agent.name}
                      {done && (
                        <span className="grid size-4 place-items-center rounded-full bg-accent text-[0.6rem] text-accent-text" aria-label="terminé">
                          ✓
                        </span>
                      )}
                    </p>
                    {working ? (
                      <WorkingLine text="Au travail…" bar={false} />
                    ) : (
                      <p className="text-sm leading-snug text-muted">{part}</p>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ul>

          {/* Synthèse */}
          <Line on={step >= 4} />
          <motion.div
            animate={{ opacity: step >= 4 ? 1 : 0.35 }}
            className="max-w-md rounded-2xl rounded-tl-sm border border-border bg-surface-2 px-4 py-3 text-[0.95rem] leading-snug"
            aria-live="polite"
          >
            <span className="block text-xs font-semibold tracking-wide text-muted uppercase">{CHIEF.name}</span>
            {step >= 4
              ? 'Voici ton kit de lancement : l’email et le post, accordés sur le même ton. Tu veux une version pour les réseaux pros ?'
              : '…'}
          </motion.div>

          <p className="mt-6 text-center text-sm text-muted">
            Chaque équipe a son historique et peut aussi recevoir des tâches programmées.
          </p>
        </div>
      </Reveal>
    </Section>
  )
}

function Line({ on }: { on: boolean }) {
  return (
    <div aria-hidden="true" className="ml-8 h-6 w-px overflow-hidden bg-border">
      <motion.div className="h-full w-full bg-accent" initial={false} animate={{ scaleY: on ? 1 : 0 }} style={{ originY: 0 }} transition={{ duration: 0.4 }} />
    </div>
  )
}
