import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");
  const pathname = request.nextUrl.pathname;

  const accessSecret = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET
  );

  const refreshSecret = new TextEncoder().encode(
    process.env.REFRESH_TOKEN_SECRET
  );

  if (pathname.startsWith("/user")) {
    if (!accessToken || !refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(accessToken.value, accessSecret);
      return NextResponse.next();
    } catch {
      try {
        await jwtVerify(refreshToken.value, refreshSecret);
        return NextResponse.next();
      } catch {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }
    }
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (accessToken) {
      try {
        await jwtVerify(accessToken.value, accessSecret);
        return NextResponse.redirect(new URL("/user", request.url));
      } catch {
        // token invalid, allow through to login/signup
      }
    }

    if (refreshToken) {
      try {
        await jwtVerify(refreshToken.value, refreshSecret);
        return NextResponse.redirect(new URL("/user", request.url));
      } catch {
        // token invalid, allow through to login/signup
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/login", "/signup"],
};