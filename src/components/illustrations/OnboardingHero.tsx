export function OnboardingHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="120" cy="180" r="60" fill="#ffb084" opacity="0.5" stroke="#ffb084" strokeWidth="3" strokeDasharray="8 4" />
      <circle cx="280" cy="180" r="60" fill="#b8a4ed" opacity="0.5" stroke="#b8a4ed" strokeWidth="3" strokeDasharray="8 4" />
      <path
        d="M180 180 L220 180"
        stroke="#ff4d8b"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="6 4"
      />
      <rect x="155" y="165" width="90" height="30" rx="8" fill="#f5f0e0" />
      <text x="200" y="185" textAnchor="middle" fill="#0a0a0a" fontSize="14" fontWeight="600" fontFamily="sans-serif">
        123456
      </text>
      <circle cx="120" cy="180" r="8" fill="#ff4d8b" />
      <circle cx="280" cy="180" r="8" fill="#1a3a3a" />
      <path
        d="M100 120 Q120 90 140 120"
        stroke="#e8b94a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M260 120 Q280 90 300 120"
        stroke="#e8b94a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
