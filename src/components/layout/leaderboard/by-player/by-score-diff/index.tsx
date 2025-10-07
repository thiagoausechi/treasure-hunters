"use client";

import {
  ScoreDiff,
  ScoreDiffBalance,
} from "~/components/layout/leaderboard/stats/player/score-diff";
import { Card, CardContent } from "~/components/ui/card";
import { EmptyListError } from "~/errors";
import { api } from "~/trpc/react";
import { PlayerPlacement } from "../player-placement";

const tierConfig = {
  0: { label: "Sem Classificação" },
  1: { label: "Soberano" },
  2: { label: "Dominante" },
  3: { label: "Equilibrado" },
  4: { label: "Em Apuros" },
  5: { label: "Em Dificuldade" },
} as const;

export function LeaderboardPlayerByScoreDiff() {
  const [data] = api.leaderboard.byScoreDifference.useSuspenseQuery({
    limit: 10,
  });

  if (!data || data.length === 0) throw new EmptyListError();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          Este ranking reflete a eficiência de um jogador em ambos os lados do
          campo. Ele mostra quem consegue maximizar seus ataques enquanto
          minimiza os danos sofridos, resultando no maior saldo de pontos
          positivo. Um saldo alto indica um equilíbrio perfeito entre um ataque
          poderoso e uma defesa impenetrável.
        </CardContent>
      </Card>

      {data.map((ranking, index) => {
        let config =
          tierConfig[(ranking.performanceTier as keyof typeof tierConfig) ?? 0];

        if (ranking.scoreDifference === 0) config = tierConfig[3];

        return (
          <PlayerPlacement
            key={ranking.playerId}
            stats={[ScoreDiff(ranking), ScoreDiffBalance(ranking)]}
            badge={<div className="flex justify-end">{config.label}</div>}
            {...ranking}
            rank={index + 1}
          />
        );
      })}
    </div>
  );
}
