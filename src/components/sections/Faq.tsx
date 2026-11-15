import { Reveal, Section, SectionHeading } from '@/components/ui'

const FAQ = [
  {
    q: 'Combien ça coûte ?',
    a: 'L’application est gratuite. Tu utilises ta propre clé API : tu ne paies que ce que tes agents consomment, directement auprès du fournisseur d’IA.'
  },
  {
    q: 'Sur quels systèmes ça marche ?',
    a: 'Sur macOS et sur Windows. La bulle flottante et le raccourci clavier fonctionnent de la même façon sur les deux.'
  },
  {
    q: 'Faut-il une clé API ?',
    a: 'Oui. Tu la colles une fois au premier lancement, elle est chiffrée sur ta machine et ne sert qu’à faire parler tes agents.'
  },
  {
    q: 'Mes données sont-elles privées ?',
    a: 'Tes agents, leurs conversations et leur mémoire sont stockés en local. Seuls les messages que tu envoies partent vers le modèle d’IA pour obtenir une réponse. Et aucune action sensible ne se fait sans ta confirmation.'
  },
  {
    q: 'Je ne sais pas coder, je peux créer un agent ?',
    a: 'Bien sûr. L’assistant te guide en quatre étapes, et « Générer avec l’IA » peut tout préremplir à partir d’une seule phrase.'
  }
]

export default function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <SectionHeading id="faq-title" eyebrow="FAQ" title="Les questions qu’on nous pose" />
      <Reveal className="mx-auto mt-12 max-w-3xl space-y-3">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="glass group rounded-2xl">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-display text-lg font-semibold">
              {q}
              <span
                className="faq-chevron grid size-8 shrink-0 place-items-center rounded-full border border-border text-xl leading-none transition-transform duration-200"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </Reveal>
    </Section>
  )
}
