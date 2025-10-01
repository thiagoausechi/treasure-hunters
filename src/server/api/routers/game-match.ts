import { sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
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
});
