import { Avatar } from '@/components/avatar/Avatar'
import { DOWNLOADS, usePlatform } from '@/lib/hooks'

const LINKS = [
  { href: '#demo', label: 'Démo' },
  { href: '#agents', label: 'Les agents' },
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#faq', label: 'FAQ' }
]

export default function Nav() {
  const platform = usePlatform()
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4">
      <nav aria-label="Navigation principale" className="glass mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full py-1.5 pr-1.5 pl-3">
        <a href="#top" className="flex items-center gap-1.5 font-display text-lg font-extrabold">
          <Avatar size={34} groundShadow={false} floating={false} />
          Agent Toolbox
        </a>
        <ul className="hidden items-center gap-1 text-sm text-muted md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3 py-2 transition-colors hover:bg-surface-2 hover:text-text">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={DOWNLOADS[platform].href} className="btn-primary min-h-10 px-4 text-sm">
          Télécharger
        </a>
      </nav>
    </header>
  )
}
