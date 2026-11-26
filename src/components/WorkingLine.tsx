import { useEffect, useState } from 'react'

/**
 * Ligne d'attente reprise de l'app (src/renderer/panel/chat/WorkingLine.tsx) :
 * trois points, une barre qui défile et le temps écoulé. Transformations et
 * opacité seulement, que la carte graphique anime sans redessiner.
 */

/** Heure courante, rafraîchie chaque seconde seulement tant qu'un travail est en cours. */
export function useNow(active: boolean): number {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [active])
  return now
}

/** « 45 s » ou « 2 min 05 », pour le temps passé à attendre. */
export function formatElapsed(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000))
  if (seconds < 60) return `${seconds} s`
  return `${Math.floor(seconds / 60)} min ${String(seconds % 60).padStart(2, '0')}`
}

export function WorkingLine({ text, since, bar = true }: { text: string; since?: number; bar?: boolean }) {
  const now = useNow(since !== undefined)
  return (
    <div className="working" role="status">
      <p className="working-line">
        <span>{text.replace(/…$/, '')}</span>
        <span className="working-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {since !== undefined && <span className="working-time">{formatElapsed(now - since)}</span>}
      </p>
      {bar && (
        <span className="working-bar" aria-hidden="true">
          <i />
        </span>
      )}
    </div>
  )
}

export type StepState = 'done' | 'current' | 'pending'

/** Barre de progression d'une équipe : un segment par étape, l'étape en cours scintille. */
export function TeamProgress({ steps, elapsed }: { steps: { key: string; label: string; state: StepState }[]; elapsed?: string }) {
  const currentIndex = steps.findIndex((s) => s.state === 'current')
  const allDone = steps.every((s) => s.state === 'done')
  const current = steps[currentIndex]
  return (
    <div
      className="team-progress"
      role="progressbar"
      aria-label="Progression de l’équipe"
      aria-valuemin={0}
      aria-valuemax={steps.length}
      aria-valuenow={allDone ? steps.length : Math.max(currentIndex, 0)}
    >
      <p className="team-progress-label">
        <span>
          {allDone ? (
            <strong>Réponse prête</strong>
          ) : current ? (
            <>
              Étape {currentIndex + 1} sur {steps.length} · <strong>{current.label}</strong>
            </>
          ) : (
            'En attente de ta demande'
          )}
        </span>
        {elapsed && <span className="working-time">{elapsed}</span>}
      </p>
      <div className="team-progress-track">
        {steps.map((s) => (
          <span key={s.key} className={`team-progress-step is-${s.state}`} title={s.label} />
        ))}
      </div>
    </div>
  )
}
