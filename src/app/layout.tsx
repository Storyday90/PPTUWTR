import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
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
    <html lang="ms" className={`${inter.variable} ${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-base">
        <QueryProvider>
          <SmoothScroll />
          {children}
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
