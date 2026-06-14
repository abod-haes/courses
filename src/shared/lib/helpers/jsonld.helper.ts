type JsonLdValue = Record<string, unknown> | Record<string, unknown>[];

export function createJsonLdScript(value: JsonLdValue) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

