"use client";

import { api } from "~/trpc/react";
import { EmptyList } from "../../empty-list";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchClashOfTitansList() {
  const [matchList] = api.leaderboard.clashOfTitans.useSuspenseQuery({
    limit: 10,
  });

  if (!matchList || matchList.length === 0) return <EmptyList />;

  return matchList.map((match) => (
    <MatchSummary key={match.matchId} {...match} />
  ));
}
