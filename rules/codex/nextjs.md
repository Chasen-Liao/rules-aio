# Next.js
Conventions for building apps with Next.js App Router — understand the routing structure before adding new pages.

## Router and Structure
- Use the App Router (`app/` directory). Pages are `app/` route segments with `page.tsx` exports.
- Co-locate route-specific components in the same `app/` segment. Shared components go in `components/`, utilities in `lib/`.
- Use lowercase-dash directory names (e.g., `components/auth-wizard/`).
- Read the existing `app/` layout tree and routing structure before adding new routes or components.

## Server vs Client Components
- Default to Server Components. Only add `'use client'` when the component needs interactivity, hooks, or browser APIs.
- Push the client boundary as low as possible — move state and effects into leaf components.
- Wrap lazy-loaded or async client components in `<Suspense>` with a meaningful fallback.

## Data Fetching
- Fetch data in Server Components with `async/await` or server actions. Do not use `useEffect` for data fetching.
- Respect Next.js caching defaults. Use `revalidate` or `noStore` only when the use-case requires it.
- For mutations, use Server Actions or route handlers — not client-side `fetch` to your own API routes.

## Performance
- Use `next/image` with explicit `width`/`height` or `fill` and `sizes` hints.
- Use `next/dynamic` for components below the fold or conditionally rendered.
- Minimize `useState` and `useEffect` in Server Component trees.

## Forms and Validation
- Use Zod schemas (or the project's existing validation library) for client and server-side validation.
- Show loading and error states during form submission. Do not silently swallow errors.

## Type Safety
- Read existing types and interfaces in the project before defining new ones. Follow established patterns.
- Co-locate props interfaces with their component files.

## Verification
- After changes, run `npm run build` or `npx next build` to check for compilation errors.
- Run `npm run lint` and `npx tsc --noEmit` to catch type and lint issues.
- Run `npm test` and confirm all relevant tests pass before finishing.
