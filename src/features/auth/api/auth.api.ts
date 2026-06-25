import { apiFetch } from "@/shared/api/client";
import type { User } from "@/shared/api/types";
import { websiteSessionCookieName, websiteSessionKey, websiteUserKey } from "@/shared/api/website-session";

export type LoginPayload = Readonly<{
  email: string;
  password: string;
}>;

export type RegisterPayload = Readonly<{
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}>;

type BackendAuthResponse = {
  data?: Record<string, unknown>;
  user?: User;
  [key: string]: unknown;
};

function getPayload(response: BackendAuthResponse): Record<string, unknown> {
  return response.data ?? response;
}

function readSession(payload: Record<string, unknown>): string | undefined {
  const direct = payload["token"] ?? payload["accessToken"] ?? payload["access_token"];
  return typeof direct === "string" ? direct : undefined;
}

function readUser(payload: Record<string, unknown>): User | undefined {
  return typeof payload.user === "object" && payload.user ? (payload.user as User) : undefined;
}

function saveSession(session: string, user?: User): void {
  window.localStorage.setItem(websiteSessionKey, session);

  if (user) {
    window.localStorage.setItem(websiteUserKey, JSON.stringify(user));
  }

  document.cookie = `${websiteSessionCookieName}=${encodeURIComponent(session)}; path=/; max-age=2592000; SameSite=Lax`;
  window.dispatchEvent(new Event("iass:website-session-changed"));
}

export async function loginUser(payload: LoginPayload): Promise<User | undefined> {
  const response = await apiFetch<BackendAuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = getPayload(response);
  const session = readSession(data);
  const user = readUser(data);

  if (!session) {
    throw new Error("Login response did not include a session value.");
  }

  saveSession(session, user);
  return user;
}

export async function registerUser(payload: RegisterPayload): Promise<User | undefined> {
  const response = await apiFetch<BackendAuthResponse>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = getPayload(response);
  const session = readSession(data);
  const user = readUser(data);

  if (session) {
    saveSession(session, user);
  }

  return user;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiFetch<unknown>("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
