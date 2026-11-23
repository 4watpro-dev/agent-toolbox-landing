import { MotionConfig } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Background from '@/components/Background'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import Privacy from '@/pages/Privacy'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <Background />
      <Nav />
      <Privacy />
      <Footer />
    </MotionConfig>
  </StrictMode>
)

