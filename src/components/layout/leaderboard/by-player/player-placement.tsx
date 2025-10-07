import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Stat, type StatProps } from "../stats";

export interface PlayerPlacementProps {
  playerName: string | null;
  rank: number | null;
  stats: Array<StatProps>;
}

export function PlayerPlacement(props: PlayerPlacementProps) {
  const { playerName, rank, stats } = props;

  return (
    <Card
      className={cn("border-l-8", {
        "border-l-yellow-500 shadow-yellow-500": rank === 1,
        "border-l-gray-400 shadow-gray-400": rank === 2,
        "border-l-yellow-800 shadow-yellow-800": rank === 3,
        "border-l-muted-foreground": rank && rank > 3,
      })}
    >
      <CardHeader>
        <CardTitle>
          <Rank rank={rank ?? 0} />
        </CardTitle>
        <CardAction>
          <h3 className="text-primary font-bold">{playerName}</h3>
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
    case 1: // TODO: Add Golden Clover icon
      return (
        <span className="font-serif text-2xl text-yellow-500">#{rank}</span>
      );
    case 2: // TODO: Add Silver Chalice icon
      return <span className="font-serif text-2xl text-gray-400">#{rank}</span>;
    case 3: // TODO: Add Bronze Chalice icon
      return (
        <span className="font-serif text-2xl text-yellow-800">#{rank}</span>
      );
    default:
      return (
        <span className="text-muted-foreground font-serif text-2xl">
          #{rank}
        </span>
      );
  }
}
