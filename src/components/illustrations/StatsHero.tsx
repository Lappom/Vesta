"use client";

const STATS_HERO_MARKUP = `
  <rect x="30" y="100" width="25" height="40" rx="6" fill="#ff4d8b"/>
  <rect x="65" y="70" width="25" height="70" rx="6" fill="#b8a4ed"/>
  <rect x="100" y="50" width="25" height="90" rx="6" fill="#ffb084"/>
  <rect x="135" y="80" width="25" height="60" rx="6" fill="#1a3a3a"/>
  <path d="M42 95 L77 65 L112 45 L147 75" stroke="#e8b94a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="42" cy="95" r="5" fill="#e8b94a"/>
  <circle cx="77" cy="65" r="5" fill="#e8b94a"/>
  <circle cx="112" cy="45" r="5" fill="#e8b94a"/>
  <circle cx="147" cy="75" r="5" fill="#e8b94a"/>
  <ellipse cx="100" cy="148" rx="70" ry="8" fill="#e8b94a" opacity="0.2"/>
`;

export function StatsHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: STATS_HERO_MARKUP }}
    />
  );
}
