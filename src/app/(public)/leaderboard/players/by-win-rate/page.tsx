import { LeaderboardPlayerByWinRatePlacementList } from "~/components/layout/leaderboard/by-player/by-win-rate/placement-list";
import { Card, CardContent } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function LeaderboardPlayerByWinRatePage() {
  void api.leaderboard.byWins.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <div className="space-y-4">
        <Card>
          <CardContent>
            Classificação baseada na taxa de vitórias dos jogadores, calculada
            com o número de vitórias dividido pelo número total de partidas
            jogadas. Jogadores com maior proporção de vitórias estão no topo da
            lista, destacando aqueles que consistentemente vencem suas partidas.
            É necessário ter jogado <strong>pelo menos 5 partidas</strong> para
            entrar na lista.
          </CardContent>
        </Card>

        <LeaderboardPlayerByWinRatePlacementList />
      </div>
    </HydrateClient>
  );
}
