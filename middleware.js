import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const { pathname } = req.nextUrl;

  // 1. Secure all dashboard paths globally
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/patient/portal", req.nextUrl));
    }
  }

  // 2. Secure patient portal paths
  if (pathname.startsWith("/patient") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 3. Block logged-in users from login/register screens
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    const destination = userRole === "admin" ? "/dashboard/customers" : "/patient/portal";
    return NextResponse.redirect(new URL(destination, req.nextUrl));
  }

  return NextResponse.next();
});

// Using a broad negative look-ahead matcher ensures Next.js runs this check 
// on all application pages and assets uniformly without skipping dynamic sub-routes.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};