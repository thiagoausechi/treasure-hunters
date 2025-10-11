import { LeaderboardMatchRecentsList } from "~/components/layout/leaderboard/by-match/recent/match-list";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default function LeaderboardMatchRecentsPage() {
  void api.leaderboard.recentMatches.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <div className="space-y-4">
        <LeaderboardMatchRecentsList />
      </div>
    </HydrateClient>
  );
}
