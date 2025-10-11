import { LeaderboardMatchHighestScoreList } from "~/components/layout/leaderboard/by-match/highest-score/match-list";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function LeaderboardMatchHighestScorePage() {
  void api.leaderboard.highestScore.prefetch({ limit: 10 });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          Este ranking celebra as partidas mais explosivas e de ritmo acelerado.
          Ele classifica os jogos pela <strong>maior soma de pontos </strong>
          entre os dois jogadores, independentemente de quem venceu. Uma partida
          no topo demonstra um domínio da mecânica ofensiva por ambos os lados,
          resultando em um confronto de pura habilidade onde as estratégias
          defensivas foram constantemente postas à prova.
        </CardContent>
      </Card>

      <LeaderboardMatchHighestScoreList />
    </div>
  );
}
