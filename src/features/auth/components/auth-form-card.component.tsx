"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { ApiError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { loginUser, registerUser, requestPasswordReset } from "../api/auth.api";
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
  const isPassword = config.type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = isPassword && isPasswordVisible ? "text" : config.type;
  const inputId = `auth-${config.key}`;

  return (
    <label className={cn("block", config.className)} htmlFor={inputId}>
      <span className="mb-1.5 block text-[0.68rem] font-bold leading-none text-foreground/56">
        {field.label}
      </span>
      <span className="flex h-[2.35rem] items-center gap-2.5 rounded-md border border-border/75 bg-background/92 px-3.5 text-foreground/74 shadow-[0_5px_16px_rgba(17,24,39,0.025)] transition duration-200 focus-within:border-primary/45 focus-within:bg-surface focus-within:ring-3 focus-within:ring-primary/10 sm:h-[2.45rem]">
        <Icon className="h-3.5 w-3.5 shrink-0 text-primary/72" aria-hidden="true" />
        <Input
          id={inputId}
          type={inputType}
          name={config.key}
          autoComplete={config.autoComplete}
          placeholder={field.placeholder}
          required
          minLength={isPassword ? 8 : undefined}
          className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-[0.78rem] font-medium text-foreground shadow-none outline-none placeholder:text-[0.76rem] placeholder:font-medium placeholder:text-foreground/32 focus:border-transparent focus:bg-transparent focus:ring-0 sm:text-[0.8rem] sm:placeholder:text-[0.78rem]"
        />
        {isPassword ? (
          <button
            type="button"
            className="-me-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary/58 transition duration-200 hover:bg-primary/8 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
          >
            {isPasswordVisible ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
          </button>
        ) : null}
      </span>
    </label>
  );
}

function AuthCheckbox({
  children,
  variant = "plain",
  checked,
  onChange,
}: Readonly<{ children: ReactNode; variant?: "plain" | "card"; checked?: boolean; onChange?: (checked: boolean) => void }>) {
  const isCard = variant === "card";

  return (
    <label
      className={cn(
        "group inline-flex cursor-pointer items-start text-start text-foreground/60 transition duration-200 hover:text-foreground/78",
        isCard
          ? "mt-3 w-full gap-2.5 rounded-[1rem] border border-border/65 bg-background/72 p-2.5 text-[0.68rem] leading-5 hover:border-primary/25 hover:bg-surface"
          : "items-center gap-2 text-[0.7rem] font-semibold",
      )}
    >
      <input type="checkbox" checked={checked} onChange={(event) => onChange?.(event.target.checked)} className="peer sr-only" />
      <span
        className={cn(
          "mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border border-border bg-surface text-white transition duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/25 peer-checked:border-primary peer-checked:bg-primary",
          !isCard && "mt-0",
        )}
        aria-hidden="true"
      >
        <Check className="h-2.5 w-2.5" aria-hidden="true" />
      </span>
      <span>{children}</span>
    </label>
  );
}

function fieldValue(formData: FormData, key: AuthFieldKey): string {
  return String(formData.get(key) ?? "").trim();
}

function errorFromApi(error: unknown): string {
  if (error instanceof ApiError) {
    const details = error.details as { message?: string; errors?: Record<string, string[]> } | null;
    const firstFieldError = details?.errors ? Object.values(details.errors).flat()[0] : undefined;
    return firstFieldError ?? details?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function AuthFormCard({ mode, copy }: AuthFormCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fields = modeFields[mode];
  const isRegister = mode === "register";
  const isLogin = mode === "login";
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = fieldValue(formData, "email");
    const password = fieldValue(formData, "password");
    const confirmPassword = fieldValue(formData, "confirmPassword");
    const redirectTo = searchParams.get("redirectTo") || "/";

    setErrorMessage(null);
    setStatusMessage(null);

    if (!email) {
      setErrorMessage(copy.fields.email?.label ?? "Email is required.");
      return;
    }

    if ((isLogin || isRegister) && password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    if (isRegister && !acceptedTerms) {
      setErrorMessage("Please accept the terms before creating an account.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await loginUser({ email, password });
        router.replace(redirectTo);
        router.refresh();
        return;
      }

      if (isRegister) {
        const firstName = fieldValue(formData, "firstName");
        const lastName = fieldValue(formData, "lastName");
        await registerUser({
          name: [firstName, lastName].filter(Boolean).join(" ") || email,
          email,
          password,
          password_confirmation: confirmPassword,
        });
        router.replace(redirectTo);
        router.refresh();
        return;
      }

      await requestPasswordReset(email);
      setStatusMessage(copy.helperText || "If this email exists, password reset instructions will be sent.");
    } catch (error) {
      setErrorMessage(errorFromApi(error));
    } finally {
      setIsSubmitting(false);
    }
  }

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
              <Image src="/images/logo-blue.png" alt="IASS logo" fill sizes="88px" className="object-contain" priority />
            </span>
          </Link>
        </div>

        <h1 className="text-[1.25rem] font-black leading-tight tracking-[-0.03em] text-foreground sm:text-[1.5rem]">
          {copy.title}
        </h1>
        <p className="mx-auto mt-2 max-w-[24rem] text-[0.76rem] leading-5 text-foreground/60 sm:text-[0.8rem]">
          {copy.subtitle}
        </p>

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className={cn("grid gap-3 text-start", isRegister && "sm:grid-cols-2")}>{fields.map((config) => {
            const field = copy.fields[config.key];
            if (!field) return null;

            return <AuthInput key={config.key} field={field} config={config} />;
          })}</div>

          {isLogin ? (
            <div className="mt-3 flex items-center justify-between gap-3 text-[0.7rem] font-semibold text-foreground/60">
              <AuthCheckbox>{copy.rememberLabel}</AuthCheckbox>
              <Link href="/forgot-password" className="font-bold text-primary transition hover:text-primary-strong">
                {copy.forgotPasswordLabel}
              </Link>
            </div>
          ) : null}

          {isRegister && copy.termsLabel ? <AuthCheckbox variant="card" checked={acceptedTerms} onChange={setAcceptedTerms}>{copy.termsLabel}</AuthCheckbox> : null}

          {copy.helperText ? (
            <p className="mt-3 rounded-[1rem] border border-primary/10 bg-primary/6 p-2.5 text-[0.7rem] leading-5 text-foreground/60">
              {copy.helperText}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-3 rounded-[0.75rem] border border-danger/15 bg-danger/8 p-2.5 text-[0.72rem] font-semibold leading-5 text-danger">
              {errorMessage}
            </p>
          ) : null}

          {statusMessage ? (
            <p className="mt-3 rounded-[0.75rem] border border-emerald-500/15 bg-emerald-500/8 p-2.5 text-[0.72rem] font-semibold leading-5 text-emerald-700">
              {statusMessage}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="mt-4 h-[2.55rem] w-full text-[0.8rem] font-black shadow-[0_14px_30px_rgba(29,23,213,0.16)] sm:h-[2.7rem]" size="md">
            {isSubmitting ? "..." : copy.submitLabel}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[0.72rem] text-foreground/56">
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
