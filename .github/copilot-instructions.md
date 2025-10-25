# Copilot Instructions for Construction Material Shop

## Project Overview

This is a Next.js 15 e-commerce application (Construction Material Shop) using the App Router, TypeScript, and Tailwind CSS. It is being developed into a **full-stack application** with API routes handling backend logic, database connections, and authentication.

## Core Principles & Best Practices

1.  **Server Components by Default**: This is an App Router project. All new components should be **Server Components** by default. Data fetching for pages should be done directly in Server Components (`fetch`).
2.  **Use Client Components Sparingly**: Only add the `'use client'` directive if the component _requires_ interactivity (e.g., `useState`, `useContext`, event listeners). Keep client components small.
3.  **API is the Source of Truth**: All data (products, users, carts) **must** be fetched from the API routes in `src/app/api/`. The static data in `src/lib/products.ts` should be considered **deprecated** or used only for initial mocking.
4.  **Strict TypeScript**: All new functions, component props, API payloads, and database models **must** be strictly typed.
5.  **Style with Tailwind & UI Lib**: Do not write new `.css` files. Style components using Tailwind CSS classes. **Always** reuse components from `src/components/ui/` (e.g., `<Button>`, `<Card>`) before creating new ones.

## Architecture & Data Flow

- **Full-Stack (Next.js App Router)**: The frontend is built with React Server Components and Client Components. The **backend** is built using Next.js API Routes in `src/app/api/`.
- **API-Driven Data**: All product, user, and cart data will be served from the API, which connects to a database (e.g., Prisma).
- **API Routes (Backend)**: All backend business logic, database interaction, and authentication **must** be built within the `src/app/api/` directory.
- **Cart & Session State**: The client-side cart (`useCart` hook) will be refactored to interact with the API for persistence. Authentication and user session logic will be implemented.

## Key Files & Patterns

- `prisma/schema.prisma`: **Database schema** - All models, relationships, and database configuration
- `prisma/seed.ts`: Database seeding script with sample product data
- `src/lib/db.js`: **Database connection** - Prisma client instance with connection pooling
- `src/app/api/products/route.ts`: **Products API** - CRUD operations with filtering, pagination, search
- `src/app/api/orders/route.ts`: **Orders API** - Order management with transaction support
- `src/app/api/auth/github/route.ts`: GitHub OAuth authentication endpoint
- `src/app/api/webhooks/github/route.ts`: GitHub webhook handler for events
- `src/app/api/github/[owner]/[repo]/route.ts`: GitHub repository data API
- `src/lib/auth.tsx`: Authentication context using GitHub OAuth
- `src/components/ClientLayout.tsx`: Wraps app with AuthProvider
- `src/lib/hooks.tsx`: Defines the `CartProvider` and `useCart` hook. This will be updated to fetch/mutate data from the API instead of just managing local state.
- `src/components/ui/`: Contains all reusable, styled UI components. Use these heavily.
- `@/`: **Always** use the `@/` import alias for any path starting from `src/`.

## Development Workflow

- **Start dev server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build --turbopack`
- **Lint**: `npm run lint` (ESLint with Prettier)
- **Format**: `npm run format` (Prettier)
- **Database setup**: See `DATABASE_SETUP.md` for complete database setup instructions
- **Generate Prisma client**: `npm run db:generate`
- **Push schema changes**: `npm run db:push`
- **Seed database**: `npm run db:seed`
- **Open Prisma Studio**: `npm run db:studio`
- **GitHub Setup**: Copy `.env.local` and configure GitHub App credentials for OAuth and API access

## Standing Conventions

- **Icon Library**: **Only** use icons from `lucide-react`. Import them individually: `import { ShoppingCart } from 'lucide-react'`.
- **Authentication**: Use GitHub OAuth via `useAuth()` hook for user authentication
- **API Integration**: GitHub API calls use `@octokit/rest` with proper error handling
- **Global State**: **Do not** add new global state libraries (like Redux or Zustand). Continue to use React Context (`useCart`) for client-side UI state, but ensure it is synced with the backend API.
