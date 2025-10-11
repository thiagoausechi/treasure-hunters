"use client";

import { api } from "~/trpc/react";
import { EmptyList } from "../../empty-list";
import { Victories } from "../../stats/player/victories";
import { WinRate } from "../../stats/player/win-rate";
import { PlayerPlacement } from "../player-placement";

export function LeaderboardPlayerByWinRatePlacementList() {
  const [placementList] = api.leaderboard.byWinRate.useSuspenseQuery({
    limit: 10,
  });

  if (!placementList || placementList.length === 0) return <EmptyList />;

  return placementList.map((ranking, index) => (
    <PlayerPlacement
      key={ranking.playerId}
      stats={[WinRate(ranking), Victories(ranking)]}
      {...ranking}
      rank={index + 1}
    />
  ));
}
