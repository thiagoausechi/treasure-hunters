"use client";

import { Victories } from "~/components/layout/leaderboard/stats/player/victories";
import { WinRate } from "~/components/layout/leaderboard/stats/player/win-rate";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { EmptyList } from "../../empty-list";
import { PlayerPlacement } from "../player-placement";

export function LeaderboardPlayerByWinRate() {
  const [data] = api.leaderboard.byWinRate.useSuspenseQuery({ limit: 10 });

  if (!data || data.length === 0) return <EmptyList />;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          Classificação baseada na taxa de vitórias dos jogadores, calculada com
          o número de vitórias dividido pelo número total de partidas jogadas.
          Jogadores com maior proporção de vitórias estão no topo da lista,
          destacando aqueles que consistentemente vencem suas partidas. É
          necessário ter jogado <strong>pelo menos 5 partidas</strong> para
          entrar na lista.
        </CardContent>
      </Card>

      {data.map((ranking, index) => (
        <PlayerPlacement
          key={ranking.playerId}
          stats={[WinRate(ranking), Victories(ranking)]}
          {...ranking}
          rank={index + 1}
        />
      ))}
    </div>
  );
}
