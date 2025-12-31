import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navigation } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monetra - Personal Finance Tracker",
  description: "Track your money, expenses, and savings with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-950`}
      >
        <AppProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <aside className="md:w-56 md:flex-shrink-0">
              <Navigation />
            </aside>
            <main className="flex-1 pb-20 md:pb-0 overflow-auto">
              <div className="max-w-6xl mx-auto p-4 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
