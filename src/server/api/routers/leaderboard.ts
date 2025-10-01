import { asc, desc, gte } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  matchMetricsView,
  playerRankingsView,
  relevanceScoreRankingView,
} from "~/server/db/views";

export const leaderboardRouter = createTRPCRouter({
  // == Ranking de Jogadores ==
  byWins: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(playerRankingsView)
        .orderBy(
          desc(playerRankingsView.totalWins),
          desc(playerRankingsView.scoreDifference),
        )
        .limit(input.limit);
    }),

  byWinRate: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(playerRankingsView)
        .where(gte(playerRankingsView.totalMatches, 5)) // Filtra jogadores com no mínimo 5 partidas
        .orderBy(
          desc(playerRankingsView.winRate),
          desc(playerRankingsView.totalWins),
        )
        .limit(input.limit);
    }),

  byScoreDifference: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(playerRankingsView)
        .orderBy(desc(playerRankingsView.scoreDifference))
        .limit(input.limit);
    }),

  // == Ranking de Partidas ==
  byRelevanceScore: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(relevanceScoreRankingView)
        .orderBy(desc(relevanceScoreRankingView.relevanceScore))
        .limit(input.limit);
    }),

  mostCompetitive: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(matchMetricsView)
        .orderBy(
          asc(matchMetricsView.scoreDispute),
          desc(matchMetricsView.createdAt),
        ) // Menor diferença, depois mais recente
        .limit(input.limit);
    }),

  highestScore: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(matchMetricsView)
        .orderBy(
          desc(matchMetricsView.totalScore),
          desc(matchMetricsView.createdAt),
        ) // Maior soma de pontos, depois mais recente
        .limit(input.limit);
    }),

  clashOfTitans: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(matchMetricsView)
        .orderBy(
          asc(matchMetricsView.titansClashScore),
          desc(matchMetricsView.createdAt),
        ) // Menor soma dos ranks
        .limit(input.limit);
    }),
});
