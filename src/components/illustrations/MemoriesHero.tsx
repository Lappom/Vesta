export function MemoriesHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="55"
        y="35"
        width="90"
        height="70"
        rx="8"
        fill="#fffaf0"
        stroke="#e5e5e5"
        strokeWidth="2"
        transform="rotate(-8 100 70)"
      />
      <rect
        x="45"
        y="50"
        width="90"
        height="70"
        rx="8"
        fill="#ffb084"
        opacity="0.4"
        transform="rotate(5 90 85)"
      />
      <rect
        x="50"
        y="42"
        width="90"
        height="70"
        rx="8"
        fill="#b8a4ed"
        opacity="0.5"
      />
      <rect x="58" y="50" width="74" height="50" rx="4" fill="#ff4d8b" opacity="0.3" />
      <circle cx="95" cy="75" r="12" fill="#e8b94a" opacity="0.6" />
      <path
        d="M88 75 L93 80 L102 68"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="62" y="108" width="66" height="8" rx="4" fill="#f5f0e0" />
    </svg>
  )
}
