import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function LeaderboardLoadingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carregando...</CardTitle>
      </CardHeader>
      <CardContent>
        O conteúdo está sendo carregado, por favor aguarde.
      </CardContent>
    </Card>
  );
}
