import { cn } from "~/lib/utils";
import type { PlayerRanking } from "~/server/db/views";

export function ScoreDiff({ scoreDifference }: PlayerRanking) {
  return {
    label: "Saldo Total",
    value: (
      <p
        className={cn("text-xl font-bold", {
          "text-chart-4": scoreDifference && scoreDifference > 0,
          "text-destructive": scoreDifference && scoreDifference < 0,
        })}
      >
        {scoreDifference?.toLocaleString("pt-BR")}
      </p>
    ),
  };
}

export function ScoreDiffBalance(ranking: PlayerRanking) {
  const totalScoreFor = ranking.totalScoreFor ?? 0;
  const totalScoreAgainst = ranking.totalScoreAgainst ?? 0;

  const moreScore = totalScoreFor > totalScoreAgainst;
  const equalScore = totalScoreFor === totalScoreAgainst;

  return {
    label: "Balanço",
    value: (
      <p>
        <span
          className={cn({
            "text-xl font-bold": moreScore || equalScore,
            "text-chart-4": moreScore && !equalScore,
          })}
        >
          {moreScore && !equalScore && "▲ "}
          {totalScoreFor.toLocaleString("pt-BR")}
        </span>
        /
        <span
          className={cn({
            "text-xl font-bold": !moreScore || equalScore,
            "text-destructive": !moreScore && !equalScore,
          })}
        >
          {totalScoreAgainst.toLocaleString("pt-BR")}
          {!moreScore && !equalScore && " ▼"}
        </span>
      </p>
    ),
  };
}
