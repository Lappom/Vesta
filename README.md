# Vesta

Espace privé à deux pour planifier sorties, dates, tâches du quotidien et moments de couple.

## Fonctionnalités

- **Espace couple** — Création ou rattachement via un code d'invitation à 6 chiffres
- **Liste partagée** — Tâches catégorisées, assignation, échéances et notifications
- **Carte** — Lieux repérés sur une carte interactive (MapLibre GL)
- **Souvenirs** — Album photo privé (stockage Vercel Blob)
- **Statistiques** — Vue d'ensemble de l'activité du couple
- **Tableau de bord** — Prochains événements et rappels en un coup d'œil

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Auth | [Auth.js v5](https://authjs.dev/) (email + mot de passe) |
| Base de données | [Neon Postgres](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/) |
| Stockage | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| UI | [shadcn/ui](https://ui.shadcn.com/) + design system Clay ([`DESIGN.md`](./DESIGN.md)) |
| Carte | [MapLibre GL](https://maplibre.org/) |

## Prérequis

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/)
- Une base Postgres (Neon recommandé)
- Un store Blob Vercel pour les photos (optionnel en local si vous n'utilisez pas `/souvenirs`)

## Installation locale

```bash
git clone https://github.com/<votre-org>/Vesta.git
cd Vesta
pnpm install
cp .env.example .env.local
```

Renseignez les variables dans `.env.local`, puis initialisez la base :

```bash
pnpm db:push
pnpm db:seed
pnpm dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

### Variables d'environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion Postgres (Neon ou autre) |
| `AUTH_SECRET` | Secret de session Auth.js (voir ci-dessous) |
| `AUTH_URL` | URL de l'app en dev (`http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'app |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob pour l'album photo |

Générer `AUTH_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Déploiement sur Vercel

1. Importez le dépôt sur [Vercel](https://vercel.com/new).
2. Ajoutez l'intégration [Neon](https://vercel.com/integrations/neon) pour provisionner `DATABASE_URL`.
3. Définissez `AUTH_SECRET` et `NEXT_PUBLIC_APP_URL` pour chaque environnement.
4. Créez un store Blob privé et liez `BLOB_READ_WRITE_TOKEN` :

   ```bash
   vercel blob create-store <nom-du-store> --access private --yes \
     --environment production --environment preview --environment development
   ```

5. Après le premier déploiement, exécutez les migrations et le seed :

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

## Scripts

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de développement (Turbopack) |
| `pnpm build` | Build de production |
| `pnpm start` | Serveur de production local |
| `pnpm lint` | Lint ESLint |
| `pnpm db:push` | Appliquer le schéma Drizzle |
| `pnpm db:seed` | Insérer les catégories par défaut |
| `pnpm db:generate` | Générer les migrations Drizzle |

## Structure des routes

| Route | Description |
|-------|-------------|
| `/connexion`, `/inscription` | Authentification |
| `/onboarding` | Créer ou rejoindre un couple |
| `/tableau-de-bord` | Accueil |
| `/liste` | Gestion des tâches partagées |
| `/carte` | Carte des lieux |
| `/souvenirs` | Album photos |
| `/stats` | Statistiques du couple |
| `/parametres` | Code d'invitation, déconnexion |

## Contribution

Les issues et pull requests sont les bienvenues. Pour une modification importante, ouvrez d'abord une issue pour en discuter.

1. Forkez le dépôt
2. Créez une branche (`git checkout -b feat/ma-fonctionnalite`)
3. Committez vos changements
4. Ouvrez une pull request

## Licence

Ce projet est distribué sous licence à préciser. Consultez le fichier `LICENSE` du dépôt.
