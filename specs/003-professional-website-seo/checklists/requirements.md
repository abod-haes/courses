# SEO Requirements Quality Checklist

## Metadata
- [x] Canonical URL strategy is explicit.
- [x] Public pages define title/description/social metadata.
- [x] Missing entity pages are noindex.
- [x] Private pages are noindex/nofollow.
- [x] Search-engine verification is environment-driven.

## Crawling and indexing
- [x] robots.txt allows the public site.
- [x] robots.txt blocks APIs and private route families.
- [x] sitemap.xml is linked from robots.txt.
- [x] sitemap includes dynamic published content.
- [x] sitemap excludes private/authenticated routes.
- [x] pagination is bounded.

## Structured data
- [x] Organization schema is present.
- [x] Website schema is present.
- [x] Course schema is present on course details.
- [x] Book schema is present on book details.
- [x] Article schema is present on article details.
- [x] Breadcrumb schema is present on entity details.
- [x] Catalog ItemList schema is present.
- [x] Protected URLs/user data are excluded from JSON-LD.

## Duplicate content
- [x] Catalog query variants canonicalize to catalog roots.
- [x] Legacy About alias permanently redirects.
- [x] Legacy password alias permanently redirects.
- [x] No fake hreflang is emitted for cookie-only locale switching.

## Deployment and QA
- [x] Production site URL is documented.
- [ ] CI lint passes.
- [ ] CI build passes.
- [ ] Production robots.txt verified.
- [ ] Production sitemap.xml verified.
- [ ] Representative structured data validated externally.
- [ ] Google Search Console ownership configured.
- [ ] Bing Webmaster ownership configured if desired.
- [ ] Production sitemap submitted.
