import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { PlayerRanking } from "~/server/db/views";
import { Stat } from "../leaderboard/stats";
import {
  ScoreDiff,
  ScoreDiffBalance,
} from "../leaderboard/stats/player/score-diff";

type Props = PlayerRanking;

export function ProfileScoreBalance(props: Props) {
  const {} = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balanço de Pontos</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 text-center">
        <Stat {...ScoreDiff(props)} />
        <Stat {...ScoreDiffBalance(props)} />
      </CardContent>
    </Card>
  );
}
