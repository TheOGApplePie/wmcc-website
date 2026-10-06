import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { usesCognitoPolicy } from "./lib/cognito-policy";

export function middleware(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const allowsCognito = usesCognitoPolicy(request.nextUrl.pathname);
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${allowsCognito ? "'unsafe-eval'" : ""} https://www.google.com https://www.gstatic.com https://masjidbox.com https://recaptcha.net https://www.cognitoforms.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    frame-src https://www.google.com https://recaptcha.net https://masjidbox.com https://www.zeffy.com https://www.cognitoforms.com https://www.recaptcha.net https://js.stripe.com;
    connect-src 'self' ${isDevelopment ? "ws://localhost:* ws://127.0.0.1:*" : ""} https://gkpctbvyswcfccogoepl.supabase.co https://cheerful-macaw-22556.upstash.io https://www.google.com https://www.recaptcha.net https://masjidbox.com https://www.cognitoforms.com https://vitals.vercel-insights.com;
    img-src 'self' data: blob: https://gkpctbvyswcfccogoepl.supabase.co https://www.gstatic.com https://masjidbox.com https://*.sharepoint.com;
    font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com ${allowsCognito ? "https://static.cognitoforms.com" : ""};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDevelopment ? "" : "upgrade-insecure-requests;"}
  `
    .replaceAll(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "x-cognito-policy",
    allowsCognito ? "enabled" : "disabled",
  );
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

// Apply document security headers without intercepting assets or image optimization.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)",
  ],
};
