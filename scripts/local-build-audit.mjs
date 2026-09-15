const TARGET = (process.env.TARGET_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const PUBLIC = (process.env.PUBLIC_URL || "https://dr-iyas.com").replace(/\/$/, "");
const checks = [];

function add(level, name, details = "") {
  checks.push({ level, name, details });
  console.log(`${level === "pass" ? "✅" : level === "warn" ? "⚠️" : "❌"} ${name}${details ? ` — ${details}` : ""}`);
}
function ok(value, name, details = "") { add(value ? "pass" : "fail", name, details); return value; }
function warn(value, name, details = "") { add(value ? "pass" : "warn", name, details); return value; }

async function get(path, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${TARGET}${path}`, {
      redirect: init.redirect ?? "follow",
      signal: controller.signal,
      headers: { "user-agent": "IASS-QA/1.0", ...(init.headers || {}) },
    });
    return { status: response.status, url: response.url, headers: Object.fromEntries(response.headers.entries()), body: await response.text() };
  } finally { clearTimeout(timer); }
}

function decode(value = "") {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? "");
  return out;
}
function parse(html) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
  const byName = (name) => metas.find((m) => m.name?.toLowerCase() === name.toLowerCase())?.content || "";
  const byProp = (name) => metas.find((m) => m.property?.toLowerCase() === name.toLowerCase())?.content || "";
  const jsonLd = [];
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { jsonLd.push(JSON.parse(m[1])); } catch { jsonLd.push({ __invalid: true }); }
  }
  return {
    title: decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim()),
    description: byName("description"), robots: byName("robots"),
    canonical: links.find((l) => (l.rel || "").toLowerCase().split(/\s+/).includes("canonical"))?.href || "",
    ogTitle: byProp("og:title"), ogDescription: byProp("og:description"), ogUrl: byProp("og:url"), ogImage: byProp("og:image"),
    twitterCard: byName("twitter:card"), twitterTitle: byName("twitter:title"), twitterDescription: byName("twitter:description"),
    lang: html.match(/<html\b[^>]*lang=["']([^"']+)["']/i)?.[1] || "", jsonLd,
  };
}
function schemaTypes(value, out = new Set()) {
  if (Array.isArray(value)) value.forEach((v) => schemaTypes(v, out));
  else if (value && typeof value === "object") {
    const t = value["@type"];
    if (typeof t === "string") out.add(t); else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && out.add(x));
    Object.values(value).forEach((v) => schemaTypes(v, out));
  }
  return out;
}
function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    if (url.pathname === "/") url.pathname = "";
    return url.toString().replace(/\/$/, "");
  } catch { return value.replace(/\/$/, ""); }
}
function expected(path) { return path === "/" ? PUBLIC : `${PUBLIC}${path}`; }
function noLocal(value, name) { ok(!/localhost|127\.0\.0\.1/i.test(value), `${name}: no localhost URLs emitted`); }

async function publicPage(path, required = []) {
  const r = await get(path); const h = parse(r.body); const types = schemaTypes(h.jsonLd);
  ok(r.status === 200, `${path}: HTTP 200`, `status=${r.status}`);
  ok(Boolean(h.title), `${path}: title`, h.title); warn(h.title.length >= 20 && h.title.length <= 70, `${path}: title length`, `${h.title.length}`);
  ok(Boolean(h.description), `${path}: description`, `length=${h.description.length}`); warn(h.description.length >= 70 && h.description.length <= 165, `${path}: description length`, `${h.description.length}`);
  ok(normalizeUrl(h.canonical) === normalizeUrl(expected(path)), `${path}: canonical`, h.canonical || "missing");
  ok(normalizeUrl(h.ogUrl) === normalizeUrl(expected(path)), `${path}: og:url`, h.ogUrl || "missing");
  ok(Boolean(h.ogTitle && h.ogDescription && h.ogImage), `${path}: Open Graph complete`, `image=${h.ogImage || "missing"}`);
  ok(Boolean(h.twitterCard && h.twitterTitle && h.twitterDescription), `${path}: Twitter metadata complete`);
  ok(!/noindex/i.test(h.robots), `${path}: indexable`, h.robots || "default");
  ok(["en", "ar"].includes(h.lang), `${path}: lang`, h.lang || "missing");
  ok(!h.jsonLd.some((x) => x?.__invalid), `${path}: JSON-LD parses`);
  required.forEach((type) => ok(types.has(type), `${path}: ${type} schema`, [...types].join(",") || "none"));
  noLocal(JSON.stringify(h), path);
  return { r, h, types };
}
async function privatePage(path) {
  const r = await get(path); const h = parse(r.body);
  ok([200, 401, 403, 404].includes(r.status), `${path}: private response`, `status=${r.status}`);
  ok(/noindex/i.test(h.robots) || /noindex/i.test(r.headers["x-robots-tag"] || ""), `${path}: noindex`, h.robots || r.headers["x-robots-tag"] || "missing");
}
function sitemapUrls(xml) { return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => decode(m[1].trim())); }

async function main() {
  for (const [path, schemas] of [["/", ["WebSite", "EducationalOrganization"]], ["/about-us", []], ["/courses", ["ItemList"]], ["/books", ["ItemList"]], ["/articles", ["ItemList"]], ["/privacy", []], ["/terms", []], ["/support", []]]) await publicPage(path, schemas);

  for (const path of ["/login", "/register", "/forgot-password", "/checkout", "/payment/success", "/library", "/orders", "/learn/courses/does-not-exist"]) await privatePage(path);

  const nf = await get("/__qa_missing_page__"); const nfh = parse(nf.body);
  ok(nf.status === 404, "404: correct status", `status=${nf.status}`); ok(/noindex/i.test(nfh.robots) || /noindex/i.test(nf.headers["x-robots-tag"] || ""), "404: noindex");

  for (const [from, to] of [["/about", "/about-us"], ["/forget-password", "/forgot-password"]]) {
    const r = await get(from, { redirect: "manual" }); const location = r.headers.location || ""; const path = location.startsWith("http") ? new URL(location).pathname : location;
    ok([301, 308].includes(r.status), `${from}: permanent redirect`, `status=${r.status}`); ok(path === to, `${from}: redirect target`, path);
  }

  for (const path of ["/courses?search=botox&sort=title", "/books?search=anatomy", "/articles?search=safety&sort=title"]) {
    const r = await get(path); const h = parse(r.body); const pathname = new URL(`${PUBLIC}${path}`).pathname;
    ok(r.status === 200, `${path}: HTTP 200`); ok(normalizeUrl(h.canonical) === normalizeUrl(expected(pathname)), `${path}: query canonical`, h.canonical);
  }

  const ar = await get("/courses", { headers: { cookie: "courses-locale=ar" } }); const arh = parse(ar.body);
  ok(ar.status === 200, "Arabic: loads"); ok(arh.lang === "ar", "Arabic: html lang", arh.lang); warn(/[\u0600-\u06FF]/.test(arh.title + arh.description), "Arabic: localized metadata", arh.title);

  const robots = await get("/robots.txt"); ok(robots.status === 200, "robots.txt: HTTP 200"); ok(robots.body.includes(`Sitemap: ${PUBLIC}/sitemap.xml`), "robots.txt: production sitemap");
  for (const path of ["/api/", "/checkout", "/payment/", "/library", "/orders", "/learn/", "/login", "/register", "/forgot-password", "/forget-password"]) ok(robots.body.includes(`Disallow: ${path}`), `robots.txt: disallow ${path}`);
  noLocal(robots.body, "robots.txt");

  const sitemap = await get("/sitemap.xml"); const urls = sitemapUrls(sitemap.body);
  ok(sitemap.status === 200, "sitemap.xml: HTTP 200"); ok(urls.length >= 8, "sitemap.xml: URLs present", `count=${urls.length}`); ok(urls.length === new Set(urls).size, "sitemap.xml: unique URLs");
  ok(urls.every((u) => normalizeUrl(u).startsWith(PUBLIC)), "sitemap.xml: production origin"); ok(urls.every((u) => !/[?#]/.test(u)), "sitemap.xml: no query/hash");
  const privatePrefixes = ["/checkout", "/payment", "/library", "/orders", "/learn", "/login", "/register", "/forgot-password", "/forget-password"];
  ok(urls.every((u) => !privatePrefixes.some((p) => new URL(u).pathname === p || new URL(u).pathname.startsWith(`${p}/`))), "sitemap.xml: excludes private routes"); noLocal(sitemap.body, "sitemap.xml");

  for (const [prefix, schema] of [["/courses", "Course"], ["/books", "Book"], ["/articles", "Article"]]) {
    const url = urls.find((u) => { const p = new URL(u).pathname; return p.startsWith(`${prefix}/`) && p !== prefix; });
    ok(Boolean(url), `sitemap.xml: dynamic ${prefix} URL`, url || "missing"); if (url) await publicPage(new URL(url).pathname, [schema, "BreadcrumbList"]);
  }
  for (const url of urls.slice(0, 30)) { const r = await get(new URL(url).pathname); ok(r.status === 200, `sitemap URL: ${new URL(url).pathname}`, `status=${r.status}`); }

  const manifest = await get("/manifest.webmanifest"); ok(manifest.status === 200, "manifest: HTTP 200");
  try { const m = JSON.parse(manifest.body); ok(Boolean(m.name && m.short_name && m.start_url && m.icons?.length), "manifest: required fields"); } catch (e) { add("fail", "manifest: valid JSON", String(e)); }

  const fails = checks.filter((c) => c.level === "fail"); const warnings = checks.filter((c) => c.level === "warn");
  console.log(`\nQA summary: ${checks.length - fails.length - warnings.length} passed, ${warnings.length} warnings, ${fails.length} failed.`); if (fails.length) process.exit(1);
}
await main();
