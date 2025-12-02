# Copilot Instructions for Habit Tracker

## Architecture Overview
Mobile-first habit/routine tracking app. Next.js 16+ App Router, NextAuth v4 (JWT sessions), Prisma ORM with Supabase Postgres, Tailwind CSS v4.

### Data Model (prisma/schema.prisma)
- **User** → has many **Routines** → has many **Progress** records
- **Routine**: BOOLEAN (yes/no) or NUMERIC (value towards goal), with frequency (DAILY, EVERY_N_DAYS, SPECIFIC_DAYS)
- **Progress**: tracks completion per routine per date with `booleanValue` or `numericValue`

### Key Data Flow
1. Client fetches routines from `/api/routines` (GET)
2. Progress loaded per date from `/api/progress?date=YYYY-MM-DD`
3. Toggle/numeric updates POST to `/api/progress` with optimistic UI updates

## Project Structure
```
app/
  auth.ts              # NextAuth config (Credentials + Google)
  providers.tsx        # SessionProvider + ThemeProvider wrapper
  page.tsx             # Main page (conditional render: auth vs landing)
  api/
    routines/route.ts  # CRUD for user routines
    progress/route.ts  # Progress tracking per date
    auth/[...nextauth]/route.ts
components/
  HomeContent.tsx      # Calendar + RoutineList composition
  RoutineList.tsx      # Main routine display with optimistic updates
  AddRoutine.tsx       # Modal form for create/edit
  Calendar.tsx         # Week-based date selector
  ui/                  # Reusable components (Button, Card, Input, Badge)
lib/
  prisma.ts            # Singleton Prisma client (use this, not db.ts)
  Icon.tsx             # SVG icon components (no external icon library)
  utils.ts             # cn() helper for class merging
```

## Critical Patterns

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

## Developer Commands
```bash
npm run dev            # Start dev server
npm run build          # Production build
npx prisma migrate dev # Apply schema changes
npx prisma generate    # Regenerate client after schema edits
```

## Environment Variables Required
```
NEXTAUTH_URL, NEXTAUTH_SECRET
GOOGLE_CLIENT_ID, GOOGLE_SECRET_ID  # Optional for OAuth
POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING
```

## When Adding Features
- New API route: follow pattern in `app/api/routines/route.ts`
- New UI component: client components use `"use client"`, animations via `motion/react`
- Database changes: update `prisma/schema.prisma`, run migrations
- Icons: add to `lib/Icon.tsx` as SVG component
