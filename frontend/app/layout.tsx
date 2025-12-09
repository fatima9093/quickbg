import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickBG - AI Background Removal",
  description: "Remove backgrounds from images instantly with AI-powered precision. Fast, secure, and easy to use.",
  keywords: ["background removal", "AI", "image processing", "photo editing", "transparent background"],
  authors: [{ name: "QuickBG" }],
  icons: {
    icon: "/FAVICON (2).png",
    shortcut: "/FAVICON (2).png",
    apple: "/FAVICON (2).png",
  },
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
    <html className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (!theme) {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

