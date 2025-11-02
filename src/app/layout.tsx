import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Script from "next/script";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") || "";
  return (
    <html lang="en">
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
