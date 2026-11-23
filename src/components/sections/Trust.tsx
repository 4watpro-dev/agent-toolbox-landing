import { Avatar } from '@/components/avatar/Avatar'
import ShinyText from '@/components/ShinyText'
import { Reveal, Section } from '@/components/ui'
import { AGENTS } from '@/data/agents'
import { useIsLight } from '@/lib/theme'

const POINTS = [
  'Les lectures passent seules. Envoyer, modifier, supprimer : l’action s’affiche en détail et attend ton clic sur « Confirmer ».',
  'Pas de réponse au bout de 5 minutes ? L’action n’est pas exécutée.',
  'Tes agents, leurs conversations et leur mémoire restent sur ta machine. Ta clé API est chiffrée.',
  'Tu peux relire et corriger ce que chaque agent retient.'
]

export default function Trust() {
  const light = useIsLight()
  return (
    <Section id="securite" labelledBy="trust-title">
      <Reveal>
        <div className="glass grid items-center gap-10 rounded-[2rem] p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent-ink uppercase">Confiance et sécurité</p>
            <h2 id="trust-title" className="mt-3 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
              <ShinyText
                text="Ton feu vert, à chaque fois."
                color={light ? '#171a12' : '#f2f4f7'}
                shineColor={light ? '#7a9a00' : '#c8f031'}
                speed={3}
              />
            </h2>
            <ul className="mt-6 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex gap-3 leading-relaxed text-muted">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-[0.7rem] font-bold text-accent-text" aria-hidden="true">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Fausse demande de confirmation, comme dans l'app. */}
          <div aria-hidden="true" className="app-panel mx-auto w-full max-w-sm rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <Avatar config={AGENTS[1].avatar} size={52} state="listening" floating={false} />
              <div>
                <p className="text-sm font-semibold">Mailo veut envoyer un email</p>
                <p className="text-xs text-[var(--app-muted)]">Action sensible · confirmation requise</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/12 bg-black/25 p-3 text-sm">
              <p className="text-[var(--app-muted)]">Destinataires</p>
              <p>248 contacts · segment « Fidèles »</p>
              <p className="mt-2 text-[var(--app-muted)]">Objet</p>
              <p>On t’a gardé une place au premier rang</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold">
              <span className="rounded-xl border border-white/15 py-2 text-center">Annuler</span>
              <span className="rounded-xl bg-[var(--app-accent)] py-2 text-center text-[#171a12]">Confirmer l’envoi</span>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
