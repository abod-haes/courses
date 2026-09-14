# Research Notes: Professional Website SEO

## Existing implementation found

The repository already had a useful SEO foundation before this feature:
- `src/shared/lib/seo.ts` generated metadata and several JSON-LD entities.
- `src/app/layout.tsx` rendered organization and website JSON-LD.
- `src/app/robots.ts` and `src/app/sitemap.ts` existed.
- Course and book detail pages already generated dynamic metadata.

The main gaps were completeness and consistency rather than a total absence of SEO.

## Key findings

### 1. Sitemap was static-only
The previous sitemap contained only the home/about/catalog routes. Published detail pages for courses, books, and articles were undiscoverable from the sitemap.

**Decision:** paginate the existing public catalog APIs and generate detail entries server-side.

### 2. Private pages relied mainly on robots disallow
`robots.txt` alone is not a guarantee that a known URL will never appear in a search index.

**Decision:** add route-level `noindex, nofollow` metadata for authenticated/private areas in addition to robots disallow rules.

### 3. Metadata implementation was inconsistent
Some pages used the shared helper while catalog/article pages built partial `Metadata` objects manually.

**Decision:** make the shared helper the standard for canonical, robots, Open Graph, Twitter, and verification metadata.

### 4. Dynamic content had incomplete structured data
Course schema existed, Book helper existed, but Book detail and Article detail did not consistently emit their entity schema and breadcrumbs. Catalogs had no `ItemList` schema.

**Decision:** add structured data to each public content family using only public fields.

### 5. Locale selection is cookie-based
Arabic and English currently share the exact same URL. Emitting alternate-language hreflang URLs would be inaccurate because there are no distinct language URLs.

**Decision:** do not manufacture hreflang. Treat locale-path migration as a separate routing/SEO architecture feature.

### 6. Canonical domain needs deployment configuration
The shared SEO utility falls back to localhost when no site URL is configured.

**Decision:** document `NEXT_PUBLIC_SITE_URL=https://dr-iyas.com` as required production configuration.

### 7. Search verification should not be committed
Google/Bing site verification values vary by account/environment.

**Decision:** read them from optional environment variables.

## Security considerations

Structured data must never include:
- lesson video URLs
- protected book file URLs
- signed download URLs
- user library/order data
- checkout/payment session identifiers

All sitemap discovery is based on unauthenticated public catalog APIs.

## Performance considerations

Sitemap generation uses page size 100 and a hard upper bound of 100 pages per content type. It is revalidated hourly. This avoids one request per entity and prevents an accidental infinite pagination loop.
