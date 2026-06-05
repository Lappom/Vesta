import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/connexion", "/inscription"];
const onboardingRoute = "/onboarding";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isPublic =
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/api/auth");

  if (
    !isLoggedIn &&
    !isPublic &&
    pathname !== "/" &&
    !pathname.startsWith(onboardingRoute)
  ) {
    return NextResponse.redirect(new URL("/connexion", req.url));
  }

  if (
    isLoggedIn &&
    (pathname === "/connexion" || pathname === "/inscription")
  ) {
    return NextResponse.redirect(new URL("/tableau-de-bord", req.url));
  }

  if (!isLoggedIn && pathname.startsWith(onboardingRoute)) {
    return NextResponse.redirect(new URL("/connexion", req.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isLoggedIn ? "/tableau-de-bord" : "/connexion", req.url),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
