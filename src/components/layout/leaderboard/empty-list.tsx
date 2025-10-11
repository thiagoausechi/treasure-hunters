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
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function EmptyList({
  title = "A lista está vazia!",
  description = "Parece que não há dados para exibir nesta categoria.",
  actions = (
    <NextLink href="/">
      <Button>Voltar para o início</Button>
    </NextLink>
  ),
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{description}</CardContent>

      {!!actions && <CardFooter>{actions}</CardFooter>}
    </Card>
  );
}
