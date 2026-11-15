import { MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect } from 'react'
import Background from '@/components/Background'
import Hero from '@/components/Hero'
import Nav from '@/components/Nav'

const loadBelowFold = () => import('@/components/BelowFold')
const BelowFold = lazy(loadBelowFold)
const Footer = lazy(() => loadBelowFold().then((m) => ({ default: m.Footer })))

export default function App() {
  // Une fois les sections chargées, on rejoue l'ancre de l'URL (#faq, #demo…).
  useEffect(() => {
    if (!location.hash) return
    loadBelowFold().then(() =>
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView())
    )
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-text"
      >
        Aller au contenu
      </a>
      <Background />
      <Nav />
      <main id="main">
        <Hero />
        <Suspense fallback={<div className="min-h-screen" />}>
          <BelowFold />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </MotionConfig>
  )
}
