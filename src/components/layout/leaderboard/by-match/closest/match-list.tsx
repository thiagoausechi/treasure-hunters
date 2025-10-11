"use client";

import { formatPlural } from "~/lib/utils";
import { api } from "~/trpc/react";
import { EmptyList } from "../../empty-list";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchClosestList() {
  const [matchList] = api.leaderboard.mostCompetitive.useSuspenseQuery({
    limit: 10,
  });

  if (!matchList || matchList.length === 0) return <EmptyList />;

  return matchList.map((match) => (
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
  ));
}
