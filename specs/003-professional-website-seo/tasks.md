# Tasks: Professional Website SEO

Legend: `[P]` can be implemented in parallel after dependencies are satisfied.

## Phase 1 — Shared SEO foundation

- [x] T001 Audit existing metadata, sitemap, robots, manifest, JSON-LD, and public/private routes.
- [x] T002 Extend `src/shared/lib/seo.ts` with canonical absolute URLs, social metadata, robots handling, and verification metadata.
- [x] T003 Add reusable noindex metadata helper for private route families.
- [x] T004 [P] Add BreadcrumbList and ItemList JSON-LD helpers.
- [x] T005 [P] Enrich Course schema with trusted instructor/offer fields.
- [x] T006 [P] Enrich Book schema with trusted offer fields.
- [x] T007 [P] Add Article JSON-LD helper.

## Phase 2 — Discovery and crawler control

- [x] T008 Update `.env.example` with canonical production site URL and optional verification variables.
- [x] T009 Harden `robots.ts` for API/auth/checkout/payment/library/orders/learning routes.
- [x] T010 Replace static-only sitemap with paginated course/book/article discovery.
- [x] T011 Add bounded sitemap pagination and hourly revalidation.
- [x] T012 Preserve backend publish/update timestamps in course/book frontend view models.
- [x] T013 Use content timestamps in dynamic sitemap entries.
- [x] T014 Improve the web manifest and root icon/manifest declarations.

## Phase 3 — Public metadata and structured data

- [x] T015 Standardize root/home metadata through the shared SEO helper.
- [x] T016 Standardize About metadata and add breadcrumbs.
- [x] T017 Standardize Courses catalog metadata and add ItemList schema.
- [x] T018 Add enriched Course + Breadcrumb schema on course details.
- [x] T019 Standardize Books catalog metadata and add ItemList schema.
- [x] T020 Add Book + Breadcrumb schema on book details.
- [x] T021 Standardize Articles catalog/detail metadata.
- [x] T022 Add Article + Breadcrumb schema and catalog ItemList schema.
- [x] T023 Add noindex metadata to global 404 page.

## Phase 4 — Private route indexing protection

- [x] T024 [P] Add noindex layout for login.
- [x] T025 [P] Add noindex layout for registration.
- [x] T026 [P] Add noindex layout for password recovery routes.
- [x] T027 [P] Add noindex layout for checkout flow.
- [x] T028 [P] Add noindex layout for payment result routes.
- [x] T029 [P] Add noindex layout for library and protected book downloads.
- [x] T030 [P] Add noindex layout for order history.
- [x] T031 [P] Add noindex layout for protected learning routes.

## Phase 5 — Duplicate URL control

- [x] T032 Make `/about` -> `/about-us` redirect permanent.
- [x] T033 Make legacy `/forget-password` -> `/forgot-password` redirect permanent.

## Phase 6 — Spec-Kit artifacts

- [x] T034 Create feature specification.
- [x] T035 [P] Create implementation plan.
- [x] T036 [P] Create research notes.
- [x] T037 [P] Create SEO view data model.
- [x] T038 [P] Create quickstart/QA guide.
- [x] T039 [P] Create SEO behavior contract.
- [x] T040 [P] Create quality checklist.

## Phase 7 — Automated validation

- [ ] T041 Run GitHub Actions lint validation on the feature branch/PR.
- [ ] T042 Run GitHub Actions production build validation on the feature branch/PR.
- [ ] T043 Fix any lint/type/build regressions found by CI.
- [ ] T044 Confirm `/robots.txt`, `/sitemap.xml`, and `/manifest.webmanifest` in deployed staging/production.
- [ ] T045 Validate representative Course, Book, Article, and Breadcrumb JSON-LD using Google Rich Results Test / Schema.org Validator.
- [ ] T046 Confirm Search Console verification token and submit sitemap after production deployment.

## Separate follow-up feature — locale URL architecture

- [ ] FUTURE-SEO-001 Specify `/en/*` and `/ar/*` public URL architecture.
- [ ] FUTURE-SEO-002 Define redirects from legacy unprefixed URLs without losing rankings.
- [ ] FUTURE-SEO-003 Add `hreflang=en`, `hreflang=ar`, and `x-default` only after distinct locale URLs exist.
- [ ] FUTURE-SEO-004 Update all internal links, sitemap alternates, canonical rules, checkout return URLs, and Search Console properties for locale URLs.

This locale migration is intentionally separated because the current product resolves locale by cookie and changing every public URL is a routing contract migration, not a metadata-only change.
