# Copilot Instructions for Habit Tracker

## Architecture Overview
Mobile-first habit/routine tracking app. Next.js 13+ App Router, NextAuth (JWT sessions), Prisma ORM with Supabase Postgres, Tailwind CSS. Hosted on Vercel.

### Data Model (prisma/schema.prisma)
- **User** → has many **Routines** → has many **Progress** records
- **Routine**: BOOLEAN (yes/no) or NUMERIC (value towards goal), with frequency (DAILY, SPECIFIC_DAYS)
- **Progress**: tracks completion per routine per date with `booleanValue` or `numericValue`

### Key Data Flow
1. Client fetches routines from `/api/routines` (GET)
2. Progress loaded per date from `/api/progress?date=YYYY-MM-DD`
3. Toggle/numeric updates POST to `/api/progress` with optimistic UI updates

## Project Structure & Routing
```
app/
  auth.ts              # NextAuth config (Credentials)
  globals.css          # Design tokens & utility classes
  providers.tsx        # SessionProvider + ThemeProvider wrapper
  page.tsx             # Main page (conditional render: auth vs landing)
  api/
    routines/route.ts  # CRUD for user routines
    progress/route.ts  # Progress tracking per date
    auth/[...nextauth]/route.ts

components/
  sections/            # Page-level sections (high-level compositions)
    HomeSection.tsx    # Calendar + RoutineList composition
    LoginSection.tsx   # Auth forms (login/register)
    StatsSection.tsx   # User statistics display
    ProfileSection.tsx # User profile & settings
  ui/                  # Atomic/molecular reusable components (cva variants)
    Button.tsx         # Button with variants
    Card.tsx           # Card with variants  
    Input.tsx          # Input with icons & variants
    Badge.tsx          # Badge/tag with variants
    IconButton.tsx     # Square icon button
    LoadingSpinner.tsx # Loading spinner
    Disconnected.tsx   # Logout button
  RoutineList.tsx      # Main routine display with optimistic updates
  RoutineCard.tsx      # Individual routine card
  AddRoutine.tsx       # Modal form for create/edit
  Calendar.tsx         # Week-based date selector
  AllRoutinesModal.tsx # Modal for viewing/editing all routines
  FooterNav.tsx        # Bottom navigation tabs
  Header.tsx           # Page header with theme toggle
  Modal.tsx            # Modal wrapper with overlay
  ThemeToggle.tsx      # Theme switcher

lib/
  prisma.ts            # Singleton Prisma client (use this, not db.ts)
  Icon.tsx             # SVG icon components (no external icon library)
  utils.ts             # cn() helper for class merging
```

### Routing & Modals
- Modals use intercepting routes and folders like `@modal/`.
- Admin CRUD: see `app/(admin)/admin/posts/` for server actions and modal patterns.


## Critical Patterns & Conventions

### API Routes
All routes use `export const dynamic = "force-dynamic"` and check session:
```typescript
const session = await getServerSession(authOptions as any);
if (!session?.user?.id) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
```

### Optimistic UI (RoutineList.tsx)
Boolean toggles update UI immediately, fire-and-forget fetch. Numeric inputs debounce 300ms before sync.

### Date Handling
Dates normalized to midnight for consistency. Use `YYYY-MM-DD` string format for API queries.

### Theming
CSS variables in `globals.css` with `:root` (light) and `.dark` class. Use semantic tokens: `text-foreground`, `bg-card`, `border-border`, `text-accent`.

### Icons
Import from `@/lib/Icon.tsx` (custom SVG components), NOT external packages.

## Developer Commands & Workflows
```bash
npm run dev            # Start dev server
npm run build          # Production build
npx prisma migrate dev # Apply schema changes
npx prisma generate    # Regenerate client after schema edits
```

## Environment Variables Required
```
NEXTAUTH_URL, NEXTAUTH_SECRET
POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING
```

## Adding New Components

### New UI Component
1. Create in `components/ui/` with cva variants
2. Add documentation header (JSDoc)
3. Export from `components/ui/index.ts`
4. Use `"use client"` for interactive components
5. Animations via `motion/react`

### New Section
1. Create in `components/sections/`
2. Use semantic `<section>` tag
3. Export from `components/sections/index.ts`

### New Icon
Add to `lib/Icon.tsx` as SVG component (no external libraries)

### CSS/Styling
- NO arbitrary Tailwind values like `w-[400px]` or `text-[10px]`
- Add custom utilities to `globals.css` under `@layer utilities`
- Use design tokens: `text-2xs`, `max-h-modal`, `shadow-card`, etc.

## Contribution & Reference
- Open issues for bugs/feature requests.
- PRs: branch per feature, clear description, simple tests.
- Follow routing and modal/server action conventions.
- See `README.md` and `CONSIGNES.md` for requirements and roadmap.
- See `components/README.md` for component documentation.
