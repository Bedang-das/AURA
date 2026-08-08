import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "APEX AURA | Enterprise AI Engineering",
  description: "30-day enterprise AI Engineering training and evaluation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-900 bg-dot-white/[0.2] flex flex-col`}
      >
        <div className="flex-1 w-full flex flex-col pt-12 md:pt-20 px-4 md:px-8 max-w-[1600px] mx-auto">
          <main className="bg-white rounded-t-3xl shadow-2xl overflow-hidden flex-1 flex flex-col border-t border-x border-slate-200/50">
            <Navbar />
            <div className="flex-1 relative">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
