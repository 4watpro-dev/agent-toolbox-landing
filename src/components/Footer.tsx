import { Avatar } from '@/components/avatar/Avatar'

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:px-6">
        <p className="flex items-center gap-2">
          <Avatar size={28} groundShadow={false} floating={false} />
          <span>
            <strong className="font-display text-text">Agent Toolbox</strong> · © {new Date().getFullYear()}
          </span>
        </p>
        <nav aria-label="Pied de page">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <li><a href="/#faq" className="hover:text-text">FAQ</a></li>
            <li><a href="/confidentialite/" className="hover:text-text">Confidentialité</a></li>
            <li><a href="/confidentialite/#contact" className="hover:text-text">Contact</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
