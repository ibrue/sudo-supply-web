import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// Only boot Clerk when a real publishable key is configured. The .env.example
// placeholder ("pk_test_...") starts with pk_ but is invalid, and Clerk throws
// on init — which would 500 every matched route. This guard lets the app run
// with auth simply disabled when scaffolded from .env.example (e.g. the
// Conductor setup script), matching the app-side isClerkConfigured checks.
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured =
  /^pk_(test|live)_/.test(clerkKey) &&
  !clerkKey.includes("placeholder") &&
  !clerkKey.includes("...") &&
  clerkKey.length >= 24;

const isProtectedRoute = createRouteMatcher(["/account(.*)", "/admin(.*)"]);

const withClerk = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured) return NextResponse.next();
  return withClerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
