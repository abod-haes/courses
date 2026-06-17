"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Mail, UserRound } from "lucide-react";
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
      <span className="mb-1.5 block text-[0.68rem] font-bold leading-none text-foreground/56">
        {field.label}
      </span>
      <span className="flex h-[2.35rem] items-center gap-2.5 rounded-full border border-border/75 bg-background/92 px-3.5 text-foreground/74 shadow-[0_5px_16px_rgba(17,24,39,0.025)] transition duration-200 focus-within:border-primary/45 focus-within:bg-surface focus-within:ring-3 focus-within:ring-primary/10 sm:h-[2.45rem]">
        <Icon className="h-3.5 w-3.5 shrink-0 text-primary/72" aria-hidden="true" />
        <input
          type={config.type}
          name={config.key}
          autoComplete={config.autoComplete}
          placeholder={field.placeholder}
          className="w-full bg-transparent text-[0.78rem] font-medium text-foreground outline-none placeholder:text-[0.76rem] placeholder:font-medium placeholder:text-foreground/32 sm:text-[0.8rem] sm:placeholder:text-[0.78rem]"
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
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-[1.25rem] border border-border/60 bg-surface/96 p-4 text-center shadow-[0_18px_48px_rgba(17,24,39,0.065)] backdrop-blur sm:p-5 lg:p-5",
        isRegister ? "max-w-[27.5rem]" : "max-w-[23.5rem]",
      )}
    >
      <div className="pointer-events-none absolute -right-24 -top-28 h-48 w-48 rounded-full bg-primary/6 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-5 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-center">
          <Link href="/" className="inline-flex items-center transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
            <span className="relative block h-6 w-[4.9rem] sm:h-7 sm:w-[5.5rem]">
              <Image
                src="/images/logo-blue.png"
                alt="IASS logo"
                fill
                sizes="88px"
                className="object-contain"
                priority
              />
            </span>
          </Link>
        </div>

        <h1 className="text-[1.25rem] font-black leading-tight tracking-[-0.03em] text-foreground sm:text-[1.5rem]">
          {copy.title}
        </h1>
        <p className="mx-auto mt-2 max-w-[24rem] text-[0.76rem] leading-5 text-foreground/60 sm:text-[0.8rem]">
          {copy.subtitle}
        </p>

        <form className="mt-4" onSubmit={(event) => event.preventDefault()}>
          <div className={cn("grid gap-3 text-start", isRegister && "sm:grid-cols-2")}>{fields.map((config) => {
            const field = copy.fields[config.key];
            if (!field) return null;

            return <AuthInput key={config.key} field={field} config={config} />;
          })}</div>

          {isLogin ? (
            <div className="mt-3 flex items-center justify-between gap-3 text-[0.7rem] font-semibold text-foreground/60">
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
            <label className="mt-3 flex items-start gap-2.5 rounded-[1rem] border border-border/65 bg-background/72 p-2.5 text-start text-[0.68rem] leading-5 text-foreground/60">
              <input
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 rounded border-border text-primary accent-[var(--primary)]"
              />
              <span>{copy.termsLabel}</span>
            </label>
          ) : null}

          {copy.helperText ? (
            <p className="mt-3 rounded-[1rem] border border-primary/10 bg-primary/6 p-2.5 text-[0.7rem] leading-5 text-foreground/60">
              {copy.helperText}
            </p>
          ) : null}

          <Button type="submit" className="mt-4 h-[2.55rem] w-full rounded-full text-[0.8rem] font-black shadow-[0_14px_30px_rgba(29,23,213,0.16)] sm:h-[2.7rem]" size="md">
            {copy.submitLabel}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.72rem] text-foreground/56">
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
