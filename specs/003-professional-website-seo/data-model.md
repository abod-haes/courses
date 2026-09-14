# Data Model: SEO View Data

This feature does not add a database table. It extends frontend view models with public SEO-safe fields already returned by the backend.

## Course SEO view

```ts
type CourseSeoView = {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  category: string;
  instructor?: string;
  amount?: number;
  currency?: string;
  publishedAt?: string;
  updatedAt?: string;
};
```

Used by:
- detail metadata
- Course JSON-LD
- sitemap

## Book SEO view

```ts
type BookSeoView = {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  author: string;
  isbn?: string;
  amount?: number;
  currency?: string;
  publishedAt?: string;
  updatedAt?: string;
};
```

Used by:
- detail metadata
- Book JSON-LD
- sitemap

## Article SEO view

```ts
type ArticleSeoView = {
  title: string;
  excerpt: string;
  href: string;
  image: string;
  alt: string;
  author: string;
  publishedAt: string;
};
```

Used by:
- detail metadata
- Article JSON-LD
- sitemap

## Catalog list schema input

```ts
type SeoListItem = {
  name: string;
  path: string;
};
```

Used to build Schema.org `ItemList` without copying protected entity data.

## SEO configuration

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (optional)
NEXT_PUBLIC_BING_SITE_VERIFICATION (optional)
```

No secrets, payment identifiers, signed URLs, user information, or protected media fields are part of the SEO data model.
