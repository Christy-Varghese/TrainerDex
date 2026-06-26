import Image from "next/image";

/** Shadow Pokémon marker — purple shadow-fire image, sits top-left of a sprite. */
export default function ShadowBadge({ size = 5 }: { size?: 4 | 5 | 6 }) {
  const px = size === 4 ? 16 : size === 6 ? 24 : 20;
  return (
    <span title="Shadow Pokémon" className="pointer-events-none block">
      <Image
        src="/shadow_img.png"
        alt="Shadow"
        width={px}
        height={px}
        className="object-contain drop-shadow-sm"
      />
    </span>
  );
}
