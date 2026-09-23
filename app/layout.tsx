import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klyp",
  description: "music. memory. people who get it.",
  applicationName: "Klyp",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=99" },
      { url: "/icon.png?v=99", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.png?v=99", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=99", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=99", sizes: "180x180", type: "image/png" }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: "#2f5c99",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
