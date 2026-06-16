import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/images/hero-blue.png", request.url), 308);
}
