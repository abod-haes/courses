"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Home, Lock, Mail, UserRound } from "lucide-react";
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
      <span className="mb-1.5 block text-[0.62rem] font-black uppercase tracking-[0.1em] text-foreground/48">
        {field.label}
      </span>
      <span className="flex h-10 items-center gap-2.5 rounded-[0.7rem] border border-border/80 bg-background/90 px-3 text-foreground/72 shadow-[0_5px_14px_rgba(17,24,39,0.025)] transition duration-200 focus-within:border-primary/40 focus-within:bg-surface focus-within:ring-3 focus-within:ring-primary/10 sm:h-11">
        <Icon className="h-3.5 w-3.5 shrink-0 text-primary/72" aria-hidden="true" />
        <input
          type={config.type}
          name={config.key}
          autoComplete={config.autoComplete}
          placeholder={field.placeholder}
          className="w-full bg-transparent text-[0.82rem] font-semibold text-foreground outline-none placeholder:text-foreground/36"
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
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[25.5rem] overflow-hidden rounded-[1.25rem] border border-border/70 bg-surface/96 p-4 shadow-[0_18px_52px_rgba(17,24,39,0.07)] backdrop-blur sm:max-w-[27rem] sm:p-5 lg:p-6"
    >
      <div className="pointer-events-none absolute -right-28 -top-28 h-52 w-52 rounded-full bg-primary/7 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-4 h-52 w-52 rounded-full bg-cyan-400/8 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
            <span className="relative block h-7 w-20 sm:h-8 sm:w-24">
              <Image
                src="/images/logo-blue.png"
                alt="IASS logo"
                fill
                sizes="96px"
                className="object-contain object-left rtl:object-right"
                priority
              />
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-2.5 py-1.5 text-[0.7rem] font-bold text-foreground/62 transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            {copy.homeLabel}
          </Link>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/6 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-primary">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          {copy.eyebrow}
        </span>

        <h1 className="mt-4 font-display text-[1.55rem] font-black leading-tight tracking-[-0.035em] text-foreground sm:text-[1.85rem]">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-md text-[0.82rem] leading-6 text-foreground/62">
          {copy.subtitle}
        </p>

        <form className="mt-5" onSubmit={(event) => event.preventDefault()}>
          <div className={cn("grid gap-3", isRegister && "sm:grid-cols-2")}>{fields.map((config) => {
            const field = copy.fields[config.key];
            if (!field) return null;

            return <AuthInput key={config.key} field={field} config={config} />;
          })}</div>

          {isLogin ? (
            <div className="mt-3 flex items-center justify-between gap-3 text-[0.72rem] font-semibold text-foreground/62">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-border text-primary accent-[var(--primary)]"
                />
                <span>{copy.rememberLabel}</span>
              </label>

              <Link href="/forgot-password" className="font-bold text-primary transition hover:text-primary-strong">
                {copy.forgotPasswordLabel}
              </Link>
            </div>
          ) : null}

          {isRegister && copy.termsLabel ? (
            <label className="mt-4 flex items-start gap-2.5 rounded-[0.8rem] border border-border/70 bg-background/70 p-2.5 text-[0.72rem] leading-5 text-foreground/62">
              <input
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 rounded border-border text-primary accent-[var(--primary)]"
              />
              <span>{copy.termsLabel}</span>
            </label>
          ) : null}

          {copy.helperText ? (
            <p className="mt-4 rounded-[0.8rem] border border-primary/10 bg-primary/6 p-2.5 text-[0.72rem] leading-5 text-foreground/62">
              {copy.helperText}
            </p>
          ) : null}

          <Button type="submit" className="mt-5 h-10 w-full rounded-[0.7rem] text-[0.82rem] font-black sm:h-11" size="md">
            {copy.submitLabel}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.78rem] text-foreground/58">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-foreground/62 transition hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            {copy.homeLabel}
          </Link>

          <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />

          <p>
            {copy.switchPrompt}{" "}
            <Link href={copy.switchHref} className="font-black text-primary transition hover:text-primary-strong">
              {copy.switchLabel}
            </Link>
          </p>
        </div>
      </div>
    </motion.section>
  );
}
