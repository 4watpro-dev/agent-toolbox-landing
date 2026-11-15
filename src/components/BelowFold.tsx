import Footer from '@/components/Footer'
import Agents from '@/components/sections/Agents'
import Demo from '@/components/sections/Demo'
import Faq from '@/components/sections/Faq'
import Features from '@/components/sections/Features'
import FinalCta from '@/components/sections/FinalCta'
import Steps from '@/components/sections/Steps'
import Trust from '@/components/sections/Trust'

/** Tout ce qui suit le hero, chargé dans un fichier séparé. */
export default function BelowFold() {
  return (
    <>
      <Demo />
      <Agents />
      <Steps />
      <Features />
      <Trust />
      <Faq />
      <FinalCta />
    </>
  )
}

export { Footer }
