import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/imagekit-auth",
])

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  if (!isPublicRoute(req)) {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.redirect(
        new URL("/sign-in", req.url)
      )
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}
