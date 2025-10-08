"use client";

import {
  ScoreDiff,
  ScoreDiffBalance,
} from "~/components/layout/leaderboard/stats/player/score-diff";
import { Card, CardContent } from "~/components/ui/card";
import { EmptyListError } from "~/errors";
import { getByPerformanceTier } from "~/lib/performance-tier";
import { api } from "~/trpc/react";
import { PlayerPlacement } from "../player-placement";

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
        const { label, rankDescription } = getByPerformanceTier({
          tier: ranking.performanceTier,
          scoreDifference: ranking.scoreDifference,
        });

        return (
          <PlayerPlacement
            key={ranking.playerId}
            stats={[ScoreDiff(ranking), ScoreDiffBalance(ranking)]}
            badge={
              <p className="flex items-baseline justify-end gap-2">
                <span className="text-muted-foreground text-xs">
                  ({rankDescription})
                </span>
                <span>{label}</span>
              </p>
            }
            {...ranking}
            rank={index + 1}
          />
        );
      })}
    </div>
  );
}
