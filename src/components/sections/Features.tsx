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
    title: 'Une question, sans quitter ton app',
    text: 'Un raccourci ouvre la palette au centre de l’écran. Tu choisis l’agent, tu demandes, tu copies la réponse. Ou tu continues dans le panneau.',
    icon: I('M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z'),
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
    title: 'Des tâches qui tournent seules',
    text: 'Une consigne, des jours, une heure. Le résultat t’attend dans une conversation, avec une notification. Et ton fantôme fait la fête.',
    icon: I('M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 9 2 2 4-4'),
    color: '#8e5cf6'
  },
  {
    title: 'Fichiers et documents',
    text: 'Glisse une image, un PDF ou un texte dans la conversation. Ou donne à un agent son propre dossier de documents, en lecture seule.',
    icon: I('M21 11.5 12.6 19.9a5.5 5.5 0 0 1-7.8-7.8L13.2 3.7a3.7 3.7 0 0 1 5.2 5.2L10 17.3a1.8 1.8 0 0 1-2.6-2.6L15 7.1'),
    color: '#6fb4ff'
  },
  {
    title: 'Outils et connecteurs',
    text: 'Recherche et lecture web limitées aux sites de confiance que tu choisis. Tes applications métier se branchent via MCP, en un clic avec ton compte, et se débranchent depuis la fiche de l’agent.',
    icon: I('M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5'),
    color: '#2e9e6b',
    className: 'md:col-span-2'
  },
  {
    title: 'Un historique qui se retrouve',
    text: 'Cherche un mot, il retrouve la conversation. Épingle celles qui comptent, exporte-les en Markdown.',
    icon: I('M12 8v4l2.5 2.5M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 4v4.5H8'),
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
