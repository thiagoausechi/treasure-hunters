"use client";

import { Card, CardContent } from "~/components/ui/card";
import { EmptyListError } from "~/errors/empty-list";
import { formatTimeAgo } from "~/lib/utils";
import { api } from "~/trpc/react";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchRelevance() {
  const [data] = api.leaderboard.byRelevanceScore.useSuspenseQuery({
    limit: 10,
  });

  if (!data || data.length === 0) throw new EmptyListError();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          Este ranking busca identificar as partidas de maior qualidade geral,
          combinando dois fatores estratégicos:{" "}
          <strong>disputa acirrada</strong> (margens de vitória apertadas) e{" "}
          <strong>alto volume de jogo</strong> (total de pontos marcados). Uma
          partida no topo desta lista representa o auge da competição: um
          confronto tenso, onde ambos os jogadores operaram em seu nível máximo
          do início ao fim.
        </CardContent>
      </Card>

      {data.map((match) => (
        <MatchSummary
          key={match.matchId}
          footer={
            <div className="text-muted-foreground text-sm">
              {formatTimeAgo(match.createdAt ?? new Date())}
            </div>
          }
          {...match}
        />
      ))}
    </div>
  );
}
