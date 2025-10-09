import { asc } from "drizzle-orm";
import { players } from "~/server/db/schema";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const playerRouter = createTRPCRouter({
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
