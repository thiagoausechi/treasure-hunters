"use client";

import { Card, CardContent } from "~/components/ui/card";
import { EmptyListError } from "~/errors";
import { api } from "~/trpc/react";
import { Stat } from "../../stats";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchHighestScore() {
  const [data] = api.leaderboard.highestScore.useSuspenseQuery({ limit: 10 });

  if (!data || data.length === 0) throw new EmptyListError();

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

      {data.map((match) => (
        <MatchSummary
          key={match.matchId}
          footer={
            <Stat
              label="Pontuação Total"
              value={
                <p>
                  <span className="text-xl font-bold">{match.totalScore}</span>
                </p>
              }
            />
          }
          {...match}
        />
      ))}
    </div>
  );
}
