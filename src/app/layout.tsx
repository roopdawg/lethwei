import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lethwei — The Art of 9 Limbs",
  description:
    "The fastest growing combat sport in the world. Bare-knuckle. No mercy. Pure warrior tradition. Discover Lethwei, find gyms, and join the community.",
  keywords: ["lethwei", "burmese boxing", "martial arts", "bare knuckle", "combat sports"],
  openGraph: {
    title: "Lethwei — The Art of 9 Limbs",
    description: "The fastest growing combat sport in the world.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
