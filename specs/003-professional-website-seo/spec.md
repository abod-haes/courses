# Feature Specification: Professional Website SEO

**Feature Branch**: `003-professional-website-seo`  
**Status**: Implemented / validation pending  
**Application**: Public Next.js website (`abod-haes/courses`)

## Goal

Make the public IASS website technically crawlable, indexable, shareable, and semantically understandable by search engines while keeping authentication, checkout, purchases, private learning content, orders, and protected downloads out of search indexes.

## Product Context

The public website exposes published medical courses, digital medical books, and educational articles. Published catalog content is indexable. User-specific and paid-content routes are private. The website currently supports Arabic and English through a locale preference/cookie while both languages share the same public URL path.

## User Stories

### US-SEO-01 — Search engines can discover public content
As a search engine, I can discover the home page, public catalogs, public legal/support pages, and every published course, book, and article through a valid sitemap.

**Acceptance criteria**
- Sitemap contains only public URLs.
- Sitemap includes dynamic course/book/article detail URLs from the public backend APIs.
- Private routes never appear in the sitemap.
- Content timestamps are used when the backend provides them.

### US-SEO-02 — Every public page has correct metadata
As a visitor arriving from search or social media, I see a meaningful title, description, canonical URL, Open Graph card, and Twitter card for the requested public page.

**Acceptance criteria**
- Public catalog and detail pages have unique metadata.
- Detail metadata is generated from the backend entity.
- Missing entities are noindex.
- Canonicals do not include filter/search/sort query strings.

### US-SEO-03 — Private routes stay out of search results
As an authenticated user, my checkout, payment, library, order, learning, and protected download URLs are not intended for indexing.

**Acceptance criteria**
- Private areas emit `noindex, nofollow` metadata through route layouts.
- `robots.txt` disallows private route families and API routes.
- Protected URLs are absent from sitemap and structured data.

### US-SEO-04 — Search engines understand content types
As a search engine, I receive valid Schema.org structured data describing IASS, the website, breadcrumbs, catalogs, courses, books, and articles.

**Acceptance criteria**
- Root includes `EducationalOrganization` and `WebSite` JSON-LD.
- Catalogs include `ItemList` JSON-LD.
- Course details include `Course`, offer data when price/currency exist, and breadcrumbs.
- Book details include `Book`, offer data when price/currency exist, and breadcrumbs.
- Article details include `Article` and breadcrumbs.
- JSON-LD never includes private file/video URLs.

### US-SEO-05 — Duplicate routes resolve to canonical routes
As a crawler, I receive permanent redirects for legacy public route aliases.

**Acceptance criteria**
- `/about` permanently redirects to `/about-us`.
- `/forget-password` permanently redirects to `/forgot-password`.

### US-SEO-06 — Search engine ownership can be configured safely
As the deployer, I can configure Google and Bing verification tokens without hard-coding them.

**Acceptance criteria**
- Verification tokens come from environment variables.
- Empty tokens do not render invalid verification metadata.

## Functional Requirements

- **FR-SEO-001** Centralize canonical URL generation and absolute URL generation.
- **FR-SEO-002** Centralize reusable metadata generation.
- **FR-SEO-003** Generate dynamic sitemap entries from public backend APIs with pagination.
- **FR-SEO-004** Keep dynamic sitemap generation bounded to prevent runaway API loops.
- **FR-SEO-005** Configure production site URL through `NEXT_PUBLIC_SITE_URL`.
- **FR-SEO-006** Configure optional Google/Bing verification through environment variables.
- **FR-SEO-007** Add structured data without exposing protected resource URLs.
- **FR-SEO-008** Add `noindex` metadata to private route families.
- **FR-SEO-009** Provide robust crawler rules in `robots.ts`.
- **FR-SEO-010** Keep filtered/searched catalog variants canonicalized to the base catalog route.
- **FR-SEO-011** Add a complete web app manifest and root icon declarations.
- **FR-SEO-012** 404/missing-content responses must not be indexed.

## Non-Functional Requirements

- SEO code must be server-side compatible with Next.js 16 App Router.
- No SEO implementation may expose paid lesson content, private book links, checkout identifiers, or user information.
- Sitemap failures caused by backend unavailability must degrade to available/static entries rather than crash the entire website where existing API helpers already provide safe fallbacks.
- New SEO helpers must be typed with TypeScript and pass the existing lint/build pipeline.
- No third-party SEO package is required.

## Multilingual SEO Decision

The current application chooses Arabic/English via cookie and serves both languages on the same path. This feature intentionally does **not** emit misleading `hreflang` links pointing multiple languages to the same URL. True language-targeted SEO requires a separate URL contract such as `/ar/...` and `/en/...`, plus permanent redirects and a routing migration. That migration is a separate URL-architecture feature because it changes every public link and deployment/search-console contract.

## Out of Scope

- Paid advertising/SEM.
- Backlink campaigns.
- Automatic content generation.
- Changing backend publication rules.
- Migrating all routes to `/ar` and `/en` within this feature.
- Exposing protected lesson/book resources to crawlers.

## Definition of Done

- Lint passes.
- Next.js production build passes.
- `robots.txt` references the canonical sitemap and blocks private route families.
- `sitemap.xml` includes static public pages and published dynamic content.
- Course/book/article pages render correct canonical/Open Graph/Twitter metadata.
- Private route layouts return noindex metadata.
- Course/book/article JSON-LD and breadcrumbs render without protected URLs.
- Production environment defines `NEXT_PUBLIC_SITE_URL=https://dr-iyas.com`.
