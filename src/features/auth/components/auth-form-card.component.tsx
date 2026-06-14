"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, Mail, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { AuthFieldCopy, AuthFieldKey, AuthMode, AuthModeCopy } from "../auth.types";

type AuthFormCardProps = Readonly<{
  mode: AuthMode;
  copy: AuthModeCopy;
}>;

type FieldConfig = Readonly<{
  key: AuthFieldKey;
  type: string;
  autoComplete: string;
  icon: typeof Mail;
  className?: string;
}>;

const modeFields: Record<AuthMode, readonly FieldConfig[]> = {
  login: [
    { key: "email", type: "email", autoComplete: "email", icon: Mail },
    { key: "password", type: "password", autoComplete: "current-password", icon: Lock },
  ],
  register: [
    { key: "firstName", type: "text", autoComplete: "given-name", icon: UserRound },
    { key: "lastName", type: "text", autoComplete: "family-name", icon: UserRound },
    { key: "email", type: "email", autoComplete: "email", icon: Mail, className: "sm:col-span-2" },
    { key: "password", type: "password", autoComplete: "new-password", icon: Lock },
    { key: "confirmPassword", type: "password", autoComplete: "new-password", icon: Lock },
  ],
  "forgot-password": [{ key: "email", type: "email", autoComplete: "email", icon: Mail }],
};

function AuthInput({ field, config }: Readonly<{ field: AuthFieldCopy; config: FieldConfig }>) {
  const Icon = config.icon;

  return (
    <label className={cn("block", config.className)}>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-foreground/55">
        {field.label}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-[10px] border border-border bg-background px-4 text-foreground/72 shadow-[0_6px_18px_rgba(17,24,39,0.03)] transition duration-200 focus-within:border-primary/35 focus-within:ring-4 focus-within:ring-primary/10">
        <Icon className="h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
        <input
          type={config.type}
          name={config.key}
          autoComplete={config.autoComplete}
          placeholder={field.placeholder}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-foreground/38"
        />
      </span>
    </label>
  );
}

export function AuthFormCard({ mode, copy }: AuthFormCardProps) {
  const fields = modeFields[mode];
  const isRegister = mode === "register";
  const isLogin = mode === "login";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/95 p-5 shadow-[0_22px_70px_rgba(17,24,39,0.08)] backdrop-blur sm:p-8"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-12 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        <Link href="/" className="mb-8 inline-flex items-center transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
          <span className="relative block h-11 w-36">
            <Image
              src="/images/logo-blue.png"
              alt="IASS logo"
              fill
              sizes="144px"
              className="object-contain object-left rtl:object-right"
              priority
            />
          </span>
        </Link>

        <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/6 px-3 py-1.5 text-[0.7rem] font-black uppercase tracking-[0.14em] text-primary">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          {copy.eyebrow}
        </span>

        <h1 className="mt-5 font-display text-[2rem] font-black leading-tight tracking-[-0.04em] text-foreground sm:text-[2.4rem]">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-foreground/62">
          {copy.subtitle}
        </p>

        <form className="mt-8" onSubmit={(event) => event.preventDefault()}>
          <div className={cn("grid gap-4", isRegister && "sm:grid-cols-2")}>
            {fields.map((config) => {
              const field = copy.fields[config.key];
              if (!field) return null;

              return <AuthInput key={config.key} field={field} config={config} />;
            })}
          </div>

          {isLogin ? (
            <div className="mt-4 flex items-center justify-between gap-4 text-xs font-semibold text-foreground/62">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary accent-[var(--primary)]"
                />
                <span>{copy.rememberLabel}</span>
              </label>

              <Link href="/forgot-password" className="font-bold text-primary transition hover:text-primary-strong">
                {copy.forgotPasswordLabel}
              </Link>
            </div>
          ) : null}

          {isRegister && copy.termsLabel ? (
            <label className="mt-5 flex items-start gap-3 rounded-[12px] border border-border/70 bg-background/70 p-3 text-xs leading-5 text-foreground/62">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-[var(--primary)]"
              />
              <span>{copy.termsLabel}</span>
            </label>
          ) : null}

          {copy.helperText ? (
            <p className="mt-5 rounded-[12px] border border-primary/10 bg-primary/6 p-3 text-xs leading-5 text-foreground/62">
              {copy.helperText}
            </p>
          ) : null}

          <Button type="submit" className="mt-6 h-12 w-full rounded-[10px] text-sm font-black" size="md">
            {copy.submitLabel}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-foreground/58">
          {copy.switchPrompt}{" "}
          <Link href={copy.switchHref} className="font-black text-primary transition hover:text-primary-strong">
            {copy.switchLabel}
          </Link>
        </p>
      </div>
    </motion.section>
  );
}
