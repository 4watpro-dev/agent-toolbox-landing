import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const root = (): HTMLElement => document.documentElement

/**
 * Le thème vit dans l'attribut `data-theme` de <html>. Un script dans index.html
 * le pose avant le premier affichage avec la même règle que `resolve()`.
 *
 * Sombre par défaut. Sur mobile (< 768 px) il n'y a pas de switch : toujours sombre.
 * Sur grand écran, le choix enregistré l'emporte.
 */
const MOBILE = '(max-width: 767px)'

function resolve(): Theme {
  if (window.matchMedia(MOBILE).matches) return 'dark'
  return savedTheme() ?? 'dark'
}

function read(): Theme {
  return root().dataset.theme === 'light' ? 'light' : 'dark'
}

/** Composants abonnés au thème : prévenus directement à chaque changement. */
const listeners = new Set<() => void>()

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)

  // Passage mobile ↔ grand écran : on recalcule.
  const mobile = window.matchMedia(MOBILE)
  const onMedia = (): void => {
    const next = resolve()
    if (next !== read()) apply(next)
  }
  mobile.addEventListener('change', onMedia)

  return () => {
    listeners.delete(onChange)
    mobile.removeEventListener('change', onMedia)
  }
}

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function apply(theme: Theme): void {
  root().dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6f7f4' : '#0e1014')
  listeners.forEach((notify) => notify())
}

/**
 * Bascule de thème. Avec les View Transitions du navigateur, l'ancienne et la nouvelle
 * page sont capturées en images et le nouveau thème s'ouvre en cercle depuis le bouton :
 * une seule animation accélérée, au lieu de recalculer chaque élément à chaque image.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Stockage indisponible (navigation privée…) : le choix vaut pour cette visite.
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || typeof document.startViewTransition !== 'function') {
    apply(theme)
    return
  }

  // flushSync : React redessine tout de suite les composants qui lisent le thème,
  // pour que la capture « après » soit complète (l'affichage est suspendu pendant ce temps).
  const transition = document.startViewTransition(() => flushSync(() => apply(theme)))

  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? 0
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  void transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
    )
  })
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => 'dark')
}

export const useIsLight = (): boolean => useTheme() === 'light'
