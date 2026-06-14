"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { BookItemView, BooksPageCopy } from "../books.types";

type DetailTabKey = "description" | "tableOfContents" | "authorBio";

type BookDetailTabsProps = Readonly<{
  book: BookItemView;
  labels: BooksPageCopy["detail"]["tabs"];
}>;

export function BookDetailTabs({ book, labels }: BookDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<DetailTabKey>("description");

  const tabs: readonly Readonly<{ key: DetailTabKey; label: string }>[] = [
    { key: "description", label: labels.description },
    { key: "tableOfContents", label: labels.tableOfContents },
    { key: "authorBio", label: labels.authorBio },
  ];

  return (
    <section>
      <div className="flex flex-wrap border-b border-border/70">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative px-0 pb-3 pt-1 text-xs font-bold transition duration-200 after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 hover:text-primary sm:me-8",
                isActive ? "text-primary after:scale-x-100" : "text-foreground/58",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-6 text-sm leading-7 text-foreground/72">
        {activeTab === "description" ? (
          <div className="space-y-4">
            {book.details.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <ul className="space-y-2 pt-1">
              {book.details.highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeTab === "tableOfContents" ? (
          <ol className="grid gap-3 sm:grid-cols-2">
            {book.details.tableOfContents.map((chapter, index) => (
              <li key={chapter} className="rounded-[8px] border border-border/70 bg-surface px-4 py-3 text-sm font-semibold text-foreground/74">
                <span className="me-2 text-primary">{String(index + 1).padStart(2, "0")}</span>
                {chapter}
              </li>
            ))}
          </ol>
        ) : null}

        {activeTab === "authorBio" ? (
          <div className="space-y-4">
            {book.details.authorBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
