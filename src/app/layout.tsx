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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
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