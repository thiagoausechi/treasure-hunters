import { LeaderboardMatchRelevanceList } from "~/components/layout/leaderboard/by-match/relevance/match-list";
import { Card, CardContent } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function LeaderboardMatchRelevancePage() {
  void api.leaderboard.byRelevanceScore.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <div className="space-y-4">
        <Card>
          <CardContent>
            Este ranking busca identificar as partidas de maior qualidade geral,
            combinando dois fatores estratégicos:{" "}
            <strong>disputa acirrada</strong> (margens de vitória apertadas) e{" "}
            <strong>alto volume de jogo</strong> (total de pontos marcados). Uma
            partida no topo desta lista representa o auge da competição: um
            confronto tenso, onde ambos os jogadores operaram em seu nível
            máximo do início ao fim.
          </CardContent>
        </Card>

        <LeaderboardMatchRelevanceList />
      </div>
    </HydrateClient>
  );
}
