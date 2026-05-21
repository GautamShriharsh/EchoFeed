import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { Space_Grotesk } from "next/font/google";
import { Syne } from "next/font/google";
import { Orbitron } from "next/font/google";
import { Bebas_Neue } from "next/font/google";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "EchoFeed",
  description: "Anonymous AI-powered social messaging platform",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

// const syne = Syne({
//   subsets: ["latin"],
//   variable: "--font-syne",
// });

// const orbitron = Orbitron({
//   subsets: ["latin"],
//   variable: "--font-orbitron",
// });

// const bebas = Bebas_Neue({
//   subsets: ["latin"],
//   weight: "400",
//   variable: "--font-bebas",
// });

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <AuthProvider>
      <body className={`${geist.className} min-h-screen flex flex-col`}>
        {children}
       <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}