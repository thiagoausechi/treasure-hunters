"use client";

import { getByPerformanceTier } from "~/lib/performance-tier";
import { api } from "~/trpc/react";
import { EmptyList } from "../../empty-list";
import { ScoreDiff, ScoreDiffBalance } from "../../stats/player/score-diff";
import { PlayerPlacement } from "../player-placement";

export function LeaderboardPlayerByScoreDiffPlacementList() {
  const [placementList] = api.leaderboard.byScoreDifference.useSuspenseQuery({
    limit: 10,
  });

  if (!placementList || placementList.length === 0) return <EmptyList />;

  return placementList.map((ranking, index) => {
    const { label, rankDescription } = getByPerformanceTier({
      tier: ranking.performanceTier,
      scoreDifference: ranking.scoreDifference,
    });

    return (
      <PlayerPlacement
        key={ranking.playerId}
        stats={[ScoreDiff(ranking), ScoreDiffBalance(ranking)]}
        badge={
          <p className="flex flex-col-reverse items-end justify-end gap-2 sm:flex-row sm:items-baseline">
            <span className="text-muted-foreground grow text-xs">
              ({rankDescription})
            </span>
            <span className="shrink-0 text-right">{label}</span>
          </p>
        }
        {...ranking}
        rank={index + 1}
      />
    );
  });
}
