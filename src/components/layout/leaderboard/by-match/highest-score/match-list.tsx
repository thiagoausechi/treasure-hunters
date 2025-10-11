"use client";

import { api } from "~/trpc/react";
import { EmptyList } from "../../empty-list";
import { Stat } from "../../stats";
import { MatchSummary } from "../match-summary";

export function LeaderboardMatchHighestScoreList() {
  const [matchList] = api.leaderboard.highestScore.useSuspenseQuery({
    limit: 10,
  });

  if (!matchList || matchList.length === 0) return <EmptyList />;

  return matchList.map((match) => (
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
  ));
}
