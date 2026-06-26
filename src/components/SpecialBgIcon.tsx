import Icon from "./Icon";

/** Special Background marker — globe, sits bottom-right of a sprite. Shown for
 *  Pokémon eligible for an event Special Background (Community Day features). */
export default function SpecialBgIcon({ size = 5 }: { size?: 4 | 5 | 6 }) {
  const box = size === 4 ? "h-4 w-4" : size === 6 ? "h-6 w-6" : "h-5 w-5";
  const icon = size === 4 ? "text-[10px]" : size === 6 ? "text-base" : "text-xs";
  return (
    <span
      title="Special Background eligible"
      className={`grid ${box} place-items-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-300`}
    >
      <Icon name="globe" title="Special Background eligible" className={icon} />
    </span>
  );
}
