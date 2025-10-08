import { formatPlural } from "~/lib/utils";
import type { PlayerRanking } from "~/server/db/views";
import type { StatProps } from "..";

export function Victories({
  totalWins,
  totalMatches,
}: PlayerRanking): StatProps {
  return {
    label: formatPlural({
      count: totalWins,
      singular: "Vitória",
      plural: "Vitórias",
    }),
    value: (
      <p>
        <span className="text-xl font-bold">{totalWins}</span>
        <span className="text-muted-foreground">/{totalMatches}</span>
      </p>
    ),
  };
}
