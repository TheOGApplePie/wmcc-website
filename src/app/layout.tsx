import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Script from "next/script";
import { headers } from "next/headers";
import type { Metadata } from "next";

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
  const nonce = (await headers()).get("x-nonce") || "";
  return (
    <html lang="en-CA">
      <head />
      <body>
        <Script
          async={true}
          defer={true}
          nonce={nonce}
          src="https://www.google.com/recaptcha/api.js"
        ></Script>
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
