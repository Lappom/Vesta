export function DashboardHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="200" cy="260" rx="160" ry="20" fill="#e8b94a" opacity="0.3" />
      <path
        d="M60 220 L120 140 L180 180 L240 100 L320 160 L340 220 Z"
        fill="#a4d4c5"
        opacity="0.6"
      />
      <path
        d="M140 220 L200 120 L260 180 L300 220 Z"
        fill="#b8a4ed"
        opacity="0.5"
      />
      <circle cx="160" cy="175" r="28" fill="#ffb084" />
      <circle cx="240" cy="175" r="28" fill="#ff4d8b" />
      <path
        d="M188 175 Q200 155 212 175"
        stroke="#0a0a0a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="152" cy="168" r="4" fill="#0a0a0a" />
      <circle cx="168" cy="168" r="4" fill="#0a0a0a" />
      <circle cx="232" cy="168" r="4" fill="#fff" />
      <circle cx="248" cy="168" r="4" fill="#fff" />
      <path
        d="M170 190 Q200 210 230 190"
        stroke="#0a0a0a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M230 190 Q200 210 170 190"
        stroke="#fff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M185 175 L215 175"
        stroke="#ff4d8b"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="200" cy="90" r="16" fill="#e8b94a" />
      <path
        d="M200 74 L200 50 M188 82 L175 65 M212 82 L225 65"
        stroke="#e8b94a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
