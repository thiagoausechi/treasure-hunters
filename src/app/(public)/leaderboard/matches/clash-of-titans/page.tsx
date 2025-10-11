import { LeaderboardMatchClashOfTitansList } from "~/components/layout/leaderboard/by-match/clash-of-titans/match-list";
import { Card, CardContent } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function LeaderboardMatchClashOfTitansPage() {
  void api.leaderboard.clashOfTitans.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <div className="space-y-4">
        <Card>
          <CardContent>
            Mais do que uma simples partida, estes são os confrontos que definem
            o topo do cenário competitivo. Esta lista classifica os jogos com
            base no ranking combinado dos jogadores envolvidos. Participar de um
            &quot;Duelo de Titãs&quot; significa competir no mais alto nível
            estratégico, onde a leitura do oponente e a profundidade tática são
            levadas ao extremo — são as partidas que os outros jogadores
            assistem para aprender.
          </CardContent>
        </Card>

        <LeaderboardMatchClashOfTitansList />
      </div>
    </HydrateClient>
  );
}
