import {
  bigint,
  decimal,
  integer,
  pgView,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const playerRankingsView = pgView("treasure-hunters_player_rankings", {
  playerId: uuid("player_id").primaryKey(),
  playerName: varchar("player_name", { length: 256 }),
  totalMatches: bigint("total_matches", { mode: "number" }),
  totalWins: bigint("total_wins", { mode: "number" }),
  totalLosses: bigint("total_losses", { mode: "number" }),
  totalDraws: bigint("total_draws", { mode: "number" }),
  totalScoreFor: bigint("total_score_for", { mode: "number" }),
  totalScoreAgainst: bigint("total_score_against", { mode: "number" }),
  scoreDifference: bigint("score_difference", { mode: "number" }),
  scoreDifferenceRank: decimal("score_difference_rank"),
  performanceTier: bigint("performance_tier", { mode: "number" }),
  winRate: decimal("win_rate"),
  winRateRank: decimal("win_rate_rank"),
  rank: bigint("rank", { mode: "number" }),
}).existing();

export type PlayerRanking = typeof playerRankingsView.$inferSelect;

export const matchMetricsView = pgView("treasure-hunters_match_metrics", {
  matchId: uuid("match_id").primaryKey(),
  createdAt: timestamp("createdAt", { withTimezone: true }),
  bluePlayerId: uuid("blue_player_id"),
  bluePlayerName: varchar("blue_player_name", { length: 256 }),
  blueScore: integer("blueScore"),
  pinkPlayerId: uuid("pink_player_id"),
  pinkPlayerName: varchar("pink_player_name", { length: 256 }),
  pinkScore: integer("pinkScore"),
  scoreDispute: integer("score_dispute"),
  totalScore: integer("total_score"),
  titansClashScore: bigint("titans_clash_score", { mode: "number" }),
}).existing();

export type MatchMetric = typeof matchMetricsView.$inferSelect;

export const relevanceScoreRankingView = pgView(
  "treasure-hunters_relevance_score_ranking",
  {
    matchId: uuid("match_id").primaryKey(),
    createdAt: timestamp("createdAt", { withTimezone: true }),
    bluePlayerId: uuid("blue_player_id"),
    bluePlayerName: varchar("blue_player_name", { length: 256 }),
    blueScore: integer("blueScore"),
    pinkPlayerId: uuid("pink_player_id"),
    pinkPlayerName: varchar("pink_player_name", { length: 256 }),
    pinkScore: integer("pinkScore"),
    scoreDispute: integer("score_dispute"),
    totalScore: integer("total_score"),
    titansClashScore: bigint("titans_clash_score", { mode: "number" }),
    relevanceScore: decimal("relevance_score"),
  },
).existing();

export type RelevanceScoreRanking =
  typeof relevanceScoreRankingView.$inferSelect;
