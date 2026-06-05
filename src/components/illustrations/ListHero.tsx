export function ListHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="30" y="20" width="140" height="120" rx="16" fill="#f5f0e0" />
      <rect x="50" y="45" width="80" height="12" rx="6" fill="#ffb084" />
      <rect x="50" y="70" width="100" height="12" rx="6" fill="#b8a4ed" />
      <rect x="50" y="95" width="60" height="12" rx="6" fill="#ff4d8b" />
      <circle cx="42" cy="51" r="6" fill="#22c55e" />
      <circle cx="42" cy="76" r="6" fill="#e5e5e5" />
      <circle cx="42" cy="101" r="6" fill="#e5e5e5" />
      <path
        d="M155 30 C165 20 175 35 170 50 C180 55 175 70 160 65 C155 80 140 75 145 60 C130 55 135 35 155 30Z"
        fill="#ff4d8b"
        opacity="0.8"
      />
    </svg>
  )
}
