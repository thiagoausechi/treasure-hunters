import type { Route } from "next";
import type { ComponentType } from "react";
import { LeaderboardPlayerByWins } from "~/components/layout/leaderboard/by-player/by-wins";

export type Subcategory = {
  slug: string;
  label: string;
  component: ComponentType | null;
};

export type Category = {
  slug: string;
  label: string;
  subcategories: Subcategory[];
};

export const LEADERBOARD_NAV_DATA: Category[] = [
  {
    slug: "players",
    label: "Jogadores",
    subcategories: [
      {
        slug: "by-wins",
        label: "Vitórias",
        component: LeaderboardPlayerByWins,
      },
      {
        slug: "by-win-rate",
        label: "Win Rate",
        component: null,
      },
      {
        slug: "by-score-diff",
        label: "Saldo",
        component: null,
      },
    ],
  },
  {
    slug: "matches",
    label: "Partidas",
    subcategories: [
      {
        slug: "recent",
        label: "Recentes",
        component: null,
      },
      {
        slug: "relevance",
        label: "Relevância",
        component: null,
      },
      {
        slug: "closest",
        label: "Acirradas",
        component: null,
      },
      {
        slug: "highest-score",
        label: "Maior Pontuação",
        component: null,
      },
      {
        slug: "clash-of-titans",
        label: "Duelo de Titãs",
        component: null,
      },
    ],
  },
] as const;

export const LEADERBOARD_BASE_PATH = "/leaderboard";

export const DEFAULT_LEADERBOARD_PATH = [
  LEADERBOARD_BASE_PATH,
  LEADERBOARD_NAV_DATA[0]!.slug,
  LEADERBOARD_NAV_DATA[0]!.subcategories[0]!.slug,
].join("/") as Route;

export function findContentBySlugs(
  categorySlug: string,
  subcategorySlug: string,
) {
  const category = LEADERBOARD_NAV_DATA.find(
    ({ slug }) => slug === categorySlug,
  );
  const subcategory = category?.subcategories.find(
    ({ slug }) => slug === subcategorySlug,
  );

  return subcategory;
}
