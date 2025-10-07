import { notFound } from "next/navigation";
import { findContentBySlugs, LEADERBOARD_NAV_DATA } from "~/lib/navigation";

type LeaderboardPageProps = {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
};

export async function generateStaticParams() {
  return LEADERBOARD_NAV_DATA.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      category: category.slug,
      subcategory: subcategory.slug,
    })),
  );
}

export default async function LeaderboardPage({
  params,
}: LeaderboardPageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const subcategory = findContentBySlugs(categorySlug, subcategorySlug);

  if (!subcategory?.component) return notFound();

  return <subcategory.component />;
}
