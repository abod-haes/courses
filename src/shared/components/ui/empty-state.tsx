import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateProps = Readonly<{
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}>;

export function EmptyState({ title, description, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="rounded-[18px] border border-border bg-surface p-8 text-center shadow-[0_24px_80px_rgba(17,24,39,0.08)]">
      {icon ? <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[16px] bg-brand-soft text-primary">{icon}</div> : null}
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-foreground/70">{description}</p>
      {actionLabel && actionHref ? (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-[10px] bg-primary px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(29,23,213,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-strong"
          >
            {actionLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
