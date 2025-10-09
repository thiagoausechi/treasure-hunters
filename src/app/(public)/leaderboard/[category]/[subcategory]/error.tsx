"use client";

import NextLink from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { EmptyListError } from "~/errors";

interface Props {
  error: Error;
}

export default function LeaderboardErrorPage({ error }: Props) {
  let title = "Ops, algo deu errado!";
  let description = "Ocorreu um erro inesperado.";

  switch (error.constructor) {
    case EmptyListError:
      title = "A lista está vazia!";
      description = "Parece que não há dados para exibir nesta categoria.";
      break;
    default:
      description = error.message;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter>
        <NextLink href="/">
          <Button>Voltar para o início</Button>
        </NextLink>
      </CardFooter>
    </Card>
  );
}
