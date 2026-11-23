import { useState } from 'react'
import { Avatar } from '@/components/avatar/Avatar'
import TiltedCard from '@/components/TiltedCard'
import { Reveal, Section, SectionHeading } from '@/components/ui'
import { AGENTS, type Agent } from '@/data/agents'
import { useIsLight } from '@/lib/theme'

const SKILLS: Record<string, string[]> = {
  drpro: ['Rédaction', 'Note sur 5', 'Itérations'],
  mailo: ['Objets d’emails', 'Scénarios', 'Segmentation'],
  riff: ['Ton de marque', 'Annonces', 'Live du concert']
}

export default function Agents() {
  return (
    <Section id="agents" labelledBy="agents-title">
      <SectionHeading
        id="agents-title"
        eyebrow="Rencontre l’équipe"
        title="Chaque agent a sa tête et son caractère"
        intro="Un ton, un humour, des expressions fétiches. Ils restent fidèles à eux-mêmes d’une conversation à l’autre. Clique sur une carte pour les entendre."
      />
      <ul className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
        {AGENTS.map((a, i) => (
          <li key={a.id}>
            <Reveal delay={i * 0.1}>
              <AgentCard agent={a} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function AgentCard({ agent }: { agent: Agent }) {
  const [flipped, setFlipped] = useState(false)
  const light = useIsLight()
  const face = 'flex h-full flex-col items-center justify-center rounded-[1.75rem] border border-border p-6 text-center'
  const surface = {
    background: `radial-gradient(120% 70% at 50% 0%, ${agent.color}${light ? '2e' : '38'}, transparent 70%), var(--card-solid)`
  }

  return (
    <TiltedCard
      containerHeight="400px"
      imageHeight="400px"
      imageWidth="100%"
      radius="1.75rem"
      rotateAmplitude={9}
      scaleOnHover={1.03}
      glare={light ? 0.15 : 0.3}
      shadow={0.35}
      showTooltip={false}
      gyroscope={false}
      intro={false}
      captionText={`${agent.name}, ${agent.role}. Retourner la carte`}
      flipped={flipped}
      onFlip={setFlipped}
      backContent={
        <div className={face} style={surface}>
          <Avatar config={agent.avatar} size={96} state="happy" floating={false} />
          <blockquote className="mt-5 font-display text-2xl leading-snug font-semibold text-balance">
            « {agent.line} »
          </blockquote>
          <p className="mt-4 text-sm text-muted">— {agent.name}</p>
        </div>
      }
    >
      <div className={`${face} avatar-hop`} style={surface}>
        <Avatar config={agent.avatar} size={140} />
        <h3 className="mt-3 font-display text-3xl font-extrabold">{agent.name}</h3>
        <p className="mt-1 text-muted">{agent.role}</p>
        <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Compétences">
          {SKILLS[agent.id].map((s) => (
            <li key={s} className="chip text-xs" style={{ borderColor: `${agent.color}66` }}>
              {s}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs font-medium text-muted">Clique pour l’entendre ↻</p>
      </div>
    </TiltedCard>
  )
}
