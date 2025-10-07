"use client";

import { Victories } from "~/components/layout/leaderboard/stats/player/victories";
import { WinRate } from "~/components/layout/leaderboard/stats/player/win-rate";
import { Card, CardContent } from "~/components/ui/card";
import { EmptyListError } from "~/errors";
import { api } from "~/trpc/react";
import { PlayerPlacement } from "../player-placement";

export function LeaderboardPlayerByWins() {
  const [data] = api.leaderboard.byWins.useSuspenseQuery({ limit: 10 });

  if (!data || data.length === 0) throw new EmptyListError();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          Classificação baseada no número total de vitórias dos jogadores
          independentemente do número de partidas perdidas. Jogadores que mais
          venceram estão no topo da lista mesmo que possam ter mais derrotas.
        </CardContent>
      </Card>

      {data.map((ranking, index) => (
        <PlayerPlacement
          key={ranking.playerId}
          stats={[Victories(ranking), WinRate(ranking)]}
          {...ranking}
          rank={index + 1}
        />
      ))}
    </div>
  );
}
