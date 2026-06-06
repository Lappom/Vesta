"use client";

const MAP_HERO_MARKUP = `
  <rect x="20" y="30" width="160" height="110" rx="16" fill="#faf5e8"/>
  <path d="M30 100 Q60 80 90 95 Q120 110 150 85 L170 100" stroke="#a4d4c5" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M40 120 Q80 100 120 115 Q150 125 170 105" stroke="#b8a4ed" stroke-width="4" fill="none" opacity="0.5"/>
  <ellipse cx="100" cy="75" rx="50" ry="25" fill="#e8b94a" opacity="0.3"/>
  <path d="M100 55 L100 40 C100 35 108 32 112 38 L100 55Z" fill="#ff4d8b"/>
  <circle cx="100" cy="55" r="14" fill="#ff4d8b" opacity="0.3"/>
  <circle cx="100" cy="55" r="8" fill="#ff4d8b"/>
  <circle cx="100" cy="55" r="3" fill="#fff"/>
  <circle cx="60" cy="90" r="6" fill="#1a3a3a"/>
  <circle cx="140" cy="85" r="6" fill="#ffb084"/>
`;

export function MapHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: MAP_HERO_MARKUP }}
    />
  );
}
