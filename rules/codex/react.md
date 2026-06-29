# React
Conventions for writing React components — read files before editing, run tests before finishing.

## Components
- Use functional components only. No class components.
- One component per file. Keep components under ~150 lines; extract sub-components or hooks when they grow beyond a single responsibility.
- Read the existing component file and its imports before making changes. Match the established style, export pattern, and conventions.
- Use composition (children, render props, slots) over inheritance and deep prop drilling.

## Hooks
- Follow the Rules of Hooks: call only at the top level of a component or custom hook.
- Extract reusable stateful logic into custom hooks (`use*.ts`).
- Include every reactive value in `useEffect` and `useMemo` dependency arrays. Fix stale closures, don't suppress them.
- Add cleanup for subscriptions, timers, and event listeners in `useEffect` return.

## State
- `useState` for simple local state; `useReducer` for state with complex transitions.
- Keep state as close to where it is consumed as possible. Lift only when siblings need it.
- Use Context only when prop drilling exceeds 3 levels. Prefer server-state libraries (TanStack Query, SWR) over `useState` + `useEffect` for fetched data.
- Avoid adding external state management libraries unless the project already uses one.

## Performance
- Use `React.memo`, `useMemo`, and `useCallback` only when profiling shows unnecessary re-renders — not preemptively.
- Always provide a stable `key` for list items. Never use array index when items can reorder or be removed.

## Forms
- Use controlled components with validation wired up. Show field-level errors before submission.
- Display loading and error states during async form submission.

## Error Handling
- Wrap feature trees in Error Boundaries with fallback UI so one broken component does not crash the whole page.
- Handle async errors in hooks and effects; show user-friendly messages, not raw stack traces.

## Accessibility
- Use semantic HTML elements. Add ARIA attributes where native semantics are insufficient.
- Ensure keyboard navigation and focus management. Provide alt text for images.

## Testing
- Write tests with React Testing Library. Test user behavior (queries by role/text, userEvent), not implementation details.
- Run `npx vitest` or `npm test` and confirm all relevant tests pass before finishing.
- Run `tsc --noEmit` to check for type errors after component changes.

## Verification
- Read the files you will change before editing. Check existing tests, types, and adjacent components.
- After edits, run the project's lint command (`npm run lint`, `eslint .`), typecheck, and test suite to confirm nothing is broken.
