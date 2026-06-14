type BreadcrumbInput = Readonly<{
  label: string;
  href?: string;
}>;

export function buildBreadcrumbItems(items: BreadcrumbInput[]) {
  return items.map((item) => ({
    label: item.label,
    ...(item.href ? { href: item.href } : {}),
  }));
}

