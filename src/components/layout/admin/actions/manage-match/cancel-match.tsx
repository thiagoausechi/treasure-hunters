"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { GameIcon } from "~/components/ui/game-icon";
import { formatTimeAgo } from "~/lib/utils";
import { api } from "~/trpc/react";

export function CancelMatchAction() {
  const router = useRouter();
  const [openMatch] = api.gameMatch.getPendingMatch.useSuspenseQuery();
  const cancelMatchMutation = api.gameMatch.cancel.useMutation({
    onSuccess: () => router.push("/admin"),
    onError: (error) => {
      alert(`Erro ao cancelar partida: ${error.message}`);
    },
  });

  if (!openMatch) {
    router.push("/admin");
    return null;
  }

  const startedAt = formatTimeAgo(openMatch.createdAt);
  const startedBy = openMatch?.startedByAdmin?.name
    ? `Iniciada por ${openMatch.startedByAdmin.name}`
    : "Sem informações de quem iniciou";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partida em Andamento</CardTitle>
        <CardDescription>
          <p>
            Existe uma partida pendente. Por favor, aguarde ela finalizar antes
            de iniciar uma nova. As partidas são{" "}
            <strong>encerradas automaticamente</strong> após os jogadores
            encherem ambas as casas de tesouro.
          </p>
          <br />
          Caso necessário, você pode cancelar a partida atual.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="bg-muted flex flex-col items-center justify-center rounded-xl p-2">
          <div className="grid w-full grid-cols-1 gap-2 font-normal sm:grid-cols-[1fr_auto_1fr] sm:gap-0">
            {/* Blue Player */}
            <div className="flex items-center gap-2 text-left">
              <GameIcon name="BluePlayer" />
              <NextLink
                href={`/profile/${openMatch.bluePlayerId}`}
                prefetch={false}
              >
                <h2 className="font-bold">{openMatch.bluePlayer?.name}</h2>
              </NextLink>
            </div>

            {/* Versus */}
            <span className="text-secondary text-center font-serif">vs</span>

            {/* Pink Player */}
            <div className="flex items-center justify-end gap-2 text-right">
              <NextLink
                href={`/profile/${openMatch.pinkPlayerId}`}
                prefetch={false}
              >
                <h2 className="font-bold">{openMatch.pinkPlayer?.name}</h2>
              </NextLink>
              <GameIcon name="PinkPlayer" />
            </div>
          </div>

          <span className="text-muted-foreground mt-1 text-xs">
            {startedBy}
          </span>
          <span className="text-muted-foreground text-xs">{startedAt}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <p className="text-xs">
          <strong className="text-destructive">Cuidado!</strong> A partida será
          cancelada imediatamente após clicar no botão abaixo.
        </p>
        <Button
          className="w-full"
          variant="destructive"
          onClick={() => cancelMatchMutation.mutate()}
        >
          Cancelar Partida
        </Button>
      </CardFooter>
    </Card>
  );
}
