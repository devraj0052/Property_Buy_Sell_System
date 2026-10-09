import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: '%s | PropEx',
    default: 'PropEx | Premium Property Buy, Sell, Rent Marketplace'
  },
  description: "Find your dream home, apartment, or commercial space with PropEx. The premium real estate marketplace with verified listings and seamless experiences.",
  keywords: ["real estate", "property", "buy home", "rent apartment", "commercial property", "luxury real estate"],
  openGraph: {
    title: 'PropEx - Premium Real Estate',
    description: 'Find your dream home, apartment, or commercial space.',
    url: 'https://propex.com',
    siteName: 'PropEx',
    images: [
      {
        url: 'https://propex.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PropEx Real Estate',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropEx - Premium Real Estate',
    description: 'Find your dream home, apartment, or commercial space.',
    images: ['https://propex.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { ToastProvider } from "@/components/ui/ToastProvider";

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
