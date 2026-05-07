import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4 text-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
          </div>
          <span className="font-semibold text-sm">Al-Quran</span>
        </Link>
        <p className="text-xs text-muted flex items-center gap-1">
          Developed with <Heart size={12} className="text-red-500 fill-red-500" /> by{" "}
          <a href="https://github.com/arifarman22" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Arif Arman</a>
        </p>
        <p className="text-[11px] text-muted/60">© {new Date().getFullYear()} Al-Quran. All rights reserved.</p>
      </div>
    </footer>
  );
}
