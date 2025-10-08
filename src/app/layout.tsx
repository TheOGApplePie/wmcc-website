import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body>
        <Script src="https://www.google.com/recaptcha/api.js"></Script>
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
