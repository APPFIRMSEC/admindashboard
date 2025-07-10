import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/blogs") ||
    request.nextUrl.pathname.startsWith("/podcasts") ||
    request.nextUrl.pathname.startsWith("/media") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/users") ||
    request.nextUrl.pathname.startsWith("/help") ||
    request.nextUrl.pathname.startsWith("/search");

  // If user is not authenticated and trying to access admin routes, redirect to login
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/blogs/:path*",
    "/podcasts/:path*",
    "/media/:path*",
    "/settings/:path*",
    "/users/:path*",
    "/help/:path*",
    "/search/:path*",
    "/login",
  ],
};
