import { useEffect, type ReactNode } from 'react'
import { Avatar } from '@/components/avatar/Avatar'
import { AGENTS } from '@/data/agents'

/** Coordonnées du responsable du traitement, affichées publiquement. */
const CONTROLLER = 'Maxime Fauveau'
const CONTACT_EMAIL = '4wat.pro@gmail.com'
const UPDATED = '23 novembre 2026'

export default function Privacy() {
  // La page est rendue après le chargement : on rejoue l'ancre de l'URL (#contact).
  useEffect(() => {
    if (!location.hash) return
    const go = (): void => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant' })
    // Après le rendu, puis une fois les polices chargées (la hauteur de la page change).
    requestAnimationFrame(go)
    void document.fonts?.ready.then(go)
  }, [])

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6 sm:pt-40">
      <div className="flex items-center gap-3">
        <Avatar config={AGENTS[0].avatar} size={56} state="happy" floating={false} />
        <p className="text-sm font-semibold tracking-wide text-accent-ink uppercase">Confidentialité</p>
      </div>
      <h1 className="mt-4 font-display text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
        Ce qu’on fait de tes données (presque rien)
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Ce site sert à présenter Agent Toolbox et à prévenir les personnes intéressées de son lancement. Voici tout ce qu’il
        collecte, pourquoi, et comment le faire effacer.
      </p>
      <p className="mt-2 text-sm text-muted">Dernière mise à jour : {UPDATED}</p>

      <div className="glass mt-10 space-y-10 rounded-[2rem] p-6 sm:p-10">
        <Block title="Qui est responsable ?">
          <p>
            Le responsable du traitement est <strong className="text-text">{CONTROLLER}</strong>, éditeur d’Agent Toolbox. Pour toute
            question sur tes données : <MailLink />.
          </p>
        </Block>

        <Block title="Ce qu’on collecte">
          <ul>
            <li>
              <strong className="text-text">Ton adresse e-mail</strong>, seulement si tu t’inscris à la liste d’attente. Rien d’autre
              n’est demandé.
            </li>
            <li>
              <strong className="text-text">Des données techniques de connexion</strong> (adresse IP, navigateur, date), enregistrées
              par notre hébergeur pour faire fonctionner et sécuriser le site.
            </li>
          </ul>
          <p>
            Pas de compte, pas de cookie publicitaire, pas d’outil de mesure d’audience. Le site garde seulement, dans ton navigateur,
            ton choix de thème clair ou sombre ; cette préférence ne nous est jamais envoyée.
          </p>
        </Block>

        <Block title="Pourquoi">
          <p>
            Ton e-mail sert à une seule chose : <strong className="text-text">t’écrire le jour du lancement</strong> d’Agent Toolbox.
            Il n’est ni vendu, ni prêté, ni utilisé pour autre chose. Ce traitement repose sur ton consentement, que tu donnes en
            t’inscrivant et que tu peux retirer à tout moment.
          </p>
        </Block>

        <Block title="Combien de temps">
          <p>
            Ton adresse est gardée jusqu’au lancement, puis supprimée au plus tard trois mois après l’envoi de l’e-mail de lancement.
            Si tu demandes à être retiré de la liste avant, elle est supprimée sous 30 jours.
          </p>
        </Block>

        <Block title="Qui d’autre y a accès">
          <ul>
            <li>
              <strong className="text-text">Netlify</strong> héberge le site et reçoit les inscriptions à la liste d’attente. Cette
              société, établie aux États-Unis, agit pour notre compte ; les transferts hors de l’Union européenne sont encadrés par
              les garanties prévues par le RGPD.
            </li>
            <li>
              <strong className="text-text">Google Fonts</strong> fournit les polices du site. Pour les afficher, ton navigateur
              contacte les serveurs de Google, qui reçoivent ton adresse IP.
            </li>
          </ul>
          <p>Personne d’autre.</p>
        </Block>

        <Block title="Tes droits" id="contact">
          <p>
            Tu peux à tout moment accéder à tes données, les corriger, les faire effacer, retirer ton consentement ou t’opposer à leur
            utilisation. Il suffit d’écrire à <MailLink />, depuis l’adresse inscrite de préférence. Réponse sous 30 jours au plus.
          </p>
          <p>
            Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la CNIL (
            <a href="https://www.cnil.fr" className="underline decoration-[var(--accent-line)] underline-offset-4 hover:text-text">
              cnil.fr
            </a>
            ).
          </p>
        </Block>

        <Block title="Et l’application ?">
          <p>
            Cette page concerne le site. L’application Agent Toolbox, elle, garde tes agents, tes conversations et leur mémoire sur ton
            Mac ; seuls les messages que tu envoies partent vers le modèle d’IA pour obtenir une réponse. Sa propre politique sera
            publiée au lancement.
          </p>
        </Block>
      </div>

      <p className="mt-10 text-center">
        <a href="/" className="btn-ghost">
          ← Retour à l’accueil
        </a>
      </p>
    </main>
  )
}

function Block({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-28">
      <h2 id={id ? `${id}-title` : undefined} className="font-display text-2xl font-extrabold">
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:size-2 [&_li]:before:rounded-full [&_li]:before:bg-accent [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  )
}

function MailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-text underline decoration-[var(--accent-line)] underline-offset-4">
      {CONTACT_EMAIL}
    </a>
  )
}
