# Fonctionnalités de l'application de suivi de routines

## 1. Initialisation & Hébergement

- **Hébergement** : Vercel
- **Base de donnée** : Supabase
- **Interface** : Minimaliste, mobile-first, thème sombre par défaut
- **Stack**: Front et API en nextJS

---

## 2. Fonctionnalités principales (MVP)

### 2.1 Calendrier & Affichage

- Calendrier des jours jusqu'à aujourd'hui

### 2.2 MVP Alpha – Gestion et affichage basiques des routines

- **Gestion des comptes**
    - Inscription et login sur l'application
    - Modification et suppression du compte
- **Ajout de routine**
    - Bouton "+" pour ajouter une routine
    - Deux types :
        - **Oui/Non** : Cliquer pour changer l'état (fait/pas fait)
        - **Numérique** : Définir un objectif (int + unité), saisir une valeur chaque jour
- **Affichage des routines**
    - Grand espace vide pour afficher les routines
    - Liste simple des routines
- **Suivi**
    - Cocher/décocher les routines pour **Oui/Non**
    - Rentrer la valeur pour les routines **Numériques**

---

### 2.3 Version 1.0 – Fonctionnalités avancées de gestion et visualisation

- **Modification/Suppression**
    - Modifier ou supprimer une routine via paramètres
- **Fréquence**
    - Configurer les jours d'affichage (jours cochés, 1 jour sur 2, en semaine, etc.)
    - Nombre de fois par jour
- **Affichage avancé**
    - Drag & drop pour réorganiser les routines
    - Accès à un affichage graphique :
        - Pour routines **Oui/Non** : progression sur les jours
        - Pour routines **Numériques** : valeurs saisies sur les jours
- **Organisation**
    - Ajouter un tag à chaque routine
    - Tri par tag ou par mot-clé

---

## 3. Améliorations futures

### 3.1 Version 1.1 – Expérience utilisateur

- Graphiques de progrès (ex : courbe sur 7/30 jours)
- Affichage visuel de la série en cours (ex : "5 jours d’affilée")
- Effets visuels selon la série (couleur, icône)
- Personnalisation basique des couleurs/thèmes

### 3.2 Version 1.2 – Social & Comparaison

- Partage de routine (lien/code, compte requis)
- Comparaison des progrès entre utilisateurs
- Animations pour drag & drop et validations

### 3.3 Version 1.3 – Personnalisation avancée

- Plusieurs thèmes (sombre, clair, personnalisés)
- Statistiques hebdomadaires/mensuelles (ex : "80% de tes routines complétées ce mois-ci")
- Exporter une image de ses progrès

---