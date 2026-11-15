import { Avatar } from '@/components/avatar/Avatar'
import ClickSpark from '@/components/ClickSpark'
import GradientText from '@/components/GradientText'
import { DownloadIcon } from '@/components/icons'
import { Reveal, Section } from '@/components/ui'
import { AGENTS } from '@/data/agents'
import { DOWNLOADS, useMediaQuery, usePlatform } from '@/lib/hooks'

export default function FinalCta() {
  const platform = usePlatform()
  const other = platform === 'mac' ? 'windows' : 'mac'
  const light = useMediaQuery('(prefers-color-scheme: light)')

  return (
    <Section id="telecharger" labelledBy="cta-title">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-1/2 mx-auto h-full w-3/4 rounded-full bg-[radial-gradient(closest-side,rgb(200_240_49/25%),transparent)] blur-2xl"
          />
          <div className="relative flex justify-center -space-x-4" aria-hidden="true">
            {AGENTS.map((a, i) => (
              <div key={a.id} className={i === 1 ? 'z-10 -translate-y-2' : 'opacity-90'}>
                <Avatar config={a.avatar} size={i === 1 ? 104 : 80} state="happy" />
              </div>
            ))}
          </div>
          <h2 id="cta-title" className="relative mt-6 font-display text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-6xl">
            Ton premier agent{' '}
            <GradientText
              colors={light ? ['#5c7300', '#7c5cff', '#2f6fe0', '#5c7300'] : ['#c8f031', '#a78bfa', '#7cb6ff', '#c8f031']}
              animationSpeed={6}
            >
              t’attend.
            </GradientText>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-muted">
            Deux minutes pour l’installer, une phrase pour le créer. Le reste, c’est lui qui s’en charge.
          </p>
          <div className="relative mt-9 flex flex-col items-center gap-4">
            <ClickSpark sparkColor={['#c8f031', '#a78bfa', '#7cb6ff']} sparkCount={10} sparkRadius={28}>
              <a href={DOWNLOADS[platform].href} className="btn-primary min-h-14 px-8 text-lg">
                <DownloadIcon />
                Télécharger pour {DOWNLOADS[platform].label}
              </a>
            </ClickSpark>
            <a href={DOWNLOADS[other].href} className="text-sm text-muted underline decoration-[var(--accent-line)] underline-offset-4 hover:text-text">
              Télécharger pour {DOWNLOADS[other].label}
            </a>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
