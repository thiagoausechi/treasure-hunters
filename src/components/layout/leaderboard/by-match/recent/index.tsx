"use client";

import { EmptyListError } from "~/errors";
import { formatTimeAgo } from "~/lib/utils";
import { api } from "~/trpc/react";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchRecents() {
  const [data] = api.leaderboard.recentMatches.useSuspenseQuery({ limit: 10 });

  if (!data || data.length === 0) throw new EmptyListError();

  return (
    <div className="space-y-4">
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
