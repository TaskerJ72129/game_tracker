import { UserXPProvider } from "@/app/context/userXpContext";
import { AuthProvider } from "@/app/context/authContext";
import UserHeader from "@/components/header";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import Footer from "@/components/footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <UserXPProvider>
            <UserHeader />
            <main className="flex-1 pt-20">
              {children}
            </main>
          </UserXPProvider>
        </AuthProvider>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
