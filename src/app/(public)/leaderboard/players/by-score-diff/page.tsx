import { LeaderboardPlayerByScoreDiffPlacementList } from "~/components/layout/leaderboard/by-player/by-score-diff/placement-list";
import { Card, CardContent } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function LeaderboardPlayerByScoreDiffPage() {
  void api.leaderboard.byScoreDifference.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <div className="space-y-4">
        <Card>
          <CardContent>
            Este ranking reflete a eficiência de um jogador em ambos os lados do
            campo. Ele mostra quem consegue maximizar seus ataques enquanto
            minimiza os danos sofridos, resultando no maior saldo de pontos
            positivo. Um saldo alto indica um equilíbrio perfeito entre um
            ataque poderoso e uma defesa impenetrável.
          </CardContent>
        </Card>

        <LeaderboardPlayerByScoreDiffPlacementList />
      </div>
    </HydrateClient>
  );
}
