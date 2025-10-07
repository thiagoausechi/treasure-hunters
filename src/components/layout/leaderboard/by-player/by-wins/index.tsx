"use client";

import { Victories } from "~/components/layout/leaderboard/stats/player/victories";
import { WinRate } from "~/components/layout/leaderboard/stats/player/win-rate";
import { EmptyListError } from "~/errors";
import { api } from "~/trpc/react";
import { PlayerPlacement } from "../player-placement";

export function LeaderboardPlayerByWins() {
  const [data] = api.leaderboard.byWins.useSuspenseQuery({ limit: 10 });

  if (!data || data.length === 0) throw new EmptyListError();

  return (
    <div className="space-y-4">
      {[...data].map((ranking) => (
        <PlayerPlacement
          key={ranking.playerId}
          stats={[Victories(ranking), WinRate(ranking)]}
          {...ranking}
        />
      ))}
    </div>
  );
}
