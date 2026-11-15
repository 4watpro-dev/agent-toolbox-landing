import type { ReactNode } from 'react'
import { Avatar } from '@/components/avatar/Avatar'
import { GlowCard, Kbd, Reveal, Section, SectionHeading } from '@/components/ui'
import { AGENTS } from '@/data/agents'

interface Tile {
  title: string
  text: string
  icon: ReactNode
  color: string
  className?: string
  extra?: ReactNode
}

const I = (d: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

const TILES: Tile[] = [
  {
    title: 'Une bulle, un raccourci',
    text: 'Ta galerie d’agents s’ouvre d’un clic sur l’icône flottante, ou d’un raccourci clavier depuis n’importe quelle app.',
    icon: I('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5v4l3 2'),
    color: '#c8f031',
    className: 'md:col-span-2',
    extra: (
      <div className="mt-6 flex flex-wrap items-center gap-2" aria-hidden="true">
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>Espace</Kbd>
        <span className="ml-2 flex -space-x-3">
          {AGENTS.map((a) => (
            <span key={a.id} className="grid size-11 place-items-center rounded-full border border-border bg-[var(--card-solid)]">
              <Avatar config={a.avatar} size={32} groundShadow={false} floating={false} />
            </span>
          ))}
        </span>
      </div>
    )
  },
  {
    title: 'Création guidée',
    text: 'Identité, apparence, personnalité, compétences : quatre étapes, ou une seule phrase avec « Générer avec l’IA ».',
    icon: I('M12 3v3m0 12v3M3 12h3m12 0h3M6 6l2 2m8 8 2 2M6 18l2-2m8-8 2-2'),
    color: '#8b5cf6'
  },
  {
    title: 'Des personnalités vivantes',
    text: 'Avatars animés qui clignent, réfléchissent et changent d’expression selon le ton de leurs réponses.',
    icon: I('M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z'),
    color: '#5b9dff'
  },
  {
    title: 'Outils et connecteurs',
    text: 'Recherche web limitée aux sites de confiance que tu choisis, et connexion à tes applications métier via MCP.',
    icon: I('M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5'),
    color: '#3fae5e',
    className: 'md:col-span-2'
  },
  {
    title: 'Toujours ton feu vert',
    text: 'Envoyer, modifier, supprimer : toute action sensible attend ta confirmation explicite.',
    icon: I('M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4'),
    color: '#f2c14e'
  },
  {
    title: 'Chez toi, et chiffré',
    text: 'Tes données restent sur ta machine, ta clé API est chiffrée, et la mémoire de chaque agent est visible et modifiable.',
    icon: I('M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5V11Zm7 4v2'),
    color: '#ff8a65',
    className: 'lg:col-span-2'
  }
]

export default function Features() {
  return (
    <Section id="fonctionnalites" labelledBy="features-title">
      <SectionHeading
        id="features-title"
        eyebrow="Fonctionnalités"
        title="Tout ce qu’il faut, rien qui encombre"
      />
      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t, i) => (
          <li key={t.title} className={t.className}>
            <Reveal delay={(i % 3) * 0.08} className="h-full">
              <GlowCard color={t.color} className="h-full">
                <span
                  className="grid size-11 place-items-center rounded-xl border border-border"
                  style={{ color: t.color, background: `${t.color}1f` }}
                >
                  {t.icon}
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold">{t.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{t.text}</p>
                {t.extra}
              </GlowCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
