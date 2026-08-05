import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

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
  metadataBase: new URL("https://lethwei-web-production.up.railway.app"),
  title: "LETHWEI™ Bare Knuckle Martial Arts — The Art of 9 Limbs",
  description:
    "The fastest growing combat sport in the world. Bare-knuckle. No mercy. Pure warrior tradition. Explore LETHWEI™ martial arts, find gyms, and join the community.",
  openGraph: {
    title: "LETHWEI™ Bare Knuckle Martial Arts — The Art of 9 Limbs",
    description: "The fastest growing combat sport in the world.",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "LETHWEI™ — The Art of 9 Limbs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LETHWEI™ Bare Knuckle Martial Arts — The Art of 9 Limbs",
    description: "The fastest growing combat sport in the world.",
    images: ["/og.jpg"],
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
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
