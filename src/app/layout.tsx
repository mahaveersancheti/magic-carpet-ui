// "use client";
import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./redux/store/reduxProvider";
import ToasterProvider from "./components/ToasterProvider";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Magic Carpet",
  description: "AI-powered intelligence briefs for sales teams",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Magic Carpet",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${manrope.variable} ${poppins.variable} font-display antialiased`}>
        <ReduxProvider>
          <ToasterProvider />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}