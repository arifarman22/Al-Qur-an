import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import QuranProvider from "@/components/layout/QuranProvider";
import { inter, amiri, scheherazade, kfgq } from "./fonts";

export const metadata: Metadata = {
  title: "Al-Quran | The Noble Quran",
  description: "Read, listen, and study the Noble Quran with Arabic text, translations, and audio recitation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${amiri.variable} ${scheherazade.variable} ${kfgq.variable} h-full`}>
      <body className="min-h-full">
        <QuranProvider>{children}</QuranProvider>
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  );
}
