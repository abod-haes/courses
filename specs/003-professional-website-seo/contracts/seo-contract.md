# SEO Behavior Contract

This feature has no new REST endpoint. The contract defines observable website SEO behavior.

## Public page contract

For every indexable public page:

```text
HTTP 200
canonical = absolute URL on NEXT_PUBLIC_SITE_URL
robots = index, follow
OpenGraph = title + description + canonical URL + share image
Twitter = summary_large_image + title + description + share image
```

Catalog pages canonicalize filtered/search/sorted variants to the base catalog URL.

## Entity detail contract

### Course

Required metadata inputs:
- title
- public description
- public image
- canonical href
- category

Optional structured fields:
- instructor
- amount
- currency

Required JSON-LD:
- Course
- BreadcrumbList

### Book

Required metadata inputs:
- title
- public description
- public cover
- canonical href

Optional structured fields:
- author
- ISBN
- amount
- currency

Required JSON-LD:
- Book
- BreadcrumbList

Private book file URL is forbidden in SEO output.

### Article

Required metadata inputs:
- title
- excerpt
- public image
- canonical href
- author
- publishedAt

Required JSON-LD:
- Article
- BreadcrumbList

## Catalog structured data contract

The first rendered catalog page exposes an `ItemList` containing only:

```text
name
public canonical URL
position
```

## Private route contract

Private/authenticated pages must resolve metadata equivalent to:

```text
robots.index = false
robots.follow = false
robots.nocache = true
```

Private route families are also disallowed in `robots.txt`.

## Sitemap contract

`/sitemap.xml` includes:
- home
- about-us
- courses catalog
- books catalog
- articles catalog
- privacy
- terms
- support
- every published course detail
- every published book detail
- every published article detail

It excludes:
- auth pages
- checkout/payment
- library/downloads
- orders
- protected learning pages
- API routes
- draft/hidden content (enforced by public backend catalog endpoints)

## Environment contract

Production must define:

```env
NEXT_PUBLIC_SITE_URL=https://dr-iyas.com
```

Optional:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
```

## Multilingual contract

Until locale-specific URLs are introduced, the application must not emit fake alternate language URLs for the same canonical path. `hreflang` becomes valid only after `/en/*` and `/ar/*` (or an equivalent distinct-URL strategy) exists.
