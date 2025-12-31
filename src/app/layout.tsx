import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { DesktopNavigation, MobileNavigation, Navbar, Sidebar } from "@/components";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <SidebarProvider>
            <AppProvider>
              <div className="flex flex-col h-screen overflow-hidden">
                <Navbar />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar>
                    <DesktopNavigation />
                  </Sidebar>
                  <main className="flex-1 pb-20 md:pb-0 overflow-y-auto bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-6xl mx-auto p-4 md:p-8">
                      {children}
                    </div>
                  </main>
                </div>
                {/* Mobile bottom navigation */}
                <div className="md:hidden">
                  <MobileNavigation />
                </div>
              </div>
            </AppProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
