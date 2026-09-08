import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { PWAProvider } from "@/components/PWAProvider";
import { Providers } from "@/components/Providers";
import { NativeAppShell } from "@/components/NativeAppShell";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Urban Street | Coffee POS & Analytics",
  description: "ขายสินค้า จัดการเมนู และดูรายงานยอดขายสำหรับร้าน Urban Street",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  keywords: ["coffee", "pos", "sales tracker", "analytics", "urban street", "cafe"],
  authors: [{ name: "Urban Street Team" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Urban Street",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <Providers><PWAProvider /><NativeAppShell>{children}</NativeAppShell></Providers>
      </body>
    </html>
  );
}
