import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the session token from cookies or headers
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // If no token, redirect to login
  if (!sessionToken) {
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // Validate the session token
  try {
    const tokenData = JSON.parse(atob(sessionToken));
    const now = Date.now();
    const tokenAge = now - tokenData.timestamp;

    // Token expires after 24 hours
    const isValid = tokenAge < 24 * 60 * 60 * 1000;

    if (!isValid) {
      // Token expired, redirect to login
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("sessionToken");
      return response;
    }

    // Check role-based access
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      tokenData.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("sessionToken");
    return response;
  }
}

export const config = {
  matcher: [],
};
