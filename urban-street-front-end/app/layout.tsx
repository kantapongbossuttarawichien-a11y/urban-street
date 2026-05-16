import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Urban Street | Coffee POS & Analytics",
  description: "Modern, minimalist coffee sales tracking and analytics for local vendors. Fast, offline-ready, and beautiful.",
  keywords: ["coffee", "pos", "sales tracker", "analytics", "urban street", "cafe"],
  authors: [{ name: "Urban Street Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Urban Street",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} h-full antialiased font-sans selection:bg-stone-200`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
