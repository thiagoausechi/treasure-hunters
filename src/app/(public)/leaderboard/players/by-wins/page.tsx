import { LeaderboardPlayerByWinsPlacementList } from "~/components/layout/leaderboard/by-player/by-wins/placement-list";
import { Card, CardContent } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function LeaderboardPlayerByWinsPage() {
  void api.leaderboard.byWins.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <div className="space-y-4">
        <Card>
          <CardContent>
            Classificação baseada no número total de vitórias dos jogadores
            independentemente do número de partidas perdidas. Jogadores que mais
            venceram estão no topo da lista mesmo que possam ter mais derrotas.
          </CardContent>
        </Card>

        <LeaderboardPlayerByWinsPlacementList />
      </div>
    </HydrateClient>
  );
}
