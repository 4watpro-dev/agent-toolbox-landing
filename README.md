# Agent Toolbox : landing page

Page de présentation d'Agent Toolbox, en une seule page.
Vite + React + TypeScript + Tailwind CSS v4, animations `motion` et composants [React Bits](https://reactbits.dev) (variantes TS-TW).

## Installation

```bash
npm install
```

Node 20 ou plus récent.

## Lancement en local

```bash
npm run dev
```

La page s'ouvre sur http://localhost:5173.

## Build de production

```bash
npm run build
npm run preview   # sert le dossier dist/ pour vérifier le build
```

Le résultat est dans `dist/`, un site 100 % statique.

## Déploiement

**Vercel** : importe le dépôt, Vercel détecte Vite tout seul (build `npm run build`, sortie `dist`). Ou en ligne de commande :

```bash
npx vercel --prod
```

**Netlify** : build `npm run build`, dossier de publication `dist`. Ou en ligne de commande :

```bash
npx netlify deploy --prod --dir=dist
```

## Avant la mise en ligne

- **Liens de téléchargement** : remplace les ancres provisoires dans `src/lib/hooks.ts` (`DOWNLOADS`).
- **Image de partage** : ajoute `public/og-image.png` (1200 × 630), référencée dans `index.html`.
- **Pied de page** : les liens Confidentialité et Contact pointent vers des ancres provisoires (`src/components/Footer.tsx`).

## Où modifier quoi

| Quoi | Fichier |
|---|---|
| Agents (nom, rôle, réplique, couleurs, avatar) | `src/data/agents.ts` |
| Couleurs, verre, thème clair/sombre | `src/index.css` |
| Avatar fantôme (copié de l'app Agent Toolbox, avec une prop `look` en plus) | `src/components/avatar/` |
| Sections | `src/components/Hero.tsx`, `src/components/sections/*` |
| Composants React Bits | `src/components/*.tsx` (ajoutés avec `npx shadcn@latest add @react-bits/<Nom>-TS-TW`) |

## Performance et accessibilité

- Fond Aurora (WebGL) chargé en différé, seulement sur grand écran et sans mouvement réduit.
- Flou d'arrière-plan réservé aux écrans ≥ 768 px : sur mobile il bloquait le rendu.
- Sections sous le hero dans un fichier JS séparé, polices non bloquantes.
- `prefers-reduced-motion` respecté partout (`MotionConfig reducedMotion="user"` et media queries CSS).
- Lighthouse (build local) : mobile 98 / 100 / 100 / 100, bureau 100 / 100 / 100 / 100.
