import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Script from "next/script";
import { headers } from "next/headers";
import type { Metadata } from "next";
import CspNavigationBoundary from "../components/cspNavigationBoundary";

export const metadata: Metadata = {
  title: {
    default: "WMCC — Waterdown Muslim Community Centre",
    template: "%s | WMCC",
  },
  description:
    "The Waterdown Muslim Community Centre (WMCC) is a registered charitable organization devoted to uplifting and connecting Muslim families in Waterdown, Hamilton, and neighbouring areas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") || "";
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();
  const enablesClarity = clarityProjectId && /^[a-z0-9]+$/i.test(clarityProjectId);
  return (
    <html lang="en-CA">
      <head />
      <body>
        {enablesClarity && (
          <Script id="microsoft-clarity" nonce={nonce} strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${clarityProjectId}");`}
          </Script>
        )}
        <Script
          async={true}
          defer={true}
          nonce={nonce}
          src="https://www.google.com/recaptcha/api.js"
        ></Script>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header></Header>
        <CspNavigationBoundary allowsCognito={requestHeaders.get("x-cognito-policy") === "enabled"}>
          <div id="main-content" tabIndex={-1}>{children}</div>
        </CspNavigationBoundary>
        <Footer></Footer>
      </body>
    </html>
  );
}
