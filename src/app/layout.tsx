import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moshi-pilot.vercel.app"),
  title: "Moshi-Pilot (もしパイロット) — Bilingual Voice Copilot for Japan Travel",
  description:
    "Speak fluent Keigo over the phone — without speaking a word of Japanese. A real-time, human-in-the-loop voice concierge for travelers in Japan.",
  icons: {
    icon: "/assets/moshi_pilot_logo_concept_a.png",
  },
  openGraph: {
    title: "Moshi-Pilot (もしパイロット)",
    description: "Speak fluent Keigo over the phone — without speaking a word of Japanese.",
    url: "https://moshi-pilot.vercel.app",
    siteName: "Moshi-Pilot",
    images: [{ url: "/assets/moshi_pilot_logo_concept_a.png", width: 1920, height: 1920 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
