# Project Guide

This repository is a website-first Next.js starter designed to be reused as a template for future projects.

The goal is to keep the architecture clean, scalable, and easy to reason about:

- server-rendered by default
- reusable across features
- typed end to end
- SEO-friendly
- translation-ready
- easy to extend without turning into a dashboard-style codebase

## 1. Core Principles

These rules define how the project should be built.

- Prefer server components unless client state or browser events are required.
- Keep each file focused on a single responsibility.
- Put reusable UI in shared components.
- Put reusable non-UI logic in helpers or services.
- Put request/response shapes in `type` files.
- Put React Query hooks in `query` files.
- Keep pages thin. Pages should compose blocks, not contain business logic.
- Keep feature-specific logic inside the feature folder.
- Keep truly shared logic in `src/shared`.
- Keep SEO-sensitive content on the server.
- Keep client-side code only where needed for interaction.

## 2. High-Level Architecture

The project is organized around these layers:

1. `src/app`
2. `src/features`
3. `src/shared`
4. `src/messages`
5. `docs`

### `src/app`

This is the Next.js routing layer.

Use it for:

- route entry files
- root layout
- metadata
- route handlers
- sitemap and robots

Do not put feature business logic here.

### `src/features`

This folder contains domain modules.

Each feature owns its own:

- page composition
- UI components
- types
- services
- queries
- helpers

Examples:

- `home`
- `contact`
- `blog`
- `auth`
- `products`

### `src/shared`

This folder contains reusable code that can be used across multiple features.

Use it for:

- UI primitives
- layout chrome
- API client/server helpers
- API response contracts
- preferences and theme helpers
- locale helpers
- SEO helpers
- utilities

### `src/messages`

This folder contains translation messages for `next-intl`.

Keep locale data here only.

### `docs`

This folder contains architecture notes, rules, and implementation guidance.

## 3. Naming Convention

Use these file suffixes consistently:

- `*.page.tsx` for page composition files
- `*.component.tsx` for reusable UI components
- `*.type.ts` for data types and contracts
- `*.service.ts` for API logic, server logic, and other non-UI operations
- `*.query.ts` for React Query hooks
- `*.helper.ts` for pure helper functions
- `*.provider.tsx` for context providers

### Why this matters

Consistent naming makes the codebase predictable:

- you can find logic faster
- the responsibility of each file is obvious
- future contributors know where to add new code
- the project scales without becoming messy

## 4. Folder Rules

### `src/app`

Rules:

- Keep route files thin.
- Use `page.tsx` only to resolve route-level data and render the feature page.
- Use `layout.tsx` for app-wide wrappers such as providers, header, and footer.
- Keep route handlers focused on request/response behavior only.
- Do not place reusable UI blocks here.

### `src/features/<feature>`

Rules:

- A feature should be self-contained.
- Feature logic should not leak into other features.
- If a block is reused across the same feature, keep it in the feature folder.
- If a block is reused across multiple features, move it to `src/shared`.

Recommended structure:

```txt
src/features/home/
  home.page.tsx
  home.type.ts
  home.helper.ts
  home.service.ts
  home.query.ts
  components/
    home-hero.component.tsx
    home-stats.component.tsx
    home-features.component.tsx
    home-showcase.component.tsx
```

### `src/shared`

Rules:

- Shared code must not depend on a specific feature unless it is a generic example.
- Shared UI should be reusable and theme-aware.
- Shared helpers should be pure whenever possible.
- Shared API helpers should be generic and typed.

Recommended structure:

```txt
src/shared/
  components/
    site-header.component.tsx
    site-footer.component.tsx
    ui/
      button.tsx
      card.tsx
      badge.tsx
      input.tsx
  lib/
    helpers/
      locale.helper.ts
      seo.helper.ts
    api/
      api-client.service.ts
      api-server.service.ts
      api.type.ts
      pagination.service.ts
      errors.ts
    preferences.ts
    messages.ts
    types.ts
```

## 5. Page Rule

Every page should be as thin as possible.

### Good page responsibilities

- resolve route-level locale
- read cookies or headers when needed
- call a feature helper or server fetch
- pass data into a feature page component
- generate metadata

### Bad page responsibilities

- building large UI blocks directly
- defining multiple unrelated helpers inline
- duplicating data transformation logic
- mixing API calls and rendering in the same file

## 6. Component Rule

Components should focus on rendering.

### Keep in components

- markup
- styling
- presentation-only state
- event handlers related to UI behavior

### Move out of components

- data fetching
- data transformation
- validation
- business rules
- API calls

If the logic is reusable and pure, move it to a helper.
If the logic talks to the network or server, move it to a service.

## 7. Type Rule

All domain data should be typed explicitly.

Put these in `*.type.ts`:

- request payloads
- response payloads
- UI view models
- pagination meta
- API envelopes
- form values
- feature-specific content shapes

### Example

```ts
export type HomeStatItem = {
  label: string;
  hint: string;
};
```

## 8. Helper Rule

Helpers are for pure functions.

Use helpers for:

- locale resolution
- direction resolution
- SEO metadata assembly
- text normalization
- data shaping
- content mapping
- formatting

### Helper principles

- keep helpers pure when possible
- avoid side effects
- do not fetch data inside a helper unless it is intentionally a server helper
- do not render UI inside a helper

## 9. Service Rule

Services own communication and business logic.

Use services for:

- API calls
- server-only logic
- data persistence adapters
- business operations that do not render UI

### API service examples

- `api-client.service.ts`
- `api-server.service.ts`
- `pagination.service.ts`

### Feature service examples

- `contact.service.ts`
- `auth.service.ts`
- `posts.service.ts`

## 10. Query Rule

Query files are for React Query only.

Use them to define:

- query keys
- `useQuery`
- `useMutation`
- query invalidation patterns

### Keep query files clean

- no JSX
- no UI rendering
- no server component code
- no unrelated helpers

## 11. Shared API Design

The API layer is built to be reusable across projects.

### Response shape

Use a typed envelope:

```ts
{
  success: true,
  data: ...
  meta?: ...
}
```

or

```ts
{
  success: false,
  error: ...
  meta?: ...
}
```

### Shared API types

Use the shared API contracts for:

- success envelopes
- failure envelopes
- pagination meta
- request metadata
- pagination params

### Validation

Validate request bodies with Zod:

- on the server
- on the client when possible

This keeps the contract consistent and reduces runtime bugs.

## 12. Rendering Strategy

This starter is website-first.

### Server-first by default

Use server rendering for:

- homepage content
- SEO-sensitive content
- static or mostly static sections
- metadata
- localized content

### Client only when necessary

Use client components for:

- theme toggle
- locale toggle
- forms
- browser-only interactivity
- animations that need client state

### Important rule

If the locale changes, refresh the server-rendered page so translated content updates immediately.

## 13. Internationalization Rule

The project uses `next-intl`.

### Where translation data lives

- locale JSON files in `src/messages`

### Where translation setup lives

- request config in `src/i18n/request.ts`
- provider in the root layout

### Usage rule

- use server translation APIs for server components
- use client translation APIs for client components
- do not duplicate copy across components

## 14. Theme Rule

Dark mode uses Tailwind `class` strategy.

### Rules

- toggle the `dark` class on `<html>`
- keep colors token-driven through CSS variables
- avoid hardcoded colors when tokens already exist
- keep `light` and `dark` behavior consistent

### Why this is better

- easy to read
- easy to maintain
- works naturally with Tailwind `dark:` utilities
- avoids relying on custom data attributes for theme state

## 15. SEO Rule

SEO is a first-class requirement.

### Required SEO support

- metadata
- Open Graph
- Twitter metadata
- canonical URLs
- robots.txt
- sitemap.xml
- server-rendered content

### SEO rules

- keep key content on the server
- avoid hiding important text behind client-only rendering
- keep the homepage meaningful without JavaScript
- make metadata reusable through helpers

## 16. Clean Code Rules

These rules keep the project maintainable.

- Prefer small focused files.
- Avoid large components that do everything.
- Avoid duplicated logic.
- Move repeated logic to shared helpers.
- Move repeated UI to shared components.
- Keep naming consistent.
- Keep imports organized.
- Keep feature folders isolated.
- Keep side effects out of pure helpers.
- Keep pages and route files thin.

## 17. How To Build A New Feature

Use this workflow for every new feature.

### Step 1: Create the feature folder

```txt
src/features/contact/
```

### Step 2: Add types

Create:

- `contact.type.ts`

### Step 3: Add helpers

Create:

- `contact.helper.ts`

### Step 4: Add service logic

Create:

- `contact.service.ts`

### Step 5: Add query hooks if needed

Create:

- `contact.query.ts`

### Step 6: Add UI components

Create:

- `components/contact-form.component.tsx`
- `components/contact-list.component.tsx`

### Step 7: Add the page

Create:

- `contact.page.tsx`

### Step 8: Wire the route

In `src/app`, keep the route file thin and render the feature page.

## 18. How To Build An API

Use this flow for any API endpoint.

### Server side

- define the request type
- validate with Zod
- keep the handler thin
- return the shared envelope shape
- include metadata when useful

### Client side

- define the response type
- call the shared API client
- validate response payloads if needed
- wrap data access with a feature service
- use React Query for caching and invalidation

### Recommended files

- `feature.type.ts`
- `feature.service.ts`
- `feature.query.ts`
- `src/app/api/<route>/route.ts`

## 19. Example Data Flow

For a typical feature API:

1. the UI renders a feature page
2. the query hook requests data
3. the service calls the shared API client
4. the server route validates the request
5. the route calls the server service
6. the route returns the typed envelope
7. the client receives typed data
8. the UI updates without duplicating logic

## 20. What To Keep Shared

Move code to `src/shared` when it is:

- used in multiple features
- not specific to one business domain
- a generic UI primitive
- a generic helper
- a generic API utility
- a layout-level component

Examples:

- header
- footer
- button
- card
- API envelope types
- locale helpers
- SEO helpers
- theme helpers

## 21. What To Keep In A Feature

Keep code inside a feature when it:

- belongs to one domain only
- is used by one screen or one business area
- contains feature-specific UI
- contains feature-specific logic
- contains feature-specific types or content mapping

Examples:

- home hero section
- home showcase section
- contact form
- blog post card
- checkout summary

## 22. What Not To Do

- Do not build dashboard-style code in a website starter unless the product actually is a dashboard.
- Do not put business logic inside route files.
- Do not keep reusable code inside feature pages.
- Do not create giant components that render everything.
- Do not duplicate API contracts in multiple places.
- Do not mix server and client responsibilities in one file without a clear reason.
- Do not rely on hardcoded strings if the project is multilingual.

## 23. Summary

This starter is designed to be copied into any project and extended safely.

The ideal mindset is:

- pages compose
- components render
- types describe
- helpers transform
- services connect
- queries cache
- shared code is reused
- server rendering handles SEO-critical content

If you follow these rules, the codebase stays clean, scalable, and easy to maintain.
