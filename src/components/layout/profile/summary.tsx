import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { GameIcon } from "~/components/ui/game-icon";
import { getByPerformanceTier } from "~/lib/performance-tier";
import { formatPlural } from "~/lib/utils";
import type { PlayerRanking } from "~/server/db/views";
import { Stat } from "../leaderboard/stats";
import { WinRate } from "../leaderboard/stats/player/win-rate";

type Props = PlayerRanking & {
  description: string | null;
};

export function ProfileSummary(props: Props) {
  const {
    playerName,
    description,
    performanceTier,
    scoreDifference,
    totalWins,
    totalLosses,
    totalDraws,
    totalMatches,
  } = props;

  const { label: performanceTierLabel, rankDescription } = getByPerformanceTier(
    {
      tier: performanceTier,
      scoreDifference: scoreDifference,
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-primary font-serif">{playerName}</h1>

          <p className="flex items-baseline gap-2">
            <span>{performanceTierLabel}</span>
            <span className="text-muted-foreground text-xs">
              ({rankDescription})
            </span>
          </p>

          {description && (
            <p className="text-muted-foreground mt-4 font-normal">
              {description}
            </p>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Stat
            label={formatPlural({
              count: totalWins,
              singular: "Vitória",
              plural: "Vitórias",
            })}
            value={
              <div className="flex items-center justify-center gap-2">
                <GameIcon name="GoldenChalice" />
                <p className="text-xl font-bold">{totalWins}</p>
              </div>
            }
          />
          <Stat
            label={formatPlural({
              count: totalDraws,
              singular: "Empate",
              plural: "Empates",
            })}
            value={
              <div className="flex items-center justify-between gap-2">
                <GameIcon name="SilverChalice" />
                <p className="text-xl font-bold">{totalDraws}</p>
              </div>
            }
          />
          <Stat
            label={formatPlural({
              count: totalLosses,
              singular: "Derrota",
              plural: "Derrotas",
            })}
            value={
              <div className="flex items-center justify-between gap-2">
                <GameIcon name="BronzeChalice" />
                <p className="text-xl font-bold">{totalLosses}</p>
              </div>
            }
          />
        </div>

        <p className="text-muted-foreground text-center">
          {totalMatches}{" "}
          {formatPlural({
            count: totalMatches,
            singular: "partida",
            plural: "partidas",
          })}
        </p>

        <Stat {...WinRate(props)} />
      </CardContent>
    </Card>
  );
}
