# URL Shortener

Application fullstack de raccourcissement d'URLs - NestJS + Prisma + PostgreSQL côté backend, React + Vite + Tailwind côté frontend.

## Stack technique

- **Backend** : NestJS, Prisma ORM 7, PostgreSQL 18
- **Frontend** : React + Vite + Tailwind CSS
- **Tests** : Vitest (unitaires + e2e)
- **Conteneurisation** : Docker, Docker Compose


## Prérequis

- Docker et le plugin Docker Compose
- Git

## Structure du projet

```
url-shortener/
├── backend/               # NestJS + Prisma
├── frontend/              # React + Vite
├── docker-compose.yml
├── .env                   # à créer depuis .env.example
├── .env.example
└── README.md
```

## Variables d'environnement

Le projet utilise un **unique fichier `.env` à la racine**, partagé entre Docker Compose, Prisma et Vite.

1. Copiez le fichier d'exemple :
   ```bash
   cp .env.example .env
   ```
2. Adaptez les valeurs si besoin (les valeurs par défaut fonctionnent telles quelles pour un lancement local).

Variables attendues (voir `.env.example` pour le détail) :

| Variable | Rôle |
|---|---|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Initialisation du conteneur PostgreSQL |
| `DATABASE_URL` | Connexion Prisma à la base de données |
| `DOMAIN` | Préfixe utilisé pour construire l'URL courte complète renvoyée au client |
| `VITE_API_URL` | URL du backend utilisée par le frontend |

## Lancer le projet avec Docker

Depuis la racine du projet, une fois le `.env` créé :

```bash
docker compose up --build
```

Cette commande :
1. Construit les images du backend et du frontend.
2. Démarre PostgreSQL et attend qu'il soit prêt (healthcheck).
3. Démarre le backend, qui applique automatiquement les migrations Prisma avant de se lancer.
4. Démarre le frontend, servi par nginx.

Une fois démarré :
- **Frontend** : [http://localhost](http://localhost)
- **Backend (API)** : [http://localhost:3000](http://localhost:3000)

Pour arrêter :
```bash
docker compose down
```

Pour tout arrêter **et** supprimer les données de la base :
```bash
docker compose down -v
```

## Lancer le projet en local, sans Docker (développement)

Utile pour itérer rapidement sur le code sans reconstruire d'image à chaque changement.

### Base de données

Démarrez uniquement PostgreSQL via Docker :
```bash
docker compose up postgres -d
```

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

L'API est alors disponible sur [http://localhost:3000](http://localhost:3000).

### Frontend

Dans un autre terminal :
```bash
cd frontend
npm install
npm run dev
```

Le frontend est alors disponible sur l'URL affichée par Vite (généralement [http://localhost:5173](http://localhost:5173)).

## Lancer les tests

Les tests se lancent depuis le dossier `backend/`, avec PostgreSQL démarré (`docker compose up postgres -d`) pour les tests e2e.

```bash
cd backend
npm install
```

### Tests unitaires

Testent la logique métier du service de gestion des URLs de façon isolée (génération de code, gestion des collisions, erreurs), sans dépendre d'une vraie base de données.

```bash
npm run test
```

### Tests end-to-end (e2e)

Testent les routes HTTP de bout en bout (création, listing, redirection) contre une vraie instance de l'application et de la base de données.
Tout d'abord il faut changer le `DATABASE_URL` du `.env` par `"postgresql://admin:adminpsw@localhost:5432/USDatabase?schema=public"`.
Ensuite, si vous avez effacé les données de la base il faut remigrer le schéma prisma:
```bash
npx prisma migrate dev
```
Et maintenant vous pouvez finalement lancer les tests:

```bash
npm run test:e2e
```

## Fonctionnalités

- Création d'une URL raccourcie à partir d'une URL longue (validation du format, protocoles `http`/`https` uniquement)
- Redirection vers l'URL d'origine via le code court
- Liste de toutes les URLs raccourcies créées
