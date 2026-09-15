const TARGET_URL = (process.env.TARGET_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const PUBLIC_URL = (process.env.PUBLIC_URL || "https://dr-iyas.com").replace(/\/$/, "");
const checks = [];

function record(level, name, details = "") {
  checks.push({ level, name, details });
  const icon = level === "pass" ? "✅" : level === "warn" ? "⚠️" : "❌";
  console.log(`${icon} ${name}${details ? ` — ${details}` : ""}`);
}

function pass(condition, name, details = "") {
  record(condition ? "pass" : "fail", name, details);
  return condition;
}

function warn(condition, name, details = "") {
  record(condition ? "pass" : "warn", name, details);
  return condition;
}

async function get(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${TARGET_URL}${path}`, {
      redirect: options.redirect ?? "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "IASS-Local-Production-QA/1.0",
        ...(options.headers || {}),
      },
    });
    return {
      status: response.status,
      finalUrl: response.url,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function decode(value = "") {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function attrs(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    result[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? "");
  }
  return result;
}

function head(html) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => attrs(match[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => attrs(match[0]));
  const metaName = (name) => metas.find((meta) => meta.name?.toLowerCase() === name.toLowerCase())?.content || "";
  const metaProperty = (name) => metas.find((meta) => meta.property?.toLowerCase() === name.toLowerCase())?.content || "";
  const canonical = links.find((link) => (link.rel || "").toLowerCase().split(/\s+/).includes("canonical"))?.href || "";
  const jsonLd = [];
  for (const match of html.matchAll(/<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      jsonLd.push(JSON.parse(match[1]));
    } catch {
      jsonLd.push({ __invalid: true });
    }
  }
  return {
    title: decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim()),
    description: metaName("description"),
    robots: metaName("robots"),
    canonical,
    ogTitle: metaProperty("og:title"),
    ogDescription: metaProperty("og:description"),
    ogUrl: metaProperty("og:url"),
    ogImage: metaProperty("og:image"),
    twitterCard: metaName("twitter:card"),
    twitterTitle: metaName("twitter:title"),
    htmlLang: html.match(/<html\b[^>]*lang=["']([^"']+)["']/i)?.[1] || "",
    jsonLd,
  };
}

function types(value, out = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => types(item, out));
  } else if (value && typeof value === "object") {
    const type = value["@type"];
    if (typeof type === "string") out.add(type);
    if (Array.isArray(type)) type.forEach((item) => typeof item === "string" && out.add(item));
    Object.values(value).forEach((item) => types(item, out));
  }
  return out;
}

function expectedCanonical(path) {
  return `${PUBLIC_URL}${path === "/" ? "/" : path}`;
}

function assertProductionUrls(serialized, name) {
  pass(!/localhost|127\.0\.0\.1/i.test(serialized), `${name}: no localhost URLs emitted`);
  pass(!serialized.includes(`${TARGET_URL}/`), `${name}: no local target URL emitted`);
}

async function publicPage(path, requiredTypes = []) {
  const response = await get(path);
  const metadata = head(response.body);
  const schemaTypes = types(metadata.jsonLd);
  pass(response.status === 200, `${path}: HTTP 200`, `status=${response.status}`);
  pass(Boolean(metadata.title), `${path}: title present`, metadata.title);
  warn(metadata.title.length >= 20 && metadata.title.length <= 70, `${path}: title length`, `length=${metadata.title.length}`);
  pass(Boolean(metadata.description), `${path}: description present`, `length=${metadata.description.length}`);
  warn(metadata.description.length >= 70 && metadata.description.length <= 165, `${path}: description length`, `length=${metadata.description.length}`);
  pass(metadata.canonical === expectedCanonical(path), `${path}: canonical exact`, metadata.canonical || "<missing>");
  pass(metadata.ogUrl === expectedCanonical(path), `${path}: og:url exact`, metadata.ogUrl || "<missing>");
  pass(Boolean(metadata.ogTitle && metadata.ogDescription && metadata.ogImage), `${path}: Open Graph complete`);
  pass(Boolean(metadata.twitterCard && metadata.twitterTitle), `${path}: Twitter metadata complete`);
  pass(!/noindex/i.test(metadata.robots), `${path}: indexable`, metadata.robots || "default");
  pass(["en", "ar"].includes(metadata.htmlLang), `${path}: html lang valid`, metadata.htmlLang || "<missing>");
  pass(!metadata.jsonLd.some((item) => item?.__invalid), `${path}: JSON-LD parses`);
  requiredTypes.forEach((type) => pass(schemaTypes.has(type), `${path}: ${type} JSON-LD`, [...schemaTypes].join(",") || "none"));
  assertProductionUrls(JSON.stringify({ metadata, jsonLd: metadata.jsonLd }), path);
  return { response, metadata, schemaTypes };
}

async function privatePage(path) {
  const response = await get(path);
  const metadata = head(response.body);
  pass([200, 401, 403, 404].includes(response.status), `${path}: safe private response`, `status=${response.status}; final=${response.finalUrl}`);
  pass(/noindex/i.test(metadata.robots) || /noindex/i.test(response.headers["x-robots-tag"] || ""), `${path}: noindex`, metadata.robots || response.headers["x-robots-tag"] || "<missing>");
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => decode(match[1].trim()));
}

async function main() {
  console.log(`Target build: ${TARGET_URL}`);
  console.log(`Expected public origin: ${PUBLIC_URL}`);

  const publicRoutes = [
    ["/", ["WebSite", "EducationalOrganization"]],
    ["/about-us", []],
    ["/courses", ["ItemList"]],
    ["/books", ["ItemList"]],
    ["/articles", ["ItemList"]],
    ["/privacy", []],
    ["/terms", []],
    ["/support", []],
  ];
  for (const [path, required] of publicRoutes) await publicPage(path, required);

  for (const path of ["/login", "/register", "/forgot-password", "/checkout", "/payment/success", "/library", "/orders", "/learn/courses/does-not-exist"]) {
    await privatePage(path);
  }

  const notFound = await get("/__qa_not_found__");
  const notFoundMeta = head(notFound.body);
  pass(notFound.status === 404, "404 route: returns 404", `status=${notFound.status}`);
  pass(/noindex/i.test(notFoundMeta.robots) || /noindex/i.test(notFound.headers["x-robots-tag"] || ""), "404 route: noindex", notFoundMeta.robots || "<missing>");

  for (const [path, expected] of [["/about", "/about-us"], ["/forget-password", "/forgot-password"]]) {
    const response = await get(path, { redirect: "manual" });
    pass([301, 308].includes(response.status), `${path}: permanent redirect`, `status=${response.status}; location=${response.headers.location || "<missing>"}`);
    const location = response.headers.location || "";
    const pathname = location.startsWith("http") ? new URL(location).pathname : location;
    pass(pathname === expected, `${path}: redirect target`, pathname || "<missing>");
  }

  for (const path of ["/courses?search=botox&sort=title", "/books?search=anatomy", "/articles?search=safety&sort=title"]) {
    const response = await get(path);
    const metadata = head(response.body);
    const pathname = new URL(`${PUBLIC_URL}${path}`).pathname;
    pass(response.status === 200, `${path}: HTTP 200`, `status=${response.status}`);
    pass(metadata.canonical === expectedCanonical(pathname), `${path}: canonical strips query`, metadata.canonical || "<missing>");
  }

  const arabic = await get("/courses", { headers: { cookie: "courses-locale=ar" } });
  const arabicMeta = head(arabic.body);
  pass(arabic.status === 200, "Arabic cookie: page loads", `status=${arabic.status}`);
  pass(arabicMeta.htmlLang === "ar", "Arabic cookie: html lang=ar", arabicMeta.htmlLang || "<missing>");
  warn(/[\u0600-\u06FF]/.test(arabicMeta.title + arabicMeta.description), "Arabic cookie: Arabic metadata emitted", arabicMeta.title);
  pass(arabicMeta.canonical === `${PUBLIC_URL}/courses`, "Arabic cookie: canonical remains production URL", arabicMeta.canonical || "<missing>");

  const robots = await get("/robots.txt");
  pass(robots.status === 200, "robots.txt: HTTP 200", `status=${robots.status}`);
  pass(robots.body.includes(`Sitemap: ${PUBLIC_URL}/sitemap.xml`), "robots.txt: production sitemap URL");
  for (const path of ["/api/", "/checkout", "/payment/", "/library", "/orders", "/learn/", "/login", "/register", "/forgot-password", "/forget-password"]) {
    pass(robots.body.includes(`Disallow: ${path}`), `robots.txt: disallows ${path}`);
  }
  assertProductionUrls(robots.body, "robots.txt");

  const sitemap = await get("/sitemap.xml");
  pass(sitemap.status === 200, "sitemap.xml: HTTP 200", `status=${sitemap.status}`);
  const urls = locs(sitemap.body);
  pass(urls.length >= 8, "sitemap.xml: at least static routes", `count=${urls.length}`);
  pass(urls.length === new Set(urls).size, "sitemap.xml: no duplicates", `count=${urls.length}`);
  pass(urls.every((url) => url.startsWith(`${PUBLIC_URL}/`) || url === PUBLIC_URL), "sitemap.xml: production origin only");
  pass(urls.every((url) => !/[?#]/.test(url)), "sitemap.xml: no query/hash URLs");
  const privatePrefixes = ["/checkout", "/payment", "/library", "/orders", "/learn", "/login", "/register", "/forgot-password", "/forget-password"];
  pass(urls.every((url) => !privatePrefixes.some((prefix) => new URL(url).pathname === prefix || new URL(url).pathname.startsWith(`${prefix}/`))), "sitemap.xml: excludes private routes");
  assertProductionUrls(sitemap.body, "sitemap.xml");

  for (const [prefix, schema] of [["/courses", "Course"], ["/books", "Book"], ["/articles", "Article"]]) {
    const dynamicUrl = urls.find((url) => {
      const pathname = new URL(url).pathname;
      return pathname.startsWith(`${prefix}/`) && pathname !== prefix;
    });
    pass(Boolean(dynamicUrl), `sitemap.xml: dynamic ${prefix} URL present`, dynamicUrl || "<missing>");
    if (dynamicUrl) await publicPage(new URL(dynamicUrl).pathname, [schema, "BreadcrumbList"]);
  }

  for (const url of urls.slice(0, 30)) {
    const pathname = new URL(url).pathname;
    const response = await get(pathname);
    pass(response.status === 200, `sitemap URL live locally: ${pathname}`, `status=${response.status}`);
  }

  const manifest = await get("/manifest.webmanifest");
  pass(manifest.status === 200, "manifest.webmanifest: HTTP 200", `status=${manifest.status}`);
  try {
    const payload = JSON.parse(manifest.body);
    pass(Boolean(payload.name && payload.short_name && payload.start_url && Array.isArray(payload.icons) && payload.icons.length), "manifest.webmanifest: required fields");
  } catch (error) {
    record("fail", "manifest.webmanifest: valid JSON", String(error));
  }

  const failures = checks.filter((check) => check.level === "fail");
  const warnings = checks.filter((check) => check.level === "warn");
  console.log(`\nLocal build audit: ${checks.length - failures.length - warnings.length} passed, ${warnings.length} warnings, ${failures.length} failed.`);
  if (failures.length) process.exit(1);
}

await main();
