import { useId, useState, type FormEvent } from 'react'

/**
 * Liste d'attente du lancement. Envoi via Netlify Forms : le formulaire statique
 * « lancement » déclaré dans index.html permet à Netlify de le détecter au build.
 * Sur un autre hébergeur, branche WAITLIST_ENDPOINT vers ton outil (Brevo, etc.).
 */
const WAITLIST_ENDPOINT = '/'
const FORM_NAME = 'lancement'

type Status = 'idle' | 'sending' | 'done' | 'error'

export default function Waitlist({ size = 'md', align = 'start' }: { size?: 'md' | 'lg'; align?: 'start' | 'center' }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    setStatus('sending')
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString()
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      })
      setStatus(response.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const big = size === 'lg'
  const justify = align === 'center' ? 'justify-center' : 'justify-center lg:justify-start'

  if (status === 'done') {
    return (
      <p role="status" className={`flex items-center gap-2 font-medium text-text ${justify}`}>
        <span className="grid size-6 place-items-center rounded-full bg-accent text-xs font-bold text-accent-text" aria-hidden="true">
          ✓
        </span>
        C’est noté ! On t’écrit le jour du lancement, et c’est tout.
      </p>
    )
  }

  return (
    <form
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className={`flex w-full flex-col flex-wrap gap-3 sm:flex-row ${justify} ${align === 'center' ? 'mx-auto max-w-lg' : 'max-w-lg'}`}
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          Ne pas remplir : <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label htmlFor={`${id}-email`} className="sr-only">
        Ton adresse e-mail
      </label>
      <input
        id={`${id}-email`}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="ton@email.fr"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`min-w-0 flex-1 rounded-full border border-border bg-surface px-5 text-text placeholder:text-muted focus:border-[var(--accent-line)] focus:outline-none ${big ? 'min-h-14 text-lg' : 'min-h-12'}`}
      />
      <button type="submit" disabled={status === 'sending'} className={`btn-primary ${big ? 'min-h-14 px-8 text-lg' : ''}`}>
        {status === 'sending' ? 'Envoi…' : 'Être prévenu du lancement'}
      </button>
      <p className={`text-xs text-muted sm:basis-full ${align === 'center' ? 'text-center' : 'text-center lg:text-left'}`}>
        Un seul e-mail, le jour du lancement. Désinscription à tout moment.{' '}
        <a href="/confidentialite/" className="underline decoration-[var(--accent-line)] underline-offset-4 hover:text-text">
          Confidentialité
        </a>
      </p>
      {status === 'error' && (
        <p role="alert" className="text-sm text-muted sm:basis-full">
          Oups, l’inscription n’est pas passée. Réessaie dans un instant.
        </p>
      )}
    </form>
  )
}
