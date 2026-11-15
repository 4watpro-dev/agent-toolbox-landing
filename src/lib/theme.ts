import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const root = (): HTMLElement => document.documentElement

/**
 * Le thème vit dans l'attribut `data-theme` de <html>. Un script dans index.html
 * le pose avant le premier affichage : choix enregistré, sinon thème du système.
 */
function read(): Theme {
  return root().dataset.theme === 'light' ? 'light' : 'dark'
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(root(), { attributes: true, attributeFilter: ['data-theme'] })

  // Tant que le visiteur n'a rien choisi, on suit le système.
  const system = window.matchMedia('(prefers-color-scheme: light)')
  const onSystem = (): void => {
    if (!savedTheme()) apply(system.matches ? 'light' : 'dark')
  }
  system.addEventListener('change', onSystem)

  return () => {
    observer.disconnect()
    system.removeEventListener('change', onSystem)
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
