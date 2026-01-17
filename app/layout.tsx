import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import UserHeader from "@/components/header";
import { mockUserXP } from "@/app/dashboard/mockUserXP";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameTracker",
  description: "Track games, earn XP, level up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global header */}
        <UserHeader
          username={mockUserXP.username}
          totalXP={mockUserXP.overall}
        />

        {/* Page content */}
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
