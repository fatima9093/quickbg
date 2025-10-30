import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickBG - AI Background Removal",
  description: "Remove backgrounds from images instantly with AI-powered precision. Fast, secure, and easy to use.",
  keywords: ["background removal", "AI", "image processing", "photo editing", "transparent background"],
  authors: [{ name: "QuickBG" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quickbg.com",
    title: "QuickBG - AI Background Removal",
    description: "Remove backgrounds from images instantly with AI-powered precision.",
    siteName: "QuickBG",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickBG - AI Background Removal",
    description: "Remove backgrounds from images instantly with AI-powered precision.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

