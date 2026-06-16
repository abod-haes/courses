import Image from "next/image";
import Link from "next/link";
import { BookOpen, GraduationCap, X } from "lucide-react";
import type { CheckoutCopy, CheckoutItemView } from "../checkout.types";

type CheckoutItemRowProps = Readonly<{
  item: CheckoutItemView;
  copy: CheckoutCopy;
  compact?: boolean;
}>;

export function CheckoutItemRow({ item, copy, compact = false }: CheckoutItemRowProps) {
  const Icon = item.type === "course" ? GraduationCap : BookOpen;

  return (
    <article className="group rounded-[12px] border border-border/70 bg-surface p-3 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_14px_34px_rgba(17,24,39,0.08)] motion-reduce:transform-none">
      <div className="flex gap-4">
        <Link href={item.href} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-section-bg sm:h-24 sm:w-24">
          <Image src={item.image} alt={item.imageAlt} fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-105" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-primary">
              <Icon className="h-3 w-3" aria-hidden="true" />
              {item.typeLabel}
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-bold text-emerald-700 dark:text-emerald-300">
              {item.accessLabel}
            </span>
          </div>

          <Link href={item.href} className="mt-2 block text-sm font-black leading-5 text-foreground transition hover:text-primary sm:text-base">
            {item.title}
          </Link>
          {!compact ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-foreground/60">{item.description}</p> : null}

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm font-black text-foreground">{item.price}</p>
            {!compact ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.68rem] font-bold text-foreground/45 transition hover:bg-error/10 hover:text-error"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                {copy.checkout.remove}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
