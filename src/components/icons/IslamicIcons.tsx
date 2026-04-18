interface IconProps {
  size?: number;
  className?: string;
}

export function QuranIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="6" y="4" width="28" height="38" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="14" y="6" width="28" height="38" rx="3" fill="currentColor" opacity="0.3" />
      <rect x="10" y="5" width="28" height="38" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M24 14C24 14 20 18 20 22C20 26 24 30 24 30C24 30 28 26 28 22C28 18 24 14 24 14Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.2" />
      <line x1="18" y1="35" x2="30" y2="35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LearnIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M24 6L4 16L24 26L44 16L24 6Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M10 20V32C10 32 16 38 24 38C32 38 38 32 38 32V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="44" y1="16" x2="44" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="44" cy="36" r="2" fill="currentColor" />
    </svg>
  );
}

export function MemorizeIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M24 44C24 44 6 34 6 20C6 12 12 6 20 6C22.8 6 24 8 24 8C24 8 25.2 6 28 6C36 6 42 12 42 20C42 34 24 44 24 44Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 20L22 24L30 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TasbihIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="28" r="16" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2.5" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const r = 16;
        const cx = 24 + r * Math.cos((angle - 90) * Math.PI / 180);
        const cy = 28 + r * Math.sin((angle - 90) * Math.PI / 180);
        return <circle key={angle} cx={cx} cy={cy} r="2.5" fill="currentColor" opacity="0.6" />;
      })}
      <path d="M24 12V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="4" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function DuaIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14 40C14 40 8 30 8 24C8 18 12 16 16 18L20 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 40C34 40 40 30 40 24C40 18 36 16 32 18L28 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 22L24 18L28 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 8L26 12L24 14L22 12L24 8Z" fill="currentColor" opacity="0.4" />
      <circle cx="16" cy="10" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="32" cy="10" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function BookmarkFilledIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 6H36C37.1 6 38 6.9 38 8V44L24 36L10 44V8C10 6.9 10.9 6 12 6Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M19 18H29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 24H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MosqueIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M24 4C24 4 16 12 16 18H32C32 12 24 4 24 4Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="8" y="18" width="32" height="22" rx="1" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M20 40V30C20 27.8 21.8 26 24 26C26.2 26 28 27.8 28 30V40" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="18" width="4" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.15" />
      <rect x="40" y="18" width="4" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.15" />
      <circle cx="24" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function StarCrescentIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20 6C12 8 6 16 6 24C6 34 14 42 24 42C32 42 38 36 40 28C34 32 26 30 22 24C18 18 18 10 20 6Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
      <path d="M36 8L37.5 12.5L42 14L37.5 15.5L36 20L34.5 15.5L30 14L34.5 12.5L36 8Z" fill="currentColor" />
    </svg>
  );
}

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className || ""}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent/50 shrink-0">
        <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
