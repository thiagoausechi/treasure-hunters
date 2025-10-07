import type { PlayerRanking } from "~/server/db/views";
import type { StatProps } from "..";

export function WinRate({ winRate }: PlayerRanking): StatProps {
  return {
    label: "Win Rate",
    value: (
      <p>
        <span className="text-xl font-bold">
          {(Number(winRate ?? "0") * 100).toFixed(1)}%
        </span>
      </p>
    ),
  };
}
