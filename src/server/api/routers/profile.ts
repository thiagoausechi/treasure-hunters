import { asc, desc, eq, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";
import { matches, players } from "~/server/db/schema";
import { playerRankingsView } from "~/server/db/views";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  byId: publicProcedure
    .input(z.object({ playerId: z.string().uuid() }))
    .query(async ({ ctx, input: { playerId } }) => {
      const mainStats = await ctx.db
        .select()
        .from(playerRankingsView)
        .where(eq(playerRankingsView.playerId, playerId))
        .limit(1);

      if (mainStats.length === 0) throw new Error("Jogador não encontrado");

      const m = alias(matches, "m");

      const descriptionQuery = ctx.db
        .select({
          description: players.description,
        })
        .from(players)
        .where(eq(players.id, playerId));

      const sideStatsQuery = ctx.db
        .select({
          winsBlue: sql<number>`count(*) filter (where ${m.bluePlayerId} = ${playerId} and ${m.blueScore} > ${m.pinkScore})::int`,
          totalBlue: sql<number>`count(*) filter (where ${m.bluePlayerId} = ${playerId})::int`,
          winsPink: sql<number>`count(*) filter (where ${m.pinkPlayerId} = ${playerId} and ${m.pinkScore} > ${m.blueScore})::int`,
          totalPink: sql<number>`count(*) filter (where ${m.pinkPlayerId} = ${playerId})::int`,
        })
        .from(m);

      const recordsQuery = ctx.db
        .select({
          highestIndividualScore: sql<number>`max(case when ${m.bluePlayerId} = ${playerId} then ${m.blueScore} else ${m.pinkScore} end)`,
          biggestWinMargin: sql<number>`max(abs(${m.blueScore} - ${m.pinkScore})) filter (where (${m.bluePlayerId} = ${playerId} and ${m.blueScore} > ${m.pinkScore}) or (${m.pinkPlayerId} = ${playerId} and ${m.pinkScore} > ${m.blueScore}))`,
        })
        .from(m)
        .where(or(eq(m.bluePlayerId, playerId), eq(m.pinkPlayerId, playerId)));

      const opponentSubquery = ctx.db
        .select({
          opponentId:
            sql<string>`case when ${m.bluePlayerId} = ${playerId} then ${m.pinkPlayerId} else ${m.bluePlayerId} end`.as(
              "opponentId",
            ),
        })
        .from(m)
        .where(or(eq(m.bluePlayerId, playerId), eq(m.pinkPlayerId, playerId)))
        .as("opponents");

      const frequentOpponentQuery = ctx.db
        .select({
          opponentId: opponentSubquery.opponentId,
          opponentName: players.name,
          matchCount: sql<number>`count(*)::int`,
        })
        .from(opponentSubquery)
        .innerJoin(players, eq(players.id, opponentSubquery.opponentId))
        .groupBy(opponentSubquery.opponentId, players.name)
        .orderBy(desc(sql`count(*)`), asc(players.name))
        .limit(1);

      const [
        descriptionResult,
        sideStatsResult,
        recordsResult,
        frequentOpponentResult,
      ] = await Promise.all([
        descriptionQuery,
        sideStatsQuery,
        recordsQuery,
        frequentOpponentQuery,
      ]);

      const playerDescription = descriptionResult[0]?.description ?? null;
      const sideStats = sideStatsResult[0];
      const records = recordsResult[0];
      const frequentOpponent = frequentOpponentResult[0] ?? null;

      return {
        mainStats: mainStats[0],
        playerDescription,
        sideStats: {
          blue: {
            total: sideStats?.totalBlue ?? 0,
            wins: sideStats?.winsBlue ?? 0,
          },
          pink: {
            total: sideStats?.totalPink ?? 0,
            wins: sideStats?.winsPink ?? 0,
          },
        },
        records: {
          biggestWinMargin: records?.biggestWinMargin ?? 0,
          highestIndividualScore: records?.highestIndividualScore ?? 0,
        },
        frequentOpponent,
      };
    }),
});
