import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Kos Bu Henny",
  description: "Informasi kamar dan fasilitas Kos Bu Henny.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className=
    {`${inter.variable} ${fraunces.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}