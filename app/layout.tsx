import type { Metadata } from "next";
import { JetBrains_Mono, Urbanist } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

const urbanist = Urbanist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  description: "End-to-end EVM integration examples for Sablier Lockup v4.0.",
  title: "Sablier Sandbox",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${urbanist.variable} ${jetbrainsMono.variable} min-h-screen`} lang="en">
      <body className="min-h-screen overflow-x-hidden antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
