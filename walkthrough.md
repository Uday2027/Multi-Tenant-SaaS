# Multi-Tenant SaaS Setup Walkthrough

Congratulations on scaffolding a highly modular, secure, and type-safe Multi-Tenant SaaS application. The latest sprint has completed the Next.js App Router implementation seamlessly integrating to the Fastify Backend.

## What We Accomplished

### 1. Monorepo Foundation & Tooling
We've set up a PNPM workspace at the root, maintaining shared configuration rules through the `@saas/tsconfig` workspace package, enforcing identical TypeScript environments dynamically inherited by Next.js and Fastify.

### 2. Drizzle & RLS Database Management
The `packages/db` module uses Drizzle ORM configured exclusively for Postgres **Row-Level Security (RLS)** efficiency. The API utilizes a `withTenant(id, callback)` function which wraps data operations explicitly in transactions invoking `SET LOCAL app.current_tenant = ...`, ensuring true isolation.

### 3. Fastify Backend (`apps/api`)
Built out using domain-driven architecture.
- **Middleware-powered Isolation**: `tenant.middleware.ts` inherently intercepts API requests targeting the SaaS logic, resolving the appropriate Database Tenant by scraping the subdomain.
- **Security**: Bound `@fastify/rate-limit`, `@fastify/helmet`. JWT issuance via `auth.service.ts` correctly manages short-lived access tokens (15m) and http-only cookies for refresh scopes.

### 4. Next.js App Router (`apps/web`) - **NEW**
A secure Next.js frontend has been established strictly utilizing Server Components by default with client component interactivity.

- **Middleware-First Authentication**: Implementation of `src/middleware.ts` which robustly intercepts requests. Instead of leveraging explicit Client Providers (`SessionProvider`), it intercepts routing and parses the JWT token natively (with `jose`), guarding protected domains and executing **silent token refreshes** 60 seconds before expiration.
- **Multi-Tenant Guardrails**: The core Dashboard interface is protected by `(dashboard)/layout.tsx`. By querying `getSession()`, we assert `session.tenantId !== resolvedTenantId` explicitly on the Server, rejecting any malicious horizontal context manipulation prior to component rendering.
- **Form Architecture**: `react-hook-form` strictly governed by `Zod` resolves login and signup interactions within `LoginForm` boundaries. Strict `<Label>` wrapping enforces web accessibility standards.
- **URL-State Onboarding**: The Setup sequence acts as a wizard driven strictly through URL Parameters (`?step=1`), persisting selections natively through refreshes rather than transient state. Completion triggers a lock via an explicit schema boolean redirect boundary.

## Validation Plan
1. **Initialize the Database:** Supply the appropriate runtime URL inside `process.env.DATABASE_URL`, execute the Drizzle generation `pnpm -r run db:migrate`.
2. **Execute Servers:** Launch `pnpm dev` globally in the root workspace.
3. **Frontend Interrogation:** 
    - Attempt navigating directly to `http://localhost:3000/dashboard` - expects Next.js to intercept and force `login?redirect=dashboard`.
    - Sign up and intercept the Onboarding workflow; reload mid-wizard to test URL-state mapping.
    - Set the local system host configurations to `acme.localhost` and target the frontend, verifying that passing cross-domain credentials fires the Security Guard.
    - **Cross-Tenant Escalation Test:** Sign up as User A on `acme.localhost`, copy the access token cookie, then manually attach it to a request against `othercorp.localhost`. Confirm the dashboard layout strictly rejects it with a redirect (`/login?error=wrong_tenant`), preventing a 200 response with empty or crossed data.
