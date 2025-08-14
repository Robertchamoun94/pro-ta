<Link href="/" className="shrink-0" aria-label={`${BRAND.name} home`}>
  {/* Inline SVG-ikon, 32x32 px */}
  <svg
    width={32}
    height={32}
    viewBox="0 0 256 256"
    role="img"
    aria-label="ArcSignals icon"
    style={{ display: 'block' }}
  >
    <defs>
      <linearGradient id="asg" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#1f7f7b" />
        <stop offset="1" stopColor="#36b58f" />
      </linearGradient>
    </defs>

    {/* Arc-botten */}
    <path
      d="M24 176c0 38.4 41.6 56 104 56s104-17.6 104-56c0-1.2 0-2.4-.1-3.6-18.6 27.5-57 43.6-103.9 43.6S42.7 199.9 24.1 172.4c-.1 1.2-.1 2.4-.1 3.6z"
      fill="url(#asg)"
    />

    {/* Staplar */}
    <rect x="56" y="120" width="28" height="64" rx="6" fill="#ffffff" />
    <rect x="106" y="104" width="28" height="80" rx="6" fill="#ffffff" />
    <rect x="156" y="88"  width="28" height="96" rx="6" fill="#ffffff" />

    {/* Prislinje + pil */}
    <path
      d="M48 160l36-28 20 12 34-34 26 20 26-38"
      fill="none"
      stroke="#36b58f"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M186 64l36 10-18 30z" fill="#36b58f" />
  </svg>
</Link>
