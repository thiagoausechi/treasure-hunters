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

interface Props {
  error: Error;
}

export default function LeaderboardErrorPage({ error }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ops, algo deu errado!</CardTitle>
      </CardHeader>
      <CardContent>{error.message}</CardContent>
      <CardFooter>
        <NextLink href="/">
          <Button>Voltar para o início</Button>
        </NextLink>
      </CardFooter>
    </Card>
  );
}
