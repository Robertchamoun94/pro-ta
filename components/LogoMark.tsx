export default function LogoMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#ag)" opacity="0.25" />
      <circle cx="24" cy="24" r="18" fill="url(#ag)" opacity="0.35" />
      {/* två vågor */}
      <path d="M8 26c4-4 8-4 12 0s8 4 12 0 8-4 12 0" fill="none" stroke="url(#ag)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M8 18c4-4 8-4 12 0s8 4 12 0 8-4 12 0" fill="none" stroke="url(#ag)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}
