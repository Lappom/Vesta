# Vesta

Espace privé à deux pour planifier sorties, dates, tâches pratiques et moments d'intimité.

## Stack

- Next.js 16 (App Router)
- Auth.js v5 (email + mot de passe)
- Neon Postgres + Drizzle ORM
- Vercel Blob (photos)
- shadcn/ui + design system Clay (`DESIGN.md`)
- MapLibre GL (carte)

## Prérequis

- Node.js 20+
- pnpm
- Compte Vercel (CLI : `npm i -g vercel`)
- Compte GitHub

## Setup local

```bash
pnpm install
cp .env.example .env.local
# Renseigner DATABASE_URL, AUTH_SECRET, BLOB_READ_WRITE_TOKEN
pnpm db:push
pnpm db:seed
pnpm dev
```

Générer `AUTH_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Vercel

Projet lié : `luke-james-projects-ad485e15/vesta`  
URL production : https://vesta-lyart-ten.vercel.app

```bash
vercel login
vercel link --yes
vercel integration add neon
vercel env add AUTH_SECRET development
vercel env add AUTH_SECRET production
vercel env pull .env.local --yes
pnpm db:push
pnpm db:seed
vercel deploy
```

### Photos (Vercel Blob)

Créer un Blob store depuis le [dashboard Vercel](https://vercel.com/dashboard) → Storage → Blob, puis ajouter `BLOB_READ_WRITE_TOKEN` aux variables d'environnement.

## GitHub

`gh` est installé. Connectez-vous puis créez le dépôt privé :

```bash
gh auth login
gh repo create Vesta --private --source=. --remote=origin --push
```

## Scripts

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de dev (Turbopack) |
| `pnpm build` | Build production |
| `pnpm db:push` | Pousser le schéma Drizzle |
| `pnpm db:seed` | Catégories par défaut |

## Routes

- `/connexion`, `/inscription` — Auth
- `/onboarding` — Créer ou rejoindre un couple (code 6 chiffres)
- `/tableau-de-bord` — Accueil
- `/liste` — CRUD tâches partagées
- `/carte` — Carte des lieux
- `/souvenirs` — Album photos
- `/stats` — Statistiques couple
- `/parametres` — Code d'invitation, déconnexion
