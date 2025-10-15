# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js 13+ project using the App Router, NextAuth for authentication, Prisma ORM (with Postgres), and Tailwind CSS for styling.
- The codebase is organized into two main route groups: `(home)` for the main site and `(admin)` for the admin dashboard, each with its own root layout and modal structure.
- Admin CRUD operations for posts are implemented under `app/(admin)/admin/posts/` using server actions and modal routing patterns.

## Key Files & Structure
- `app/(home)/` — Main site, entry at `page.tsx`, layout at `layout.tsx`.
- `app/(admin)/admin/` — Admin dashboard, entry at `page.tsx`, layout at `layout.tsx`.
- `app/(admin)/admin/posts/` — Post CRUD, with modal subroutes for create/edit.
- `components/` — Shared and admin-specific React components.
- `lib/prisma.ts` — Prisma client setup.
- `prisma/schema.prisma` — Database schema.
- `db.ts` — Database connection logic.
- `app/api/auth/[...nextauth]/route.ts` — NextAuth API route.

## Patterns & Conventions
- Use [Next.js App Router](https://nextjs.org/docs/app) conventions for routing, layouts, and server actions.
- Modal routes use the `@modal/` directory and intercepting route patterns (e.g., `app/(admin)/admin/posts/@modal/(.)edit/[id]/`).
- Server actions are colocated with UI components (see `actions.ts` in relevant folders).
- Tailwind CSS is configured via `tailwind.config.js` and used throughout for styling.
- Environment variables are required for NextAuth and database connections (see `.env.example` in README).

## Developer Workflows
- **Install dependencies:** `npm install`
- **Run dev server:** `npm run dev`
- **Database migration:** Use Prisma CLI (`npx prisma migrate dev`), schema in `prisma/schema.prisma`.
- **Authentication:** NextAuth is configured in `app/api/auth/[...nextauth]/route.ts`.
- **Modals:** Use intercepting routes and `@modal/` folders for modal UIs.

## Integration Points
- **Prisma**: All DB access via `lib/prisma.ts` and `db.ts`.
- **NextAuth**: Auth logic in `app/api/auth/[...nextauth]/route.ts` and `app/auth.ts`.
- **Tailwind**: Styles in `globals.css`, `adminGlobals.css`, and component classes.

## Examples
- To add a new admin modal, create a folder in `app/(admin)/admin/posts/@modal/` and follow the existing pattern.
- To add a new server action, colocate an `actions.ts` file in the relevant route folder.

## References
- See `README.md` for setup and environment details.
- Review `app/(admin)/admin/posts/` for advanced routing and modal patterns.

---
Update this file as project structure or conventions evolve. For questions, review the README and key folders above.
