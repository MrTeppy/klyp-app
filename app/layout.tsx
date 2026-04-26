import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav"

export const metadata: Metadata = {
  title: "KLYP",
  description: "Shared memory posts built around music.",
  applicationName: "KLYP",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KLYP",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}
        
      </body>
    </html>
  );
}
