import NextLink from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { formatPlural } from "~/lib/utils";
import { Stat } from "../leaderboard/stats";

interface Props {
  totalMatches?: number | null;
  frequentOpponent: {
    opponentId: string;
    opponentName: string | null;
    matchCount: number;
  } | null;
}

export function ProfileFrequentOpponent(props: Props) {
  if (!props.frequentOpponent) return null;

  const { opponentId, opponentName, matchCount } = props.frequentOpponent;

  const playedAgainstRate = props.totalMatches
    ? matchCount / props.totalMatches
    : 0;

  const playedAgainstDisplay = [
    "Jogou",
    matchCount,
    formatPlural({
      count: matchCount,
      singular: "vez",
      plural: "vezes",
    }),
    "contra",
    "",
  ].join(" ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adversário Mais Frequente</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p>
          {playedAgainstDisplay}
          <NextLink href={`/profile/${opponentId}`}>
            <strong>{opponentName}</strong>
          </NextLink>
        </p>

        <Stat
          label="Match Rate"
          value={
            <p>
              <span className="text-xl font-bold">{matchCount}</span>/
              <span>{props.totalMatches ?? "?"}</span>
            </p>
          }
        />

        <Progress value={playedAgainstRate * 100} />
      </CardContent>
    </Card>
  );
}
