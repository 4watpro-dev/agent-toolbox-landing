import { Avatar } from '@/components/avatar/Avatar'
import ClickSpark from '@/components/ClickSpark'
import GradientText from '@/components/GradientText'
import { Reveal, Section } from '@/components/ui'
import { AGENTS } from '@/data/agents'
import Waitlist from '@/components/Waitlist'
import { useIsLight } from '@/lib/theme'

export default function FinalCta() {
  const light = useIsLight()

  return (
    <Section id="lancement" labelledBy="cta-title">
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
            Laisse ton e-mail : on te prévient dès que l’app est prête pour ton Mac. Ensuite, une phrase suffit pour créer ton premier agent.
          </p>
          <div className="relative mt-9">
            <ClickSpark sparkColor={['#c8f031', '#a78bfa', '#7cb6ff']} sparkCount={10} sparkRadius={28}>
              <Waitlist size="lg" align="center" />
            </ClickSpark>
            <p className="mt-4 text-sm text-muted">Un seul e-mail, le jour du lancement. Pas de spam, promis.</p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
