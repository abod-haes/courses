# Implementation Plan: Professional Website SEO

## Technical Context

- Next.js 16.2.9 App Router
- React 19.2.4
- TypeScript 5
- next-intl locale preference currently resolved from cookies
- Laravel REST API provides published courses, books, and articles
- Production public domain: `https://dr-iyas.com`

## Architecture

Keep SEO as a small shared server-side layer rather than introducing a third-party SEO dependency.

```text
Page / Layout
  -> shared SEO helpers
  -> Next.js Metadata API
  -> metadata / canonical / robots / social cards

Public backend APIs
  -> sitemap pagination
  -> published course/book/article URLs

Entity detail page
  -> entity API data
  -> Metadata + Schema.org JSON-LD + BreadcrumbList
```

## Phase 1 — Central SEO primitives

Update `src/shared/lib/seo.ts` to own:
- canonical/absolute URL generation
- description normalization
- reusable metadata creation
- search-engine verification metadata
- private-page noindex metadata
- EducationalOrganization/WebSite schemas
- BreadcrumbList and ItemList schemas
- Course/Book/Article schemas
- optional Offer data from trusted backend price/currency

## Phase 2 — Crawling and discovery

Update:
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/manifest.ts`
- `.env.example`

Sitemap implementation must paginate public APIs up to a bounded maximum and must never call authenticated/private APIs.

## Phase 3 — Public page metadata

Standardize metadata for:
- home/root layout
- about page
- courses catalog/detail
- books catalog/detail
- articles catalog/detail
- legal/support pages continue to provide page metadata
- 404 responses are noindex

Catalog query parameters remain canonicalized to `/courses`, `/books`, or `/articles`.

## Phase 4 — Structured data

- Root: EducationalOrganization + WebSite
- Courses: ItemList; detail Course + BreadcrumbList
- Books: ItemList; detail Book + BreadcrumbList
- Articles: ItemList; detail Article + BreadcrumbList

Only public data fields may enter JSON-LD.

## Phase 5 — Private route protection

Create parent layouts that emit noindex/nofollow for:
- login
- registration
- password recovery
- checkout
- payment results
- user library/downloads
- orders
- protected learning area

Robots rules provide a second crawler-control layer.

## Phase 6 — Canonical redirects

Use permanent redirects for stable duplicate public aliases such as `/about` -> `/about-us`. Preserve private payment aliases unless product/payment integration explicitly consolidates them.

## Phase 7 — Validation

Required validation:
1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. Inspect `/robots.txt`
5. Inspect `/sitemap.xml`
6. Inspect generated `<head>` on home/catalog/detail/private pages
7. Validate JSON-LD using Google Rich Results Test / Schema.org Validator where applicable
8. Verify canonical URLs use `https://dr-iyas.com` in production
9. Add Google Search Console and Bing verification values only in deployment environment

## Risk Controls

- Backend outage: existing catalog API functions return empty envelopes instead of crashing sitemap generation.
- Infinite pagination: sitemap loops cap at 100 pages per content type.
- Locale duplication: do not add hreflang until locale-specific URLs exist.
- Protected content leakage: sitemap and JSON-LD use public catalog APIs only.
- Duplicate query pages: canonical remains the base catalog path.

## Deployment Notes

Hostinger production environment must include:

```env
NEXT_PUBLIC_SITE_URL=https://dr-iyas.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<optional>
NEXT_PUBLIC_BING_SITE_VERIFICATION=<optional>
```

After deployment, submit `https://dr-iyas.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
