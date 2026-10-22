import type { Metadata } from "next";
import { Marcellus, Montserrat, Italiana } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const italiana = Italiana({
  variable: "--font-italiana",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VUUR KAT — A little souvenir holds the best stories.",
  description:
    "Amsterdam-made magnets and keychains that carry a real story — tap to read it, keep it, or give it away.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${montserrat.variable} ${italiana.variable} antialiased`}
    >
      <body className="bg-white text-ink font-montserrat">{children}</body>
    </html>
  );
}
