import localFont from "next/font/local";
import { Inter, Amiri, Scheherazade_New } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri", display: "swap" });
export const scheherazade = Scheherazade_New({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-scheherazade", display: "swap" });

export const kfgq = localFont({
  src: "../../public/fonts/font1.woff2",
  variable: "--font-kfgq",
  display: "swap",
});
