import type { AvatarConfig } from '@/lib/avatar'

export interface Agent {
  id: string
  name: string
  role: string
  /** Ce que l'agent prend en charge, pour le titre du hero : « Des agents IA pour … ». */
  topic: string
  /** Une réplique dans sa propre voix. */
  line: string
  avatar: AvatarConfig
  /** Lueur des cartes : la teinte du corps. */
  color: string
}

export const AGENTS: Agent[] = [
  {
    id: 'drpro',
    name: 'DRpro',
    role: 'Créateur de prompts',
    topic: 'tes prompts',
    line: '3 étoiles sur 5. Pas mal… mais on peut faire mieux. On y retourne ?',
    avatar: { bodyColor: '#8b5cf6', glowColor: '#ffffff', eyeStyle: 'oval', accessory: 'none', shape: 'drop' },
    color: '#8b5cf6'
  },
  {
    id: 'mailo',
    name: 'Mailo',
    role: 'Stratège CRM et emailing',
    topic: 'tes campagnes',
    line: 'Ton objet d’email est trop sage. J’en ai trois qui donnent envie de cliquer.',
    avatar: { bodyColor: '#3fae5e', glowColor: '#fdf6c8', eyeStyle: 'oval', accessory: 'none', shape: 'classic' },
    color: '#3fae5e'
  },
  {
    id: 'riff',
    name: 'Riff',
    role: 'Community manager événementiel',
    topic: 'tes posts',
    line: 'Date annoncée, billets en vente : je chauffe la salle dès ce soir.',
    avatar: { bodyColor: '#5b9dff', glowColor: '#ffffff', eyeStyle: 'oval', accessory: 'none', shape: 'quiff' },
    color: '#5b9dff'
  }
]
