"use client";

import { ChevronDown, Check } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { cn } from "@/shared/lib/utils";

type SortOption = Readonly<{
  value: string;
  label: string;
}>;

type ArticleSortSelectProps = Readonly<{
  name: string;
  value: string;
  label: string;
  options: readonly SortOption[];
}>;

export function ArticleSortSelect({ name, value, label, options }: ArticleSortSelectProps) {
  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue) ?? options[0],
    [options, selectedValue],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const selectedIndex = Math.max(
      0,
      options.findIndex((option) => option.value === selectedValue),
    );

    window.requestAnimationFrame(() => {
      optionRefs.current[selectedIndex]?.focus();
    });
  }, [open, options, selectedValue]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function chooseOption(nextValue: string) {
    setSelectedValue(nextValue);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleButtonKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleListKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!open) {
      return;
    }

    const currentIndex = options.findIndex((option) => option.value === selectedValue);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      setSelectedValue(options[nextIndex].value);
      optionRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = (currentIndex - 1 + options.length) % options.length;
      setSelectedValue(options[nextIndex].value);
      optionRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setSelectedValue(options[0].value);
      optionRefs.current[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setSelectedValue(options[options.length - 1].value);
      optionRefs.current[options.length - 1]?.focus();
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">{label}</span>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-[7px] border border-border bg-surface px-4 text-left text-sm text-foreground/78 shadow-[0_6px_18px_rgba(17,24,39,0.03)] transition duration-200 hover:border-primary/20 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
          open && "border-primary/35 bg-white ring-4 ring-primary/10",
        )}
      >
        <span className="truncate font-medium">{selectedOption?.label}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition duration-200", open && "rotate-180 text-primary")} aria-hidden="true" />
      </button>

      <input type="hidden" name={name} value={selectedValue} />

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className="absolute z-20 mt-2 max-h-60 w-full overflow-hidden rounded-[14px] border border-border/70 bg-surface shadow-[0_18px_40px_rgba(17,24,39,0.12)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={isSelected}
                onClick={() => chooseOption(option.value)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition duration-200 hover:bg-primary/5",
                  isSelected ? "bg-primary/8 text-primary" : "text-foreground/76",
                )}
              >
                <span className="font-medium">{option.label}</span>
                {isSelected ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
