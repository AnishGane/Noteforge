import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "./server/get-auth-session";

export async function proxy(request: NextRequest) {
  const session = await getAuthSession();

  const pathname = request.nextUrl.pathname;

  // Not logged in → block dashboard
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Logged in → block landing/login page
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
