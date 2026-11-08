import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: "Hungry Bird — Food delivery, done beautifully",
  description:
    "Hungry Bird is a full-stack food delivery web app: discover restaurants by mood, customise dishes, pay, and follow your order home on a cinematic live map. Built with Next.js, Prisma & Framer Motion.",
  icons: { icon: "/favicon-hb.svg" },
  openGraph: {
    title: "Hungry Bird — Food delivery, done beautifully",
    description: "Mood-first food discovery, plate-style cart, cinematic live order tracking.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#14100c" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} antialiased`}>{children}</body>
    </html>
  );
}
