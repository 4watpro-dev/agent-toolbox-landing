import { lazy, Suspense, useEffect, useState } from 'react'
import { useMediaQuery, useReducedMotion } from '@/lib/hooks'
import { useIsLight } from '@/lib/theme'

const Aurora = lazy(() => import('./Aurora'))

/**
 * Fond unique de la page. Un dégradé CSS s'affiche tout de suite ; l'Aurora WebGL
 * arrive ensuite, seulement sur grand écran et sans mouvement réduit.
 */
export default function Background() {
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 768px)')
  const light = useIsLight()
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600))
    const id = ric(() => setIdle(true))
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: light
            ? 'radial-gradient(60% 50% at 80% 0%, rgb(200 240 49 / 22%), transparent 70%), radial-gradient(50% 45% at 10% 10%, rgb(139 92 246 / 14%), transparent 70%)'
            : 'radial-gradient(60% 50% at 80% 0%, rgb(200 240 49 / 12%), transparent 70%), radial-gradient(50% 45% at 10% 10%, rgb(139 92 246 / 18%), transparent 70%)'
        }}
      />
      {idle && wide && !reduced && (
        <Suspense fallback={null}>
          <div className="absolute inset-x-0 top-0 h-[85vh] opacity-40">
            <Aurora
              colorStops={light ? ['#d9f77a', '#c4b5fd', '#9fd4ff'] : ['#5b3fd6', '#c8f031', '#2f6fe0']}
              amplitude={0.9}
              blend={0.6}
              speed={0.6}
              lightMode={light}
              dpr={1}
            />
          </div>
        </Suspense>
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[var(--bg)]" />
    </div>
  )
}
