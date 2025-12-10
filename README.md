# Habit Tracker 📅
*Un tracker de routines minimaliste, mobile-first, pour booster ta productivité.*

---

## 📌 Résumé
**Habit Tracker** est une application web **mobile-first** conçue pour suivre tes routines quotidiennes de manière simple et efficace.
- **Thème sombre par défaut** (avec option clair).
- **Hébergée sur [Vercel](https://vercel.com/)**.
- **Base de données** : [Supabase](https://supabase.com/) (PostgreSQL).
- **Stack technique** : Next.js (App Router), Prisma, Tailwind CSS, NextAuth.

🔗 **[Lien vers l'application](https://habit-tracker-omega-sandy.vercel.app/)** 

---

## ✨ Fonctionnalités

### 🔧 Fonctionnalités principales (MVP Alpha)
- **Gestion des comptes** :
  - Inscription et connexion sécurisées.
  - Modification et suppression du compte.
- **Création de routines** :
  - Ajout via un bouton **+**.
  - Deux types de routines :
    - **Oui/Non** : Coche pour marquer comme "fait/pas fait".
    - **Numérique** : Définis un objectif (ex: "Boire 2L d’eau/jour") et saisis ta progression quotidienne.
- **Suivi visuel** :
  - Liste des routines.
  - Interaction directe (cocher/décocher ou saisir une valeur).

### 🚀 Étape intermédiaire
- **Personnalisation** :
  - Modification/suppression des routines.
  - Fréquence personnalisée (ex: "Lundi, Mercredi, Vendredi").
  - Organisation par tags.
- **Analyse des progrès** :
  - Affichage graphique (courbes sur 7/30 jours).
  - Statistiques hebdomadaires/mensuelles.
- **Expérience utilisateur** :
  - Modal pour visualiser toutes les routines.
  - Plusieurs thèmes (sombre/clair).

### 🔮 Améliorations futures
- **Motivation visuelle** :
  - Affichage des séries en cours (ex: "5 jours d’affilée !").
  - Effets visuels dynamiques (couleurs, icônes).
- **Social** :
  - Partage de routines (lien/code, compte requis).
  - Comparaison des progrès entre utilisateurs.
- **UX avancée** :
  - Animations pour le drag & drop et les validations.
  - Export d’images de progrès (pour partager sur les réseaux).

---

## 🛠 Stack Technique

| Catégorie         | Technologie                          |
|-------------------|--------------------------------------|
| **Framework**     | Next.js 16+ (App Router)             |
| **Auth**          | NextAuth                             |
| **Thème**         | NextThemes (sombre/clair)            |
| **Base de données** | Supabase (PostgreSQL) + Prisma      |
| **Styles**        | Tailwind CSS + `cva` (variants)      |
| **Hébergement**   | Vercel                               |

---

## 📂 Structure du Projet

### Points clés
- **Modals** : Gérés via des routes interceptantes dans `@modal/`.
- **Accès à la base de données** : Centralisé dans `lib/prisma.ts` et `lib/db.ts`.
- **Authentification** : Configurée dans `app/api/auth/[...nextauth]/route.ts`.

---

## 💻 Installation Locale

### Prérequis
- Node.js (v18+).
- Compte [Supabase](https://supabase.com/) (pour la base de données).

### Étapes
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/ethan-manchon/habit-tracker.git
