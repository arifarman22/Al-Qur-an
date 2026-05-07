import type { Metadata } from "next";
import { Inter, Amiri, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import QuranProvider from "@/components/layout/QuranProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri", display: "swap" });
const scheherazade = Scheherazade_New({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-scheherazade", display: "swap" });

export const metadata: Metadata = {
  title: "Al-Quran | The Noble Quran",
  description: "Read, listen, and study the Noble Quran with Arabic text, translations, and audio recitation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${amiri.variable} ${scheherazade.variable} h-full`}>
      <body className="min-h-full">
        <QuranProvider>{children}</QuranProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
