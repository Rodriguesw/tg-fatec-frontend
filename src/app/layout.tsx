// app/layout.tsx
import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <Provider>
          {children}
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}