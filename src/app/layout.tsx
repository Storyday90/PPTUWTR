import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PPUWTR Arena — Book. Play. Connect.",
  description:
    "Platform tempahan rasmi Dewan Dato' Haji Samsudin bin Haji Abu Hassan, PPUWTR. Tempah gelanggang badminton, pickleball, futsal, ping pong dan dewan seminar secara dalam talian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-base">
        <QueryProvider>
          {children}
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
