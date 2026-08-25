import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-[#0b1a24] text-[#f3f6f8]">
        {children}
      </body>
    </html>
  );
}
