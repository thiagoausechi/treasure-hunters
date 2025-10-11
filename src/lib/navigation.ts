import type { Route } from "next";

export type Subcategory = {
  slug: string;
  label: string;
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
      },
      {
        slug: "by-win-rate",
        label: "Win Rate",
      },
      {
        slug: "by-score-diff",
        label: "Saldo",
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
      },
      {
        slug: "relevance",
        label: "Relevância",
      },
      {
        slug: "closest",
        label: "Acirradas",
      },
      {
        slug: "highest-score",
        label: "Pontuação",
      },
      {
        slug: "clash-of-titans",
        label: "Duelo de Titãs",
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
