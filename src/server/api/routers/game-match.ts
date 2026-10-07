import { TRPCError } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";

import { getFirstName } from "~/lib/first-name";
import {
  adminProcedure,
  createTRPCRouter,
  gameClientProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { gameClients, matchCollectedItems, matches } from "~/server/db/schema";

const LATEST_MATCHES_TAG = "latest-matches";

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
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Já existe uma partida pendente. Por favor, finalize-a antes de iniciar uma nova.",
        });

      if (input.bluePlayerId === input.pinkPlayerId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Os jogadores devem ser diferentes.",
        });

      const newMatch = await ctx.db
        .insert(matches)
        .values({
          bluePlayerId: input.bluePlayerId,
          pinkPlayerId: input.pinkPlayerId,
          startedByAdminId: ctx.session.user.id,
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
        isRanked: z.boolean().optional(),
        collectedItems: z.array(
          z.object({
            depositedBy: z.enum(["BLUE", "PINK"]),
            depositedAt: z.enum(["BLUE", "PINK"]),
            itemId: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pendingMatch = await ctx.db.query.matches.findFirst({
        where: eq(matches.status, "PENDING"),
      });

      const gameClient = await ctx.db.query.gameClients.findFirst({
        where: eq(gameClients.apiKey, ctx.headers.get("x-api-key") ?? ""),
        columns: { id: true },
      });

      // Partida amistosa: registra só o histórico.
      // Sem jogadores, fica fora dos rankings.
      // Uma amistosa nunca encerra a partida oficial que um admin
      // tenha iniciado enquanto ela estava em andamento.
      if (!pendingMatch || input.isRanked === false) {
        const [friendlyMatch] = await ctx.db
          .insert(matches)
          .values({
            blueScore: input.blueScore,
            pinkScore: input.pinkScore,
            durationInSeconds: input.durationSeconds,
            endedByGameClientId: gameClient?.id,
            status: "COMPLETED",
          })
          .returning({ id: matches.id });

        revalidateTag(LATEST_MATCHES_TAG);

        return {
          success: true,
          matchId: friendlyMatch!.id,
          message: "Partida amistosa registrada com sucesso.",
        };
      }

      if (!pendingMatch.bluePlayerId || !pendingMatch.pinkPlayerId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "A partida pendente está corrompida e não possui os IDs dos jogadores.",
        });
      }

      const playerIdMap = {
        BLUE: pendingMatch.bluePlayerId,
        PINK: pendingMatch.pinkPlayerId,
      } as const;

      const itemsToInsert = input.collectedItems.map((item) => ({
        matchId: pendingMatch.id,
        itemId: item.itemId,
        depositedByPlayerId: playerIdMap[item.depositedBy],
        depositedAtPlayerId: playerIdMap[item.depositedAt],
      }));

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(matches)
          .set({
            blueScore: input.blueScore,
            pinkScore: input.pinkScore,
            durationInSeconds: input.durationSeconds,
            endedByGameClientId: gameClient?.id,
            status: "COMPLETED",
          })
          .where(eq(matches.id, pendingMatch.id));

        if (itemsToInsert.length > 0)
          await tx.insert(matchCollectedItems).values(itemsToInsert);
      });

      revalidateTag(LATEST_MATCHES_TAG);

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

  hasOpenMatch: publicProcedure.query(async ({ ctx }) => {
    const pendingMatch = await ctx.db.query.matches.findFirst({
      where: eq(matches.status, "PENDING"),
      columns: { id: true },
    });

    return !!pendingMatch;
  }),

  isRankedMatch: gameClientProcedure.query(async ({ ctx }) => {
    const pendingMatch = await ctx.db.query.matches.findFirst({
      where: eq(matches.status, "PENDING"),
      with: {
        bluePlayer: { columns: { name: true } },
        pinkPlayer: { columns: { name: true } },
      },
      columns: {},
    });

    if (!pendingMatch) {
      return {
        success: true,
        isRanked: false,
        message: "Nenhuma partida oficial encontrada.",
      };
    }

    const bluePlayerName = getFirstName(
      pendingMatch.bluePlayer?.name ?? "Azul",
    );
    const pinkPlayerName = getFirstName(
      pendingMatch.pinkPlayer?.name ?? "Rosa",
    );

    return {
      success: true,
      isRanked: true,
      message: `Partida oficial em andamento entre ${bluePlayerName} (Azul) e ${pinkPlayerName} (Rosa).`,
      bluePlayerName,
      pinkPlayerName,
    };
  }),

  latest: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      const getLatestMatches = unstable_cache(
        (limit: number) =>
          ctx.db.query.matches.findMany({
            where: eq(matches.status, "COMPLETED"),
            // Partidas oficiais são criadas ao iniciar e atualizadas ao encerrar;
            // amistosas são criadas já encerradas.
            orderBy: ({ updatedAt, createdAt }) =>
              desc(sql`coalesce(${updatedAt}, ${createdAt})`),
            limit,
            columns: {
              id: true,
              bluePlayerId: true,
              pinkPlayerId: true,
              blueScore: true,
              pinkScore: true,
              durationInSeconds: true,
              createdAt: true,
              updatedAt: true,
            },
            with: {
              bluePlayer: { columns: { name: true } },
              pinkPlayer: { columns: { name: true } },
            },
          }),
        [LATEST_MATCHES_TAG],
        { tags: [LATEST_MATCHES_TAG] },
      );
      const latestMatches = await getLatestMatches(input.limit);

      return latestMatches.map((match) => ({
        matchId: match.id,
        isRanked: match.bluePlayerId !== null,
        bluePlayerId: match.bluePlayerId,
        bluePlayerName: match.bluePlayer?.name ?? "Azul",
        blueScore: match.blueScore,
        pinkPlayerId: match.pinkPlayerId,
        pinkPlayerName: match.pinkPlayer?.name ?? "Rosa",
        pinkScore: match.pinkScore,
        durationInSeconds: match.durationInSeconds,
        endedAt: new Date(match.updatedAt ?? match.createdAt),
      }));
    }),

  getPendingMatch: adminProcedure.query(async ({ ctx }) => {
    const pendingMatch = await ctx.db.query.matches.findFirst({
      where: eq(matches.status, "PENDING"),
      columns: {
        id: true,
        bluePlayerId: true,
        pinkPlayerId: true,
        startedByAdminId: true,
        createdAt: true,
      },
      with: {
        bluePlayer: { columns: { name: true } },
        pinkPlayer: { columns: { name: true } },
        startedByAdmin: { columns: { name: true } },
      },
    });

    return pendingMatch;
  }),

  cancel: adminProcedure.mutation(async ({ ctx }) => {
    const pendingMatch = await ctx.db.query.matches.findFirst({
      where: eq(matches.status, "PENDING"),
      columns: { id: true },
    });

    if (!pendingMatch)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Nenhuma partida em aberto para cancelar.",
      });

    await ctx.db.delete(matches).where(eq(matches.id, pendingMatch.id));

    return { success: true, message: "A partida em aberto foi cancelada." };
  }),
});
