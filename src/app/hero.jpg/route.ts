import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET() {
  return NextResponse.redirect(new URL("/images/hero-blue.png", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), 308);
}
