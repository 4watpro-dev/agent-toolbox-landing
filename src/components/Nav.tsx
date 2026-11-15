import { Avatar } from '@/components/avatar/Avatar'
import ThemeToggle from '@/components/ThemeToggle'
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
      <nav aria-label="Navigation principale" className="glass mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full py-1.5 pr-1.5 pl-2.5 sm:pl-3">
        <a href="#top" className="flex shrink-0 items-center gap-1 font-display text-base font-extrabold whitespace-nowrap sm:gap-1.5 sm:text-lg">
          <Avatar size={30} groundShadow={false} floating={false} />
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <a href={DOWNLOADS[platform].href} className="btn-primary min-h-9 px-3.5 text-sm sm:min-h-10 sm:px-4">
            Télécharger
          </a>
        </div>
      </nav>
    </header>
  )
}
