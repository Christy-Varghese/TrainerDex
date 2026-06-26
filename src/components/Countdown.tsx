"use client";

import { useEffect, useState } from "react";
import { formatCountdown, isActive, msUntil, parseLocal } from "@/lib/time";

interface Props {
  startISO: string;
  endISO: string;
}

/**
 * Live ticking countdown. Shows "ends in …" once an event is active, otherwise
 * "starts in …". Time-limited windows (Spotlight/Raid Hour) are the whole point
 * of the site, so the clock updates every second.
 */
export default function Countdown({ startISO, endISO }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Defer the first real value to the client to avoid a hydration mismatch,
    // then tick every second. The immediate set is intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Render nothing time-sensitive on the server to avoid hydration mismatch.
  if (!now) return <span className="tabular-nums text-slate-400">—</span>;

  const active = isActive(startISO, endISO, now);
  const target = active ? endISO : startISO;
  const ms = msUntil(target, now);

  if (parseLocal(endISO).getTime() < now.getTime()) {
    return <span className="tabular-nums text-slate-400">ended</span>;
  }

  return (
    <span className="tabular-nums">
      <span className={active ? "text-emerald-600" : "text-sky-600"}>
        {active ? "ends in " : "starts in "}
      </span>
      <span className="font-semibold text-slate-900">{formatCountdown(ms)}</span>
    </span>
  );
}
