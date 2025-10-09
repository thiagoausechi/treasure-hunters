import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  gameClientProcedure,
} from "~/server/api/trpc";
import { matchCollectedItems, matches } from "~/server/db/schema";

export const gameMatchRouter = createTRPCRouter({
  start: adminProcedure
    .input(
      z.object({
        bluePlayerId: z.string().uuid(),
        pinkPlayerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pendingMatch = await ctx.db.query.matches.findFirst({
        where: eq(matches.status, "PENDING"),
        columns: { id: true },
      });

      if (pendingMatch)
        return {
          success: false,
          matchId: pendingMatch.id,
          message:
            "Já existe uma partida pendente. Por favor, finalize-a antes de iniciar uma nova.",
        };

      const newMatch = await ctx.db
        .insert(matches)
        .values({
          bluePlayerId: input.bluePlayerId,
          pinkPlayerId: input.pinkPlayerId,
          status: "PENDING",
        })
        .returning({ id: matches.id });

      return {
        success: true,
        matchId: newMatch[0]!.id,
        message: "Partida iniciada e aguardando resultados.",
      };
    }),

  end: gameClientProcedure
    .input(
      z.object({
        blueScore: z.number().int().min(0),
        pinkScore: z.number().int().min(0),
        durationSeconds: z.number().int().min(0),
        collectedItems: z.array(
          z.object({
            playerId: z.string().uuid(),
            itemName: z.string(),
            quantity: z.number().int().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pendingMatch = await ctx.db.query.matches.findFirst({
        where: eq(matches.status, "PENDING"),
        columns: { id: true },
      });

      if (!pendingMatch)
        return {
          success: true,
          message:
            "Nenhuma partida oficial encontrada. Resultados descartados (partida amistosa).",
        };

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(matches)
          .set({
            blueScore: input.blueScore,
            pinkScore: input.pinkScore,
            durationInSeconds: input.durationSeconds,
            status: "COMPLETED",
          })
          .where(eq(matches.id, pendingMatch.id));

        if (input.collectedItems.length > 0) {
          const itemsToInsert = input.collectedItems.map((item) => ({
            ...item,
            matchId: pendingMatch.id,
          }));

          await tx.insert(matchCollectedItems).values(itemsToInsert);
        }
      });

      await ctx.db.execute(
        sql`REFRESH MATERIALIZED VIEW CONCURRENTLY "treasure-hunters_player_rankings";`,
      );
      await ctx.db.execute(
        sql`REFRESH MATERIALIZED VIEW CONCURRENTLY "treasure-hunters_match_metrics";`,
      );
      await ctx.db.execute(
        sql`REFRESH MATERIALIZED VIEW CONCURRENTLY "treasure-hunters_relevance_score_ranking";`,
      );

      return {
        success: true,
        matchId: pendingMatch.id,
        message: "Resultados da partida registrados com sucesso.",
      };
    }),

  cancel: adminProcedure.mutation(async ({ ctx }) => {
    const pendingMatch = await ctx.db.query.matches.findFirst({
      where: eq(matches.status, "PENDING"),
      columns: { id: true },
    });

    if (!pendingMatch)
      return {
        success: false,
        message: "Nenhuma partida em aberto para cancelar.",
      };

    await ctx.db.delete(matches).where(eq(matches.id, pendingMatch.id));

    return { success: true, message: "A partida em aberto foi cancelada." };
  }),
});
