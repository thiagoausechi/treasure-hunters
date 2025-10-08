import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { GameIcon } from "~/components/ui/game-icon";
import { Progress } from "~/components/ui/progress";
import { cn, formatPlural } from "~/lib/utils";
import { Stat } from "../leaderboard/stats";

interface Props {
  blue: {
    total: number;
    wins: number;
  };
  pink: {
    total: number;
    wins: number;
  };
}

export function ProfileSidePreference(props: Props) {
  const {
    blue: { total: blueTotal, wins: blueWins },
    pink: { total: pinkTotal, wins: pinkWins },
  } = props;

  const totalMatches = blueTotal + pinkTotal;
  const bluePercentage = blueTotal / totalMatches;
  const pinkPercentage = pinkTotal / totalMatches;

  const blueWinRate = blueTotal > 0 ? blueWins / blueTotal : 0;
  const pinkWinRate = pinkTotal > 0 ? pinkWins / pinkTotal : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="grid grid-cols-2 font-normal">
          <div className="flex flex-col gap-2 text-left">
            <GameIcon name="BluePlayer" />
            <p>
              <span className="font-bold">{blueTotal} </span>
              {formatPlural({
                count: blueTotal,
                singular: "partida",
                plural: "partidas",
              })}
            </p>
            <p>
              <span className="font-bold">{blueWins} </span>
              {formatPlural({
                count: blueWins,
                singular: "vitória",
                plural: "vitórias",
              })}
            </p>
            <p className="text-muted-foreground text-xs">
              {(blueWinRate * 100).toFixed(2)}% WR
            </p>
          </div>

          <div className="flex flex-col items-end justify-end gap-2 text-right">
            <GameIcon name="PinkPlayer" />
            <p>
              <span className="font-bold">{pinkTotal} </span>
              {formatPlural({
                count: pinkTotal,
                singular: "partida",
                plural: "partidas",
              })}
            </p>
            <p>
              <span className="font-bold">{pinkWins} </span>
              {formatPlural({
                count: pinkWins,
                singular: "vitória",
                plural: "vitórias",
              })}
            </p>
            <p className="text-muted-foreground text-xs">
              {(pinkWinRate * 100).toFixed(2)}% WR
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <Stat
          label="Preferência de Lado"
          value={
            <p>
              <span
                className={cn({
                  "text-xl font-bold": bluePercentage >= pinkPercentage,
                })}
              >
                {(bluePercentage * 100).toFixed(2)}%
              </span>
              {" / "}
              <span
                className={cn({
                  "text-xl font-bold": pinkPercentage >= bluePercentage,
                })}
              >
                {(pinkPercentage * 100).toFixed(2)}%
              </span>
            </p>
          }
        />
        <Progress
          value={bluePercentage * 100}
          className="data-[slot=progress]:bg-pink-500"
        />
      </CardContent>
    </Card>
  );
}
