"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { InputSelect, InputSelectTrigger } from "~/components/ui/input-select";
import { api } from "~/trpc/react";

export function StartMatchAction() {
  const router = useRouter();
  const [bluePlayerId, setBluePlayerId] = useState<string | undefined>();
  const [pinkPlayerId, setPinkPlayerId] = useState<string | undefined>();
  const { data: allPlayers, isLoading } = api.player.list.useQuery();
  const startMatchMutation = api.gameMatch.start.useMutation({
    onSuccess: () => router.push("/admin"),
    onError: (error) => {
      alert(`Erro ao iniciar partida: ${error.message}`);
    },
  });

  const bluePlayerOptions = useMemo(() => {
    if (!allPlayers) return [];

    return allPlayers
      .filter((player) => player.id !== pinkPlayerId)
      .map((player) => ({
        value: player.id,
        label: player.name ?? "Sem nome",
      }));
  }, [allPlayers, pinkPlayerId]);

  const pinkPlayerOptions = useMemo(() => {
    if (!allPlayers) return [];

    return allPlayers
      .filter((player) => player.id !== bluePlayerId)
      .map((player) => ({
        value: player.id,
        label: player.name ?? "Sem nome",
      }));
  }, [allPlayers, bluePlayerId]);

  const bothPlayersSelected = bluePlayerId && pinkPlayerId;
  const canStart = bothPlayersSelected && !isLoading;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (canStart) startMatchMutation.mutate({ bluePlayerId, pinkPlayerId });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Partida</CardTitle>
        <CardDescription>
          Selecione os dois jogadores que irão competir. Eles já devem{" "}
          <strong>estar cadastrados</strong>.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <GameIcon name="BluePlayer" />
          <InputSelect
            clearable
            placeholder="Selecione o jogador azul"
            options={bluePlayerOptions}
            value={bluePlayerId}
            onValueChange={(v) => setBluePlayerId(v)}
            disabled={isLoading}
          >
            {(provided) => (
              <InputSelectTrigger
                {...provided}
                className="additional-styling"
              />
            )}
          </InputSelect>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <GameIcon name="PinkPlayer" />
          <InputSelect
            clearable
            placeholder="Selecione o jogador rosa"
            options={pinkPlayerOptions}
            value={pinkPlayerId}
            onValueChange={(v) => setPinkPlayerId(v)}
            disabled={isLoading}
          >
            {(provided) => (
              <InputSelectTrigger
                {...provided}
                className="additional-styling"
              />
            )}
          </InputSelect>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" disabled={!canStart} onClick={handleSubmit}>
          {isLoading
            ? bothPlayersSelected
              ? "Iniciando..."
              : "Carregando..."
            : "Iniciar Partida"}
        </Button>
      </CardFooter>
    </Card>
  );
}
