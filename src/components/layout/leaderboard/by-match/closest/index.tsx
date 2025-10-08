"use client";

import { Card, CardContent } from "~/components/ui/card";
import { EmptyListError } from "~/errors";
import { formatPlural } from "~/lib/utils";
import { api } from "~/trpc/react";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchClosest() {
  const [data] = api.leaderboard.mostCompetitive.useSuspenseQuery({
    limit: 10,
  });

  if (!data || data.length === 0) throw new EmptyListError();

  return (
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

      {data.map((match) => (
        <MatchSummary
          key={match.matchId}
          footer={
            match.scoreDispute &&
            match.scoreDispute > 0 && (
              <div className="text-muted-foreground text-sm">
                Vencido por <strong>{match.scoreDispute}</strong>{" "}
                {formatPlural({
                  count: match.scoreDispute,
                  singular: "ponto",
                  plural: "pontos",
                })}
              </div>
            )
          }
          {...match}
        />
      ))}
    </div>
  );
}
