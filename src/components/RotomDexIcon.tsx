interface Props {
  size?: number;
}

/** Inline Rotom-Dex SVG mascot — zero external deps, always renders. */
export default function RotomDexIcon({ size = 72 }: Props) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="40" cy="42" rx="30" ry="32" fill="#fde68a" opacity="0.2" />
      <rect x="12" y="6" width="56" height="64" rx="14" fill="#fbbf24" />
      <rect x="12" y="6" width="56" height="20" rx="14" fill="#f59e0b" />
      <rect x="12" y="20" width="56" height="6" fill="#f59e0b" />
      <rect x="18" y="16" width="44" height="42" rx="8" fill="#0f172a" />
      <rect x="18" y="16" width="44" height="16" rx="8" fill="#1e3a5f" opacity="0.5" />
      <circle cx="30" cy="36" r="7" fill="#38bdf8" />
      <circle cx="30" cy="36" r="4.5" fill="#0284c7" />
      <circle cx="32" cy="34" r="1.8" fill="white" opacity="0.9" />
      <circle cx="50" cy="36" r="7" fill="#38bdf8" />
      <circle cx="50" cy="36" r="4.5" fill="#0284c7" />
      <circle cx="52" cy="34" r="1.8" fill="white" opacity="0.9" />
      <path d="M30 48 Q40 55 50 48" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M5 22 L10 14 L14 22 L10 22 L14 30 L9 30 L5 22 Z" fill="#fde68a" opacity="0.85" />
      <path d="M75 22 L70 14 L66 22 L70 22 L66 30 L71 30 L75 22 Z" fill="#fde68a" opacity="0.85" />
      <path d="M66 8 L66 12 M64 10 L68 10" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 58 L68 61 M66.5 59.5 L69.5 59.5" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
