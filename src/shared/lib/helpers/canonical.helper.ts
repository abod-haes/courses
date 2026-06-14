export function normalizeCanonicalPath(path: string) {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  return path;
}

