"use client";

import { formatTimeAgo } from "~/lib/utils";
import { api } from "~/trpc/react";
import { EmptyList } from "../../empty-list";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchRecents() {
  const [data] = api.leaderboard.recentMatches.useSuspenseQuery({ limit: 10 });

  if (!data || data.length === 0) return <EmptyList />;

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
