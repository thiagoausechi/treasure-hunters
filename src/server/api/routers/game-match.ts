import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { matches } from "~/server/db/schema";

export const gameMatchRouter = createTRPCRouter({
  start: privateProcedure
    .input(
      z.object({
        bluePlayerId: z.string().uuid(),
        pinkPlayerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pendingMatch = await ctx.db.query.matches.findFirst({
        where: eq(matches.status, "PENDING"),
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
});
