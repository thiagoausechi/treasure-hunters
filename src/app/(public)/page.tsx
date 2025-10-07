import NextLink from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DEFAULT_LEADERBOARD_PATH } from "~/lib/navigation";

export default function PublicIndexPage() {
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
          <Button variant="ghost" disabled>
            Área Administrativa
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
