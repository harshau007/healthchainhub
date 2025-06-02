import AuthGuard from "@/components/auth-guard";
import { HeaderWrapper } from "@/components/header-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { DataProvider } from "@/providers/data-provider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "HealthChain";
const APP_DEFAULT_TITLE = "Real-time HealthCare Management System";
const APP_TITLE_TEMPLATE = "%s - HealthChain";
const APP_DESCRIPTION = "HealthChain";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <HeaderWrapper />
                <AuthGuard>
                  <div className="flex-1">{children}</div>
                </AuthGuard>
              </div>
            </AuthProvider>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
