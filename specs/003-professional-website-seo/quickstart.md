# Quickstart: Validate Professional SEO

## Local validation

```bash
npm ci
npm run lint
npm run build
npm run start
```

Set a local canonical origin before building if you want production-like metadata:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Routes to inspect

Public/indexable:

```text
/
/about-us
/courses
/courses/{published-slug}
/books
/books/{published-slug}
/articles
/articles/{published-slug}
/privacy
/terms
/support
/robots.txt
/sitemap.xml
/manifest.webmanifest
```

Private/noindex:

```text
/login
/register
/forgot-password
/checkout
/checkout/success
/checkout/cancel
/payment/success
/payment/cancel
/library
/library/books/{id}/download
/orders
/learn/courses/{courseId}
/learn/courses/{courseId}/lessons/{lessonId}
```

## Validation checklist

1. View source/head and confirm a single canonical URL.
2. Confirm public detail pages have unique title and description.
3. Confirm Open Graph/Twitter image URLs are absolute.
4. Confirm private pages contain noindex/nofollow robots metadata.
5. Confirm `robots.txt` points to `/sitemap.xml` and blocks private route families.
6. Confirm `sitemap.xml` contains real published course/book/article URLs.
7. Confirm dynamic sitemap URLs use `NEXT_PUBLIC_SITE_URL`.
8. Validate Course/Book/Article/Breadcrumb JSON-LD with a structured-data validator.
9. Confirm JSON-LD contains no lesson media, book download URL, order ID, payment session, or user data.
10. Confirm legacy `/about` redirects permanently to `/about-us`.

## Production configuration

Hostinger:

```env
NEXT_PUBLIC_SITE_URL=https://dr-iyas.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token if configured>
NEXT_PUBLIC_BING_SITE_VERIFICATION=<token if configured>
```

After deployment, submit:

```text
https://dr-iyas.com/sitemap.xml
```

to Google Search Console and Bing Webmaster Tools.
