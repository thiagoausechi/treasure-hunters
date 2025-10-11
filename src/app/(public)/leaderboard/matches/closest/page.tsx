import { LeaderboardMatchClosestList } from "~/components/layout/leaderboard/by-match/closest/match-list";
import { Card, CardContent } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function LeaderboardMatchClosestPage() {
  void api.leaderboard.mostCompetitive.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <div className="space-y-4">
        <Card>
          <CardContent>
            Aqui são destacadas as batalhas mais táticas e tensas, aquelas que
            foram decididas por detalhes. A classificação é baseada na
            <strong> menor diferença</strong> absoluta de pontos entre os
            competidores. Figurar nesta lista demonstra resiliência e controle
            emocional, pois são partidas onde cada ponto foi crucial e um único
            erro poderia definir o resultado.
          </CardContent>
        </Card>

        <LeaderboardMatchClosestList />
      </div>
    </HydrateClient>
  );
}
