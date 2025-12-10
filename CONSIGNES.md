# Fonctionnalités de l'application de suivi de routines

## 1. Initialisation & Hébergement

- **Hébergement** : Vercel
- **Base de donnée** : Supabase
- **Interface** : Minimaliste, mobile-first, thème sombre par défaut
- **Stack**: Front et API en nextJS

---

## 2. Fonctionnalités principales implémentées

### 2.1 Calendrier & Affichage

- Calendrier des jours jusqu'à aujourd'hui

### 2.2 MVP Alpha – Gestion et affichage des routines

- **Gestion des comptes**
    - Inscription et login sur l'application
    - Modification et suppression du compte
- **Ajout de routine**
    - Bouton "+" pour ajouter une routine
    - Deux types :
        - **Oui/Non** : Cliquer pour changer l'état (fait/pas fait)
        - **Numérique** : Définir un objectif (int + unité), saisir une valeur chaque jour
- **Affichage des routines**
    - Liste simple des routines
- **Suivi**
    - Cocher/décocher les routines pour **Oui/Non**
    - Saisir la valeur pour les routines **Numériques**

---

## 3. Étape intermédiaire

- Modification/Suppression de routine via paramètres
- Fréquence personnalisée (jours cochés, etc.)
- Affichage graphique de la progression
- Organisation par tags
- Modal avec l'affichage de toutes les routines
- Graphiques de progrès (ex : courbe sur 7/30 jours)
- Plusieurs thèmes (sombre, clair)
- Statistiques hebdomadaires/mensuelles

---

## 4. Améliorations futures (non réalisées)

- Affichage visuel de la série en cours (ex : "5 jours d’affilée")
- Effets visuels selon la série (couleur, icône)
- Partage de routine (lien/code, compte requis)
- Comparaison des progrès entre utilisateurs
- Animations pour drag & drop et validations
- Exporter une image de ses progrès