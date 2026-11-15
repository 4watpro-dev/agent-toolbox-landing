import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const root = (): HTMLElement => document.documentElement

/**
 * Le thème vit dans l'attribut `data-theme` de <html>. Un script dans index.html
 * le pose avant le premier affichage avec la même règle que `resolve()`.
 *
 * Sur mobile (< 768 px) il n'y a pas de switch : on suit toujours le système.
 * Sur grand écran, le choix enregistré l'emporte, sinon on suit le système.
 * Sans préférence système exprimée, le sombre est la valeur par défaut.
 */
const MOBILE = '(max-width: 767px)'
const SYSTEM_LIGHT = '(prefers-color-scheme: light)'

function resolve(): Theme {
  const saved = window.matchMedia(MOBILE).matches ? null : savedTheme()
  return saved ?? (window.matchMedia(SYSTEM_LIGHT).matches ? 'light' : 'dark')
}

function read(): Theme {
  return root().dataset.theme === 'light' ? 'light' : 'dark'
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(root(), { attributes: true, attributeFilter: ['data-theme'] })

  // Changement du thème système, ou passage mobile ↔ grand écran : on recalcule.
  const queries = [window.matchMedia(SYSTEM_LIGHT), window.matchMedia(MOBILE)]
  const onMedia = (): void => {
    const next = resolve()
    if (next !== read()) apply(next)
  }
  queries.forEach((q) => q.addEventListener('change', onMedia))

  return () => {
    observer.disconnect()
    queries.forEach((q) => q.removeEventListener('change', onMedia))
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
}

export function setTheme(theme: Theme): void {
  // Fondu des couleurs le temps de la bascule seulement.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) {
    root().classList.add('theme-transition')
    window.setTimeout(() => root().classList.remove('theme-transition'), 300)
  }
  apply(theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Stockage indisponible (navigation privée…) : le choix vaut pour cette visite.
  }
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => 'dark')
}

export const useIsLight = (): boolean => useTheme() === 'light'
