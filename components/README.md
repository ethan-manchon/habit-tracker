# Components

Ce dossier contient tous les composants React de l'application Habit Tracker.

## Structure

```
components/
├── ui/              # Composants atomiques/moléculaires réutilisables
│   ├── Button.tsx   # Bouton avec variantes (cva)
│   ├── Card.tsx     # Carte avec variantes
│   ├── Input.tsx    # Champ de saisie avec icônes
│   ├── Badge.tsx    # Badge/tag coloré
│   ├── IconButton.tsx    # Bouton carré pour icônes
│   ├── LoadingSpinner.tsx # Spinner de chargement
│   └── Disconnected.tsx   # Bouton de déconnexion
│
├── sections/        # Sections de page (composants de haut niveau)
│   ├── HomeSection.tsx    # Section principale avec calendrier + routines
│   └── LoginSection.tsx   # Formulaires connexion/inscription
│
│
│   [autres]       # Composants spécifiques
├── Calendar.tsx        # Calendrier hebdomadaire
├── RoutineList.tsx     # Liste des routines avec progression
├── RoutineCard.tsx     # Carte de routine individuelle
├── AddRoutine.tsx      # Modal création/édition routine
├── AllRoutinesModal.tsx # Modal liste complète des routines
├── CreateRoutineButton.tsx # FAB pour créer une routine
├── FooterNav.tsx       # Navigation bottom tabs
├── Header.tsx          # En-tête avec titre et actions
├── Modal.tsx           # Wrapper modal avec overlay
└── ThemeToggle.tsx     # Toggle thème clair/sombre
```

## Conventions

### Import des composants UI

```tsx
// Import groupé (recommandé)
import { Button, Card, Input, Badge } from "@/components/ui";

// Import individuel
import { Button } from "@/components/ui/Button";
```

### Import des sections

```tsx
import { HomeSection, LoginSection } from "@/components/sections";
// ou
import HomeSection from "@/components/sections/HomeSection";
```

### Variantes (cva)

Tous les composants UI utilisent `class-variance-authority` pour les variantes :

```tsx
<Button variant="default" size="lg" fullWidth>
  Texte
</Button>

<Card variant="gradient" padding="lg">
  Contenu
</Card>

<Badge variant="success">Complété</Badge>
```

### Documentation

Chaque composant inclut un en-tête JSDoc avec :
- Description du composant
- Exemple d'utilisation
- Liste des variantes/props
- Features principales

## Design System

Les valeurs CSS sont centralisées dans `app/globals.css` :

### Couleurs (variables CSS)
- `--accent` / `--accent-hover` : Couleur principale
- `--success`, `--warning`, `--danger` : États
- `--foreground`, `--muted` : Texte
- `--card`, `--background` : Fonds

### Utilitaires personnalisés
- `text-2xs` : Texte 10px
- `max-h-modal`, `max-h-list`, `max-h-dropdown` : Hauteurs max
- `min-w-nav-item`, `min-w-context-menu` : Largeurs min
- `w-cta-mobile` : Largeur CTA mobile
- `shadow-card`, `shadow-dropdown`, `shadow-accent` : Ombres

## Icônes

Toutes les icônes sont dans `lib/Icon.tsx`. Ne pas utiliser de bibliothèque externe.

```tsx
import { Home, Check, User, Running } from "@/lib/Icon";

<Home className="w-5 h-5 text-accent" />
```

