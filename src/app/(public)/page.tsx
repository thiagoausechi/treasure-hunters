import NextLink from "next/link";
import React from "react";
import { AdminLoginDialog } from "~/components/layout/admin/login-dialog";
import {
  HowToPlayCard,
  TreasureValuesCard,
} from "~/components/layout/public/landing-page";
import { Button } from "~/components/ui/button";
import { GameIcon } from "~/components/ui/game-icon";
import { DEFAULT_LEADERBOARD_PATH } from "~/lib/navigation";
import { auth } from "~/server/auth";

export default async function PublicIndexPage() {
  const session = await auth();

  return (
    <React.Fragment>
      <main className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        <h2 className="text-card text-center font-serif font-bold text-shadow-black text-shadow-md">
          A caçada pela fortuna começou!
        </h2>

        <HowToPlayCard />
        <TreasureValuesCard />
      </main>

      <footer className="grid shrink-0">
        <nav className="grid grid-cols-2 gap-4 py-4">
          <NextLink href={DEFAULT_LEADERBOARD_PATH} className="w-full">
            <Button variant="secondary" className="w-full">
              <GameIcon name="GoldenChalice" />
              Leaderboard
            </Button>
          </NextLink>

          {session?.user ? (
            <NextLink href={"/admin"}>
              <Button className="w-full">Área Administrativa</Button>
            </NextLink>
          ) : (
            <AdminLoginDialog />
          )}
        </nav>
      </footer>
    </React.Fragment>
  );
}
