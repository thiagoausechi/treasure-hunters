import type { ClassNameValue } from "tailwind-merge";
import { cn } from "~/lib/utils";

const ORIGINAL_SPRITE_SIZE = 16;

const SPRITESHEET_DIMENSIONS = {
  width: ORIGINAL_SPRITE_SIZE * 6, // 6 icons per row
  height: ORIGINAL_SPRITE_SIZE * 6, // 6 icons per column
};

const ICON_COORDS_LOOKUP = {
  // Bronze Icons
  BronzeCoin: { x: 0, y: 0 },
  BronzeSmallPile: { x: 1, y: 0 },
  BronzeLargePile: { x: 2, y: 0 },
  BronzeBag: { x: 3, y: 0 },
  BronzeChalice: { x: 4, y: 0 },
  BronzeIngot: { x: 5, y: 0 },

  // Silver Icons
  SilverCoin: { x: 0, y: 1 },
  SilverSmallPile: { x: 1, y: 1 },
  SilverLargePile: { x: 2, y: 1 },
  SilverBag: { x: 3, y: 1 },
  SilverChalice: { x: 4, y: 1 },
  SilverIngot: { x: 5, y: 1 },

  // Gold Icons
  GoldenCoin: { x: 0, y: 2 },
  GoldenSmallPile: { x: 1, y: 2 },
  GoldenLargePile: { x: 2, y: 2 },
  GoldenBag: { x: 3, y: 2 },
  GoldenChalice: { x: 4, y: 2 },
  GoldenIngot: { x: 5, y: 2 },
  GoldenClover: { x: 5, y: 3 },

  // Players
  PinkChest: { x: 0, y: 3 },
  PinkPlayer: { x: 1, y: 3 },
  BluePlayer: { x: 2, y: 3 },
  BlueChest: { x: 3, y: 3 },
  Chest: { x: 4, y: 3 },
} as const;

export type IconName = keyof typeof ICON_COORDS_LOOKUP;

interface Props {
  name: IconName;
  size?: number;
  className?: ClassNameValue;
}

export const GameIcon = ({ name, size = 32, className = "" }: Props) => {
  const coords = ICON_COORDS_LOOKUP[name];

  if (!coords) {
    console.warn(`Ícone "${name}" não encontrado.`);
    return null;
  }

  const scale = size / ORIGINAL_SPRITE_SIZE;
  const backgroundWidth = SPRITESHEET_DIMENSIONS.width * scale;
  const backgroundHeight = SPRITESHEET_DIMENSIONS.height * scale;
  const backgroundPosX = coords.x * scale * ORIGINAL_SPRITE_SIZE;
  const backgroundPosY = coords.y * scale * ORIGINAL_SPRITE_SIZE;

  const iconStyle: React.CSSProperties = {
    backgroundImage: `url('/assets/img/icon-spritesheet.png')`,
    backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`,
    backgroundPosition: `-${backgroundPosX}px -${backgroundPosY}px`,

    width: `${size}px`,
    height: `${size}px`,
    imageRendering: "pixelated",
  };

  return (
    <span
      style={iconStyle}
      className={cn("inline-block", className)}
      role="img"
      aria-label={`${name} icon`}
    />
  );
};
