import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Stat } from "../leaderboard/stats";

interface Props {
  biggestWinMargin: number;
  highestIndividualScore: number;
}

export function ProfileRecords(props: Props) {
  const { biggestWinMargin, highestIndividualScore } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recordes Pessoais</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-2">
        <Stat
          label="Maior Margem"
          value={
            <p className="text-xl font-bold">
              {biggestWinMargin.toLocaleString("pt-BR")}
            </p>
          }
        />
        <Stat
          label="Maior Pontuação"
          value={
            <p className="text-xl font-bold">
              {highestIndividualScore.toLocaleString("pt-BR")}
            </p>
          }
        />
      </CardContent>
    </Card>
  );
}
