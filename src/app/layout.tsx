// app/layout.tsx
import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import "./globals.css";

const anton = Anton({
  weight: ["400"],
  variable: "--font-anton",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'PlayFUT',
  description: 'Descrição',
  icons: '/images/logo/logo-playfut-white.svg',
  manifest: '/manifest.json'
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning className={`${anton.variable} ${inter.variable}`}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}