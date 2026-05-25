import type { Metadata } from "next";
import { Instrument_Sans, Libre_Baskerville } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const heading = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-heading"
});

const accent = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-accent"
});

export const metadata: Metadata = {
  title: "ARZ Auto",
  description: "Used vehicle dealership with curated inventory, sold vehicles, and fast search."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${accent.variable}`}>
        <div className="page-shell">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
