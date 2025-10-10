import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import z from "zod";
import { players } from "~/server/db/schema";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const playerRouter = createTRPCRouter({
  register: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        email: z.string().email().max(256),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingPlayer = await ctx.db.query.players.findFirst({
        where: eq(players.email, input.email),
        columns: { id: true },
      });

      if (existingPlayer)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email já cadastrado.",
        });

      const newPlayer = await ctx.db
        .insert(players)
        .values({
          name: input.name,
          email: input.email,
          description: input.description,
          registeredByAdminId: ctx.session.user.id,
        })
        .returning({ id: players.id });

      return {
        success: true,
        playerId: newPlayer[0]!.id,
        message: "Jogador cadastrado com sucesso.",
      };
    }),

  list: adminProcedure.query(async ({ ctx }) => {
    const playerList = await ctx.db
      .select({
        id: players.id,
        name: players.name,
      })
      .from(players)
      .orderBy(asc(players.name));

    return playerList;
  }),
});
