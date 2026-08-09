import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Aura - Engineering Platform",
  description: "Next-gen AI Engineering training platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="font-sans text-espresso antialiased min-h-screen bg-paper">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
