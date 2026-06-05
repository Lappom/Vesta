export function AuthWelcomeHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="200" cy="310" rx="140" ry="16" fill="#a4d4c5" opacity="0.3" />
      <path
        d="M80 250 Q120 200 160 230 Q200 180 240 220 Q280 190 320 240"
        stroke="#e8b94a"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="0"
      />
      <circle cx="80" cy="250" r="20" fill="#ffb084" />
      <circle cx="320" cy="240" r="20" fill="#b8a4ed" />
      <circle cx="200" cy="200" r="30" fill="#ff4d8b" opacity="0.8" />
      <path
        d="M188 200 L200 185 L212 200 L200 215 Z"
        fill="#fff"
        opacity="0.6"
      />
      <rect x="170" y="130" width="60" height="40" rx="12" fill="#f5f0e0" />
      <rect x="180" y="142" width="40" height="6" rx="3" fill="#1a3a3a" opacity="0.3" />
      <rect x="180" y="154" width="30" height="6" rx="3" fill="#1a3a3a" opacity="0.2" />
    </svg>
  )
}
