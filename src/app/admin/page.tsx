import NextLink from "next/link";
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
          <NextLink href={"/admin/manage-match"}>
            <Button className="w-full">Gerenciar Partida</Button>
          </NextLink>

          <NextLink href={"/admin/register-player"}>
            <Button className="w-full">Cadastrar Jogador</Button>
          </NextLink>
        </div>
      </CardContent>
    </Card>
  );
}
