"use client";

import { MatchSummary } from "~/components/layout/leaderboard/by-match/match-summary";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { formatDuration, formatTimeAgo } from "~/lib/utils";
import { api } from "~/trpc/react";

/**
 * Sem conexão persistente no serverless, a lista é
 * atualizada por polling.
 */
const REFRESH_INTERVAL_MS = 5_000;

export default function LatestMatchesPage() {
  const { data: matchList } = api.gameMatch.latest.useQuery(
    { limit: 10 },
    {
      refetchInterval: REFRESH_INTERVAL_MS,
      // Caso aberta em background, o polling é pausado. Mas queremos que continue.
      // Como esta telá será comumente utilizada no OBS, ele pode reportar a página como oculta,
      // então forçamos o polling mesmo assim.
      refetchIntervalInBackground: true,
    },
  );

  return (
    <main className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">
      {matchList?.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma partida registrada ainda.</CardTitle>
          </CardHeader>
        </Card>
      )}

      {matchList?.map((match) => (
        <MatchSummary
          key={match.matchId}
          footer={
            <div className="text-muted-foreground flex grow justify-between gap-4 text-sm">
              <span>{formatDuration(match.durationInSeconds ?? 0)}</span>
              <span>{formatTimeAgo(match.endedAt ?? new Date())}</span>
            </div>
          }
          {...match}
        />
      ))}
    </main>
  );
}
