
# Application de suivi de routines

> Ce projet utilise le starter Next.js + NextAuth ([voir le template d'origine](https://github.com/rezahedi/nextjs-nextauth-starter)).

## Présentation

Application web minimaliste (mobile-first, thème sombre) pour le suivi de routines quotidiennes, hébergée sur Vercel et utilisant Supabase comme base de données. L’interface est pensée pour la simplicité et l’efficacité.

## Fonctionnalités principales

- **Calendrier** : Affichage des jours jusqu’à aujourd’hui pour visualiser la progression.
- **Gestion des comptes** : Inscription, connexion, modification et suppression du compte utilisateur.
- **Ajout de routine** :
  - Bouton « + » pour créer une routine
  - Deux types :
	 - Oui/Non (fait/pas fait)
	 - Numérique (objectif chiffré + unité, saisie quotidienne)
- **Affichage des routines** :
  - Liste simple et espace dédié à la visualisation
  - Suivi par coche (Oui/Non) ou saisie de valeur (Numérique)

## Fonctionnalités avancées (v1.0+)

- Modification/suppression de routine
- Configuration de la fréquence (jours affichés, nombre de fois/jour)
- Drag & drop pour réorganiser
- Affichage graphique de la progression (par type de routine)
- Organisation par tags et tri

## Améliorations futures

- Graphiques de progrès (7/30 jours)
- Affichage de séries (ex : « 5 jours d’affilée »)
- Personnalisation des thèmes et couleurs
- Partage et comparaison entre utilisateurs
- Statistiques avancées et export d’images

## Stack technique

- **Next.js** (front + API)
- **NextAuth** (authentification)
- **Supabase** (base de données)
- **Prisma** (ORM)
- **Tailwind CSS** (UI)

## Installation & développement

1. Copier `.env.example` en `.env` et compléter les variables (voir Supabase, NextAuth, etc.)
2. Installer les dépendances :
	```bash
	npm install
	```
3. Lancer le serveur de développement :
	```bash
	npm run dev
	```
4. Lancer les migrations Prisma si besoin :
	```bash
	npx prisma migrate dev
	```

---
Pour toute question, se référer au fichier `CONSIGNES.md` ou contacter l’équipe projet.

I made this project to help me understand how to use Next.js 13 APP Router structure and how to setup NextAuth, also to have a simple starter template for my future projects that need authentication.

## Upcoming actions:

- Implement authorization for API routes.
- Utilize the Prisma provider for efficient token and user management.
- Incorporate a secure Login with email / password functionality.
