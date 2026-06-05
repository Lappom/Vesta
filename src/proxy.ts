import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup"];
const onboardingRoute = "/onboarding";

function isPublicPath(pathname: string) {
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return true;
  }

  if (pathname.startsWith("/api/auth")) {
    return true;
  }

  if (pathname.startsWith("/join/")) {
    return true;
  }

  // Next.js metadata routes (no file extension, so matcher includes them)
  if (
    pathname === "/opengraph-image" ||
    pathname.startsWith("/opengraph-image?") ||
    pathname === "/twitter-image" ||
    pathname.startsWith("/twitter-image?")
  ) {
    return true;
  }

  return false;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isPublic = isPublicPath(pathname);

  if (
    !isLoggedIn &&
    !isPublic &&
    pathname !== "/" &&
    !pathname.startsWith(onboardingRoute)
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    isLoggedIn &&
    (pathname === "/login" || pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isLoggedIn && pathname.startsWith(onboardingRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isLoggedIn ? "/dashboard" : "/login", req.url),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
