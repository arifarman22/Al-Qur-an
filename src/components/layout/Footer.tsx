import Link from "next/link";
import { Heart } from "lucide-react";
import Container from "@/components/ui/Container";
import { OrnamentDivider } from "@/components/icons/IslamicIcons";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-10 mt-12">
      <Container>
        <div className="flex flex-col items-center gap-5 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-amiri)" }}>ق</span>
            </div>
            <span className="font-semibold text-sm">Al-Quran</span>
          </Link>

          <p className="text-xs text-muted max-w-xs leading-relaxed">
            Read, listen, and reflect on the divine words of the Holy Quran.
          </p>

          <div className="flex items-center gap-3">
            <a href="https://github.com/arifarman22" target="_blank" rel="noopener noreferrer" title="GitHub"
              className="p-2 rounded-xl text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/arif-arman-70398a18b/" target="_blank" rel="noopener noreferrer" title="LinkedIn"
              className="p-2 rounded-xl text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://facebook.com/arifarman22" target="_blank" rel="noopener noreferrer" title="Facebook"
              className="p-2 rounded-xl text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://x.com/arifarman22" target="_blank" rel="noopener noreferrer" title="X (Twitter)"
              className="p-2 rounded-xl text-muted hover:text-primary hover:bg-primary/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          <OrnamentDivider className="w-full max-w-xs" />

          <p className="text-xs text-muted flex items-center gap-1">
            Developed with <Heart size={11} className="text-red-500 fill-red-500" /> by{" "}
            <a href="https://github.com/arifarman22" target="_blank" rel="noopener noreferrer"
              className="text-primary font-medium hover:underline">
              Arif Arman
            </a>
          </p>

          <p className="text-[11px] text-muted/50">
            © {new Date().getFullYear()} Al-Quran. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
