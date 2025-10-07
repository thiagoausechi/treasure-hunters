import NextLink from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function LeaderboardNotFoundPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteúdo não encontrado</CardTitle>
      </CardHeader>
      <CardContent>
        A página que você está tentando acessar não existe ou foi removida.
      </CardContent>
      <CardFooter>
        <NextLink href="/">
          <Button>Voltar para o início</Button>
        </NextLink>
      </CardFooter>
    </Card>
  );
}
