import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { DataProvider } from "@/providers/data-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthChainHub",
  description: "Real-time Hospital Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DataProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
            </div>
            <Toaster closeButton richColors />
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
