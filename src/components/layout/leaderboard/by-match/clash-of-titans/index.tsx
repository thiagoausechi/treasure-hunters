"use client";

import { Card, CardContent } from "~/components/ui/card";
import { EmptyListError } from "~/errors";
import { api } from "~/trpc/react";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchClashOfTitans() {
  const [data] = api.leaderboard.clashOfTitans.useSuspenseQuery({
    limit: 10,
  });

  if (!data || data.length === 0) throw new EmptyListError();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          Mais do que uma simples partida, estes são os confrontos que definem o
          topo do cenário competitivo. Esta lista classifica os jogos com base
          no ranking combinado dos jogadores envolvidos. Participar de um
          &quot;Duelo de Titãs&quot; significa competir no mais alto nível
          estratégico, onde a leitura do oponente e a profundidade tática são
          levadas ao extremo — são as partidas que os outros jogadores assistem
          para aprender.
        </CardContent>
      </Card>

      {data.map((match) => (
        <MatchSummary key={match.matchId} {...match} />
      ))}
    </div>
  );
}
