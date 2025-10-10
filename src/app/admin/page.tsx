import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { auth } from "~/server/auth";

export default async function AdminMainPage() {
  const session = await auth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Painel Administrativo</CardTitle>
        <CardDescription>Loggado como {session?.user?.name}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          <Button disabled>Gerenciar Partida</Button>
          <Button disabled>Cadastrar Jogador</Button>
          <Button disabled>Cadastrar Administrador</Button>
        </div>
      </CardContent>
    </Card>
  );
}
