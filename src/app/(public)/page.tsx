import NextLink from "next/link";
import { AdminLoginDialog } from "~/components/layout/admin/login-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DEFAULT_LEADERBOARD_PATH } from "~/lib/navigation";
import { auth } from "~/server/auth";

export default async function PublicIndexPage() {
  const session = await auth();

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Card>
        <CardHeader>
          <CardTitle>Selecione para onde desejar seguir</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <NextLink href={DEFAULT_LEADERBOARD_PATH}>
            <Button>Leaderboard</Button>
          </NextLink>
          {session?.user ? (
            <Button variant="ghost">
              <NextLink href={"/admin"}>Área Administrativa</NextLink>
            </Button>
          ) : (
            <AdminLoginDialog />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
