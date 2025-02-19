// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Sora } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Play FUT',
  description: 'Descrição',
  icons: '/images/jpg/icon.jpg',
  manifest: '/manifest.webmanifest'
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}