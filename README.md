# Habit Tracker — README

Résumé rapide  
Application mobile-first de suivi de routines, minimaliste et orientée productivité. Thème sombre par défaut. Hébergée sur Vercel, base de données Supabase (Postgres). Front et API en Next.js (App Router).

## Principales fonctionnalités (MVP)
- Calendrier des jours jusqu'à aujourd'hui.
- Gestion des comptes : inscription, login, modification et suppression.
- Ajout de routine via bouton "+" :
	- Oui/Non : bascule fait / pas fait.
	- Numérique : objectif (int + unité) et saisie quotidienne de valeur.
- Affichage : liste simple + espace principal pour routines.
- Suivi : cocher/décocher ou saisir une valeur selon type de routine.

## Version 1.0 — Fonctionnalités avancées
- Modification / suppression de routine via paramètres.
- Fréquence : sélection de jours (ex. en semaine, 1 jour sur 2) et nombre de fois par jour.
- Réorganisation par drag & drop.
- Visualisation graphique :
	- Oui/Non : progression par jour.
	- Numérique : valeurs journalières.
- Organisation : tags, tri par tag ou mot-clé.

## Roadmap — Améliorations futures
- v1.1 : graphiques de progrès (7/30 jours), affichage de la série en cours, effets visuels, personnalisation basique des thèmes.
- v1.2 : partage de routines, comparaison entre utilisateurs, animations UX.
- v1.3 : thèmes multiples, statistiques hebdo/mensuelles, export visuel des progrès.

## Stack technique
- Framework : Next.js 13+ (App Router)
- Auth : NextAuth
- Base de données : Supabase (Postgres) — utilisable via Prisma
- ORM : Prisma
- Styles : Tailwind CSS
- Hébergement : Vercel

## Structure & conventions (points clés)
- Routes principales : app/(home)/ et app/(admin)/admin/
- CRUD posts admin : app/(admin)/admin/posts/ avec modals et server actions
- Modals : interception via dossiers `@modal/` et routes interceptantes
- DB access : centralisé dans lib/prisma.ts / db.ts
- Auth API : app/api/auth/[...nextauth]/route.ts

## Installation locale
1. Cloner le dépôt
2. Installer : npm install
3. Copier .env.example → .env et remplir :
	 - NEXTAUTH_URL, NEXTAUTH_SECRET
	 - DATABASE_URL (Supabase Postgres)
	 - Variables Supabase/Provider si nécessaire
4. Migration Prisma : npx prisma migrate dev
5. Lancer : npm run dev

## Déploiement
- Plateforme recommandée : Vercel
- Configurer les variables d'environnement sur Vercel (mêmes clés que .env).
- Supabase : fournir l'URL + clé privée (ou connexion Postgres pour Prisma).

## Contribution
- Ouvrir issues pour bugs/feature requests.
- PRs : branch par feature, tests simples et description claire.
- Respecter les conventions de routing et les patterns de modals/server actions.

License
- À préciser (ex. MIT) dans le dépôt.

---

Fichier de référence : suivre README et structure indiquée dans le dossier `app/` pour ajouter modals, server actions et routes admin.