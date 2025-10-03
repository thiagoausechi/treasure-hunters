import { sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { matches } from "~/server/db/schema";

export const gameMatchRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        bluePlayerId: z.string().uuid(),
        blueScore: z.number().int().min(0),
        pinkPlayerId: z.string().uuid(),
        pinkScore: z.number().int().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newMatch = await ctx.db
        .insert(matches)
        .values({
          bluePlayerId: input.bluePlayerId,
          blueScore: input.blueScore,
          pinkPlayerId: input.pinkPlayerId,
          pinkScore: input.pinkScore,
        })
        .returning();

      // Usamos CONCURRENTLY para não bloquear as leituras enquanto atualiza
      // O refresh precisa ser na ordem de dependência.
      await ctx.db.execute(
        sql`REFRESH MATERIALIZED VIEW CONCURRENTLY "treasure-hunters_player_rankings";`,
      );
      await ctx.db.execute(
        sql`REFRESH MATERIALIZED VIEW CONCURRENTLY "treasure-hunters_match_metrics";`,
      );
      await ctx.db.execute(
        sql`REFRESH MATERIALIZED VIEW CONCURRENTLY "treasure-hunters_relevance_score_ranking";`,
      );

      return newMatch;
    }),
  listAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).default(10),
        offset: z.number().min(0).default(0),
        orderDesc: z.boolean().default(true),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(matches)
        .orderBy(sql`created_at ${input.orderDesc ? "DESC" : "ASC"}`)
        .limit(input.limit)
        .offset(input.offset);
    }),
});
