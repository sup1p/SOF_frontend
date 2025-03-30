import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is authenticated for protected routes
  const authRoutes = ["/questions/ask", "/users/me"]
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isAuthRoute) {
    // Check for auth token
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      // Redirect to login if no token is found
      return NextResponse.redirect(new URL("/?login=true", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/questions/ask/:path*", "/users/me/:path*"],
}

