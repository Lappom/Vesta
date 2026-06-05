export function AuthConnectHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="200" cy="320" rx="150" ry="18" fill="#e8b94a" opacity="0.25" />
      <circle cx="130" cy="180" r="50" fill="#ffb084" />
      <circle cx="270" cy="180" r="50" fill="#b8a4ed" />
      <circle cx="115" cy="170" r="6" fill="#0a0a0a" />
      <circle cx="145" cy="170" r="6" fill="#0a0a0a" />
      <circle cx="255" cy="170" r="6" fill="#0a0a0a" />
      <circle cx="285" cy="170" r="6" fill="#0a0a0a" />
      <path
        d="M120 200 Q130 215 145 200"
        stroke="#0a0a0a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M255 200 Q270 215 285 200"
        stroke="#0a0a0a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M180 180 Q200 160 220 180"
        stroke="#ff4d8b"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M200 140 L200 100"
        stroke="#ff4d8b"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="200" cy="90" r="12" fill="#ff4d8b" />
      <path
        d="M190 90 L200 78 L210 90"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
