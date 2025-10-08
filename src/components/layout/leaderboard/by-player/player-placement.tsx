import NextLink from "next/link";
import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { GameIcon } from "~/components/ui/game-icon";
import { cn } from "~/lib/utils";
import { Stat, type StatProps } from "../stats";

export interface PlayerPlacementProps {
  playerId: string;
  playerName: ReactNode;
  badge?: ReactNode;
  rank: number | null;
  stats: Array<StatProps>;
}

export function PlayerPlacement(props: PlayerPlacementProps) {
  const { playerId, playerName, badge, rank, stats } = props;

  return (
    <Card
      className={cn("border-l-muted-foreground border-l-8", {
        "border-l-golden shadow-golden": rank === 1,
        "border-l-silver shadow-silver": rank === 2,
        "border-l-bronze shadow-bronze": rank === 3,
      })}
    >
      <CardHeader>
        <CardTitle>
          <Rank rank={rank ?? 0} />
        </CardTitle>
        <CardAction>
          <div className="flex flex-col justify-end">
            <NextLink href={`/profile/${playerId}`}>
              <h3
                className={cn("muted-foreground text-right font-bold", {
                  "text-golden-foreground": rank === 1,
                  "text-silver-foreground": rank === 2,
                  "text-bronze-foreground": rank === 3,
                })}
              >
                {playerName}
              </h3>
            </NextLink>
            {badge}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-2 text-center"
          style={{
            gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          }}
        >
          {stats.map((stat, index) => (
            <Stat key={index} {...stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Rank({ rank }: { rank: number }) {
  switch (rank) {
    case 1:
      return <GameIcon name="GoldenClover" size={32 * 1.75} />;
    case 2:
      return <GameIcon name="SilverChalice" size={32 * 1.5} />;
    case 3:
      return <GameIcon name="BronzeChalice" />;
    default:
      return (
        <span className="text-muted-foreground font-serif text-2xl">
          #{rank}
        </span>
      );
  }
}
