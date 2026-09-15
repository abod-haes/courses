import { writeFile } from "node:fs/promises";

const SITE_URL = (process.env.SITE_URL || "https://dr-iyas.com").replace(/\/$/, "");
const API_URL = (process.env.API_URL || "https://medical-courses.mustafafares.com/api").replace(/\/$/, "");
const USER_AGENT = "IASS-Production-QA/1.0 (+https://dr-iyas.com)";
const TIMEOUT_MS = 20_000;

const checks = [];
const pages = {};

function record(level, name, details = "") {
  checks.push({ level, name, details });
  const symbol = level === "pass" ? "✅" : level === "warn" ? "⚠️" : "❌";
  console.log(`${symbol} ${name}${details ? ` — ${details}` : ""}`);
}

function assert(condition, name, details = "") {
  record(condition ? "pass" : "fail", name, details);
  return condition;
}

function warn(condition, name, details = "") {
  record(condition ? "pass" : "warn", name, details);
  return condition;
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: options.redirect ?? "follow",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: options.accept ?? "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(options.headers || {}),
      },
    });
    const body = await response.text();
    return {
      ok: true,
      url,
      finalUrl: response.url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
      durationMs: Date.now() - started,
    };
  } catch (error) {
    return {
      ok: false,
      url,
      finalUrl: url,
      status: 0,
      headers: {},
      body: "",
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attributes(tag) {
  const result = {};
  const regex = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match;
  while ((match = regex.exec(tag))) {
    result[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? "");
  }
  return result;
}

function parseHead(html) {
  const title = decodeHtml((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim());
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const byName = (name) => metas.find((meta) => meta.name?.toLowerCase() === name.toLowerCase())?.content || "";
  const byProperty = (property) => metas.find((meta) => meta.property?.toLowerCase() === property.toLowerCase())?.content || "";
  const canonical = links.find((link) => (link.rel || "").toLowerCase().split(/\s+/).includes("canonical"))?.href || "";
  const jsonLd = [];
  for (const match of html.matchAll(/<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      jsonLd.push(JSON.parse(match[1]));
    } catch {
      jsonLd.push({ __invalidJsonLd: true, raw: match[1].slice(0, 500) });
    }
  }
  return {
    title,
    description: byName("description"),
    robots: byName("robots"),
    googlebot: byName("googlebot"),
    canonical,
    ogTitle: byProperty("og:title"),
    ogDescription: byProperty("og:description"),
    ogUrl: byProperty("og:url"),
    ogImage: byProperty("og:image"),
    twitterCard: byName("twitter:card"),
    twitterTitle: byName("twitter:title"),
    twitterDescription: byName("twitter:description"),
    htmlLang: html.match(/<html\b[^>]*lang=(?:"([^"]+)"|'([^']+)')/i)?.[1] || html.match(/<html\b[^>]*lang=(?:"([^"]+)"|'([^']+)')/i)?.[2] || "",
    jsonLd,
  };
}

function collectTypes(value, out = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectTypes(item, out));
    return out;
  }
  if (value && typeof value === "object") {
    const type = value["@type"];
    if (typeof type === "string") out.add(type);
    else if (Array.isArray(type)) type.forEach((entry) => typeof entry === "string" && out.add(entry));
    Object.values(value).forEach((entry) => collectTypes(entry, out));
  }
  return out;
}

function expectedCanonical(path) {
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}

async function auditPublicPage(path, { requireSchema = [] } = {}) {
  const result = await request(`${SITE_URL}${path}`);
  const head = parseHead(result.body);
  pages[path] = { ...result, body: undefined, head };

  assert(result.ok, `${path}: reachable`, result.error || `${result.durationMs}ms`);
  assert(result.status === 200, `${path}: HTTP 200`, `status=${result.status}; final=${result.finalUrl}`);
  assert(Boolean(head.title), `${path}: title present`, head.title);
  warn(head.title.length >= 20 && head.title.length <= 70, `${path}: title length 20-70`, `length=${head.title.length}`);
  assert(Boolean(head.description), `${path}: meta description present`, `length=${head.description.length}`);
  warn(head.description.length >= 70 && head.description.length <= 165, `${path}: description length 70-165`, `length=${head.description.length}`);
  assert(head.canonical === expectedCanonical(path), `${path}: canonical exact`, `actual=${head.canonical || "<missing>"}`);
  assert(!/localhost|127\.0\.0\.1/i.test(head.canonical), `${path}: canonical is not localhost`, head.canonical);
  assert(!/noindex/i.test(head.robots), `${path}: indexable`, head.robots || "robots default");
  assert(Boolean(head.ogTitle && head.ogDescription && head.ogUrl && head.ogImage), `${path}: Open Graph complete`, `og:url=${head.ogUrl || "<missing>"}`);
  assert(Boolean(head.twitterCard && head.twitterTitle && head.twitterDescription), `${path}: Twitter metadata complete`, head.twitterCard || "<missing>");
  warn(["en", "ar"].includes(head.htmlLang), `${path}: html lang is en/ar`, `lang=${head.htmlLang || "<missing>"}`);

  const types = collectTypes(head.jsonLd);
  assert(!head.jsonLd.some((entry) => entry?.__invalidJsonLd), `${path}: JSON-LD parses`);
  for (const schema of requireSchema) {
    assert(types.has(schema), `${path}: ${schema} JSON-LD present`, `types=${[...types].join(",") || "none"}`);
  }

  return { result, head, types };
}

async function auditPrivatePage(path) {
  const result = await request(`${SITE_URL}${path}`);
  const head = parseHead(result.body);
  pages[path] = { ...result, body: undefined, head };
  assert(result.ok, `${path}: reachable`, result.error || `${result.durationMs}ms`);
  assert([200, 401, 403, 404].includes(result.status), `${path}: private route safe status`, `status=${result.status}; final=${result.finalUrl}`);
  assert(/noindex/i.test(head.robots) || /noindex/i.test(result.headers["x-robots-tag"] || ""), `${path}: noindex enforced`, `meta=${head.robots || "<missing>"}; header=${result.headers["x-robots-tag"] || "<missing>"}`);
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => decodeHtml(match[1].trim()));
}

function firstDetailUrl(urls, prefix) {
  return urls.find((url) => {
    try {
      const path = new URL(url).pathname;
      return path.startsWith(`${prefix}/`) && path !== prefix;
    } catch {
      return false;
    }
  });
}

function pickArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.data)) return payload.data.data;
  return [];
}

async function auditBackendCatalog(resource) {
  const url = `${API_URL}/${resource}?locale=en&perPage=5&page=1`;
  const result = await request(url, { accept: "application/json" });
  assert(result.ok, `backend ${resource}: reachable`, result.error || `${result.durationMs}ms`);
  assert(result.status === 200, `backend ${resource}: HTTP 200`, `status=${result.status}`);
  let payload;
  try {
    payload = JSON.parse(result.body);
    record("pass", `backend ${resource}: JSON parses`);
  } catch (error) {
    record("fail", `backend ${resource}: JSON parses`, String(error));
    return [];
  }
  const items = pickArray(payload);
  warn(items.length > 0, `backend ${resource}: returns public items`, `count=${items.length}`);
  if (items[0]) {
    const slug = items[0].slug ?? items[0]?.data?.slug;
    const title = items[0].title ?? items[0]?.data?.title;
    warn(Boolean(slug), `backend ${resource}: first item has slug`, JSON.stringify(slug ?? null));
    warn(Boolean(title), `backend ${resource}: first item has title`, typeof title === "string" ? title : JSON.stringify(title ?? null));
  }
  return items;
}

async function main() {
  console.log(`Auditing site: ${SITE_URL}`);
  console.log(`Auditing backend read-only: ${API_URL}`);

  const home = await auditPublicPage("/", { requireSchema: ["WebSite", "EducationalOrganization"] });
  for (const path of ["/about-us", "/courses", "/books", "/articles", "/privacy", "/terms", "/support"]) {
    await auditPublicPage(path);
  }

  const securityHeaders = home.result.headers;
  assert(/max-age=/i.test(securityHeaders["strict-transport-security"] || ""), "HTTPS: HSTS enabled", securityHeaders["strict-transport-security"] || "<missing>");
  assert((securityHeaders["x-content-type-options"] || "").toLowerCase() === "nosniff", "Security: X-Content-Type-Options nosniff", securityHeaders["x-content-type-options"] || "<missing>");
  warn(Boolean(securityHeaders["referrer-policy"]), "Security: Referrer-Policy present", securityHeaders["referrer-policy"] || "<missing>");
  warn(Boolean(securityHeaders["content-security-policy"]), "Security: Content-Security-Policy present", securityHeaders["content-security-policy"] || "<missing>");

  for (const path of ["/login", "/register", "/forgot-password", "/checkout", "/payment/success", "/library", "/orders", "/learn/courses/does-not-exist"]) {
    await auditPrivatePage(path);
  }

  const notFound = await request(`${SITE_URL}/__qa-definitely-not-a-real-page__`);
  const notFoundHead = parseHead(notFound.body);
  assert(notFound.status === 404, "404: unknown route returns 404", `status=${notFound.status}`);
  assert(/noindex/i.test(notFoundHead.robots) || /noindex/i.test(notFound.headers["x-robots-tag"] || ""), "404: noindex present", notFoundHead.robots || notFound.headers["x-robots-tag"] || "<missing>");

  for (const [path, destination] of [["/about", "/about-us"], ["/forget-password", "/forgot-password"]]) {
    const result = await request(`${SITE_URL}${path}`, { redirect: "manual" });
    assert([301, 308].includes(result.status), `${path}: permanent redirect`, `status=${result.status}; location=${result.headers.location || "<missing>"}`);
    const location = result.headers.location || "";
    const normalized = location.startsWith("http") ? new URL(location).pathname : location;
    assert(normalized === destination, `${path}: redirect target ${destination}`, `location=${location || "<missing>"}`);
  }

  for (const path of ["/courses?search=botox&sort=title", "/books?search=anatomy", "/articles?search=safety&sort=title"]) {
    const result = await request(`${SITE_URL}${path}`);
    const head = parseHead(result.body);
    const basePath = new URL(`${SITE_URL}${path}`).pathname;
    assert(result.status === 200, `${path}: filtered URL HTTP 200`, `status=${result.status}`);
    assert(head.canonical === expectedCanonical(basePath), `${path}: canonical strips query`, `canonical=${head.canonical || "<missing>"}`);
  }

  const arabic = await request(`${SITE_URL}/courses`, { headers: { cookie: "courses-locale=ar" } });
  const arabicHead = parseHead(arabic.body);
  assert(arabic.status === 200, "Arabic cookie: courses page loads", `status=${arabic.status}`);
  assert(arabicHead.htmlLang === "ar", "Arabic cookie: html lang=ar", `lang=${arabicHead.htmlLang || "<missing>"}`);
  warn(/[\u0600-\u06FF]/.test(arabicHead.title + arabicHead.description), "Arabic cookie: Arabic metadata emitted", arabicHead.title);

  const robots = await request(`${SITE_URL}/robots.txt`, { accept: "text/plain" });
  assert(robots.status === 200, "robots.txt: HTTP 200", `status=${robots.status}`);
  assert(new RegExp(`Sitemap:\\s*${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap\\.xml`, "i").test(robots.body), "robots.txt: sitemap declared", robots.body.slice(0, 500));
  for (const path of ["/api/", "/checkout", "/payment/", "/library", "/orders", "/learn/", "/login", "/register", "/forgot-password", "/forget-password"]) {
    assert(robots.body.includes(`Disallow: ${path}`), `robots.txt: disallows ${path}`);
  }

  const sitemap = await request(`${SITE_URL}/sitemap.xml`, { accept: "application/xml,text/xml" });
  assert(sitemap.status === 200, "sitemap.xml: HTTP 200", `status=${sitemap.status}`);
  const urls = sitemapUrls(sitemap.body);
  assert(urls.length >= 8, "sitemap.xml: contains public URLs", `count=${urls.length}`);
  assert(new Set(urls).size === urls.length, "sitemap.xml: no duplicate URLs", `count=${urls.length}`);
  assert(urls.every((url) => url.startsWith(`${SITE_URL}/`) || url === SITE_URL), "sitemap.xml: all URLs use production origin");
  assert(urls.every((url) => !/[?&#]/.test(url)), "sitemap.xml: no query/hash URLs");
  const forbidden = ["/api", "/checkout", "/payment", "/library", "/orders", "/learn", "/login", "/register", "/forgot-password", "/forget-password"];
  assert(urls.every((url) => !forbidden.some((path) => new URL(url).pathname === path || new URL(url).pathname.startsWith(`${path}/`))), "sitemap.xml: excludes private routes");

  const dynamicTargets = [
    ["/courses", "Course"],
    ["/books", "Book"],
    ["/articles", "Article"],
  ];
  for (const [prefix, schema] of dynamicTargets) {
    const target = firstDetailUrl(urls, prefix);
    warn(Boolean(target), `sitemap.xml: has dynamic ${prefix} detail URL`, target || "none found");
    if (target) {
      const path = new URL(target).pathname;
      await auditPublicPage(path, { requireSchema: [schema, "BreadcrumbList"] });
    }
  }

  const sampleUrls = urls.slice(0, 30);
  for (const url of sampleUrls) {
    const result = await request(url);
    assert(result.status === 200, `sitemap URL live: ${new URL(url).pathname}`, `status=${result.status}; ${result.durationMs}ms`);
  }

  const manifest = await request(`${SITE_URL}/manifest.webmanifest`, { accept: "application/manifest+json,application/json" });
  assert(manifest.status === 200, "manifest.webmanifest: HTTP 200", `status=${manifest.status}`);
  try {
    const payload = JSON.parse(manifest.body);
    assert(Boolean(payload.name && payload.short_name && payload.start_url && Array.isArray(payload.icons) && payload.icons.length), "manifest.webmanifest: required fields present");
  } catch (error) {
    record("fail", "manifest.webmanifest: valid JSON", String(error));
  }

  await auditBackendCatalog("courses");
  await auditBackendCatalog("books");
  await auditBackendCatalog("articles");

  const titleMap = new Map();
  const descriptionMap = new Map();
  for (const [path, value] of Object.entries(pages)) {
    if (!value.head?.title || value.head.robots?.includes("noindex")) continue;
    const titlePaths = titleMap.get(value.head.title) || [];
    titlePaths.push(path);
    titleMap.set(value.head.title, titlePaths);
    const descPaths = descriptionMap.get(value.head.description) || [];
    descPaths.push(path);
    descriptionMap.set(value.head.description, descPaths);
  }
  const duplicateTitles = [...titleMap.entries()].filter(([, paths]) => paths.length > 1);
  const duplicateDescriptions = [...descriptionMap.entries()].filter(([description, paths]) => description && paths.length > 1);
  assert(duplicateTitles.length === 0, "SEO: no duplicate titles in audited public pages", JSON.stringify(duplicateTitles));
  warn(duplicateDescriptions.length === 0, "SEO: no duplicate descriptions in audited public pages", JSON.stringify(duplicateDescriptions));

  const summary = {
    site: SITE_URL,
    api: API_URL,
    generatedAt: new Date().toISOString(),
    totals: {
      pass: checks.filter((check) => check.level === "pass").length,
      warn: checks.filter((check) => check.level === "warn").length,
      fail: checks.filter((check) => check.level === "fail").length,
    },
    checks,
    pages,
  };
  await writeFile("production-audit.json", JSON.stringify(summary, null, 2));
  console.log(`\nSummary: ${summary.totals.pass} passed, ${summary.totals.warn} warnings, ${summary.totals.fail} failed.`);
  if (summary.totals.fail > 0) process.exitCode = 1;
}

await main();
