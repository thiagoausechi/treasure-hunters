import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
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
