import Link from "next/link";

type BreadcrumbItem = Readonly<{
  label: string;
  href?: string;
}>;

type BreadcrumbsProps = Readonly<{
  items: BreadcrumbItem[];
}>;

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-foreground/60">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-foreground" : ""}>{item.label}</span>
            )}
            {!isLast ? <span aria-hidden="true">/</span> : null}
          </div>
        );
      })}
    </nav>
  );
}

