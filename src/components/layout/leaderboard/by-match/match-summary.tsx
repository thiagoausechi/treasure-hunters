import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { GameIcon } from "~/components/ui/game-icon";
import { PlayerSideProgress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";
import type { RelevanceScoreRanking } from "~/server/db/views";

type Props = Omit<RelevanceScoreRanking, "relevanceScore"> & {
  relevanceScore?: RelevanceScoreRanking["relevanceScore"];
  footer?: React.ReactNode;
};

export function MatchSummary(props: Props) {
  const { bluePlayerName, pinkPlayerName } = props;
  const blueScore = props.blueScore ?? 0;
  const pinkScore = props.pinkScore ?? 0;

  const isDraw = blueScore === pinkScore;
  const blueWins = blueScore > pinkScore;
  const pinkWins = pinkScore > blueScore;

  const progressValue = isDraw
    ? 50
    : (blueScore / (blueScore + pinkScore)) * 100;

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="grid grid-cols-1 gap-2 font-normal sm:grid-cols-[1fr_auto_1fr] sm:gap-0">
          {/* Blue Player */}
          <div className="flex gap-2 text-left">
            <GameIcon name="BluePlayer" />
            {blueWins && <GameIcon name="GoldenChalice" />}
            <div>
              <NextLink
                href={`/profile/${props.bluePlayerId}`}
                prefetch={false}
              >
                <h2 className="font-bold">{bluePlayerName}</h2>
              </NextLink>
              <div>{blueScore?.toLocaleString("pt-BR")}</div>
            </div>
          </div>

          {/* Versus / Draw */}
          <span
            className={cn(
              "text-center font-serif",
              isDraw ? "text-secondary" : "text-muted-foreground",
            )}
          >
            {isDraw ? "Empate" : "vs"}
          </span>

          {/* Pink Player */}
          <div className="flex justify-end gap-2 text-right">
            <div>
              <NextLink
                href={`/profile/${props.pinkPlayerId}`}
                prefetch={false}
              >
                <h2 className="font-bold">{pinkPlayerName}</h2>
              </NextLink>
              <div>{pinkScore?.toLocaleString("pt-BR")}</div>
            </div>
            {pinkWins && <GameIcon name="GoldenChalice" />}
            <GameIcon name="PinkPlayer" />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <PlayerSideProgress bluePercentage={progressValue} />
      </CardContent>

      {!!props.footer && (
        <CardFooter className="justify-center">{props.footer}</CardFooter>
      )}
    </Card>
  );
}
