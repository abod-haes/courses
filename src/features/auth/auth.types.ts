import type { Locale } from "@/shared/lib/types";

export type AuthMode = "login" | "register" | "forgot-password";

export type AuthFieldKey = "firstName" | "lastName" | "email" | "password" | "confirmPassword";

export type AuthFieldCopy = Readonly<{
  label: string;
  placeholder: string;
}>;

export type AuthModeCopy = Readonly<{
  meta: Readonly<{
    title: string;
    description: string;
  }>;
  eyebrow: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  fields: Partial<Record<AuthFieldKey, AuthFieldCopy>>;
  rememberLabel?: string;
  forgotPasswordLabel?: string;
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
  homeLabel: string;
  termsLabel?: string;
  helperText?: string;
}>;

export type AuthVisualCopy = Readonly<{
  brandLine: string;
  title: string;
  description: string;
  cards: readonly string[];
  metrics: readonly Readonly<{
    value: string;
    label: string;
  }>[];
}>;

export type AuthCopyByLocale = Readonly<Record<Locale, Readonly<{
  visual: AuthVisualCopy;
  modes: Readonly<Record<AuthMode, AuthModeCopy>>;
}>>>;
