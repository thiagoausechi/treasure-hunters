"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

export default function RegisterPlayerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const registerPlayerMutation = api.player.register.useMutation({
    onSuccess: () => router.push("/admin"),
    onError: (error) => setError(error.message),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const description = formData.get("description") as string;

    registerPlayerMutation.mutate({ name, email, description });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Jogador</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" type="text" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Ex.: Aluno da ETEC de São Paulo"
              />
              <p className="text-muted-foreground text-sm">
                Descreva se é aluno, professor ou visitante, de qual
                escola/universidade e de qual cidade vem.
              </p>
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit">Cadastrar</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
