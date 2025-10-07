import React from "react";
import { LeaderboardNav } from "~/components/layout/leaderboard/leaderboard-nav";

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>

      <footer className="shrink-0">
        <LeaderboardNav />
      </footer>
    </React.Fragment>
  );
}
