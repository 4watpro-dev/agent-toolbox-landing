import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (): void => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useReducedMotion = (): boolean => useMediaQuery('(prefers-reduced-motion: reduce)')

export type Platform = 'mac' | 'windows'

/** Système du visiteur, pour afficher le bon bouton de téléchargement. macOS par défaut. */
export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>('mac')
  useEffect(() => {
    if (/Win/i.test(navigator.userAgent)) setPlatform('windows')
  }, [])
  return platform
}

/** Liens de téléchargement : à remplacer par les vraies URL de release. */
export const DOWNLOADS: Record<Platform, { label: string; href: string }> = {
  mac: { label: 'macOS', href: '#telecharger-mac' },
  windows: { label: 'Windows', href: '#telecharger-windows' }
}
