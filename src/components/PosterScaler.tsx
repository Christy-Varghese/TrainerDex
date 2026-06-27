"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scales a fixed-width poster to fit the viewport on small screens.
 * - Desktop (container ≥ posterWidth): no transform; the inner div is centered via mx-auto.
 * - Mobile (container < posterWidth): CSS scale from top-left so the visual poster
 *   fills the available width exactly. The outer div gets an explicit height to
 *   compensate for the layout space the scaled element would otherwise leave behind.
 *
 * DOM dimensions inside #poster stay at posterWidth px, so Playwright / Puppeteer
 * PNG capture still works at full resolution.
 */
export default function PosterScaler({
  posterWidth,
  children,
}: {
  posterWidth: number;
  children: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    function recalc() {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const newScale = Math.min(1, outer.clientWidth / posterWidth);
      setScale(newScale);
      setScaledHeight(inner.scrollHeight * newScale);
    }

    recalc();
    const ro = new ResizeObserver(recalc);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [posterWidth]);

  return (
    <div
      ref={outerRef}
      className="w-full overflow-hidden"
      style={{ height: scaledHeight }}
    >
      <div
        ref={innerRef}
        style={{
          width: posterWidth,
          // On desktop, center the fixed-width poster within the wider container.
          // On mobile, mx-auto resolves to margin-left:0 (can't be negative)
          // so the poster starts at x:0 and the scale fills the container exactly.
          marginLeft: "auto",
          marginRight: "auto",
          // Scale from top-left so the visual element stays within the container
          // bounds and getBoundingClientRect() reports x + width ≤ containerWidth.
          transformOrigin: "top left",
          transform: scale < 1 ? `scale(${scale})` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
