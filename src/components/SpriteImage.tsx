"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** Square render size in px (sprites are square icons). */
  size?: number;
  className?: string;
  priority?: boolean;
};

/**
 * Sprite renderer using next/image with a graceful placeholder. Remote sprites
 * (PokeMiners / PokéAPI mirrors) 404 occasionally; CLAUDE.md mandates a
 * placeholder over a broken <img>. `unoptimized` skips the Vercel image
 * optimizer — these are tiny pixel-art PNGs where optimization adds latency and
 * the optimizer hard-fails the request on a 404 upstream.
 */
export default function SpriteImage({ src, alt, size = 64, className = "", priority }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <span
        role="img"
        aria-label={alt || "sprite unavailable"}
        className={`grid place-items-center rounded-full bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-slate-500 ${className}`}
        style={{ width: size, height: size }}
      >
        {/* Poké Ball placeholder */}
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h6M15 12h6" />
          <circle cx="12" cy="12" r="2.4" />
        </svg>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      priority={priority}
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
    />
  );
}
