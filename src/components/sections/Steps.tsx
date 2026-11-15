import { Avatar } from '@/components/avatar/Avatar'
import { GlowCard, Reveal, Section, SectionHeading } from '@/components/ui'
import { AGENTS } from '@/data/agents'

export default function Steps() {
  return (
    <Section id="comment" labelledBy="steps-title">
      <SectionHeading
        id="steps-title"
        eyebrow="Comment ça marche"
        title="Trois étapes, zéro ligne de code"
        intro="Un assistant te guide de la première idée jusqu’au premier échange."
      />
      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        <Step n={1} title="Crée ton agent" text="Décris-le en une phrase. « Générer avec l’IA » remplit le reste, et tu ajustes à ta guise.">
          <div className="rounded-2xl border border-border bg-surface p-3 text-left text-sm">
            <p className="text-muted">Un agent qui transforme mes notes en newsletter…</p>
            <span className="btn-primary mt-3 min-h-9 px-3 text-xs">✦ Générer avec l’IA</span>
          </div>
        </Step>

        <Step n={2} title="Donne-lui du caractère" text="Choisis sa tête, son ton, son humour, s’il te tutoie. Il s’y tiendra.">
          <div className="space-y-3 rounded-2xl border border-border bg-surface p-3 text-left text-sm">
            <Slider label="Ton" left="Sérieux" right="Chaleureux" value={78} />
            <Slider label="Humour" left="Sobre" right="Taquin" value={62} />
            <div className="flex items-center justify-between">
              <span className="text-muted">Tutoiement</span>
              <span className="relative h-5 w-9 rounded-full bg-accent" aria-hidden="true">
                <span className="absolute top-0.5 right-0.5 size-4 rounded-full bg-[#171a12]" />
              </span>
            </div>
          </div>
        </Step>

        <Step n={3} title="Travaille avec lui" text="Il t’attend dans sa bulle, se souvient de ce qui compte et réagit à ce que tu dis.">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left text-sm">
            <Avatar config={AGENTS[1].avatar} size={56} state="happy" floating={false} />
            <p className="rounded-2xl rounded-tl-sm bg-surface-2 px-3 py-2 leading-snug">
              Bien vu pour la relance ! Je te prépare trois variantes ?
            </p>
          </div>
        </Step>
      </ol>
    </Section>
  )
}

function Step({ n, title, text, children }: { n: number; title: string; text: string; children: React.ReactNode }) {
  return (
    <li>
      <Reveal delay={(n - 1) * 0.12} className="h-full">
        <GlowCard className="flex h-full flex-col">
          <span className="grid size-10 place-items-center rounded-full bg-accent font-display text-lg font-extrabold text-accent-text" aria-hidden="true">
            {n}
          </span>
          <h3 className="mt-5 font-display text-2xl font-extrabold">
            <span className="sr-only">Étape {n} : </span>
            {title}
          </h3>
          <p className="mt-2 mb-6 leading-relaxed text-muted">{text}</p>
          <div className="mt-auto" aria-hidden="true">
            {children}
          </div>
        </GlowCard>
      </Reveal>
    </li>
  )
}

function Slider({ label, left, right, value }: { label: string; left: string; right: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>
          {left} · {right}
        </span>
      </div>
      <div className="relative mt-1.5 h-1.5 rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
        <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-[var(--card-solid)]" style={{ left: `${value}%` }} />
      </div>
    </div>
  )
}
