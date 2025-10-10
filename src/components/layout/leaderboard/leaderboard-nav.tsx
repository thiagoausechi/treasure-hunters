"use client";

import type { Route } from "next";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { LEADERBOARD_BASE_PATH, LEADERBOARD_NAV_DATA } from "~/lib/navigation";
import { cn } from "~/lib/utils";

interface NavItemProps {
  pathname: string;
  activeCategory: string;
}

export function LeaderboardNav() {
  const pathname = usePathname();

  const activeCategory =
    pathname.split("/")[2] ?? LEADERBOARD_NAV_DATA[0]!.slug;

  return (
    <nav className="container mx-auto flex flex-col gap-4 py-4">
      <SubcategoriesNav pathname={pathname} activeCategory={activeCategory} />
      <CategoriesNav pathname={pathname} activeCategory={activeCategory} />
    </nav>
  );
}

function CategoriesNav({ activeCategory }: NavItemProps) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {LEADERBOARD_NAV_DATA.map(({ slug, label, subcategories }) => {
        const fullPath =
          `${LEADERBOARD_BASE_PATH}/${slug}/${subcategories[0]!.slug}` as Route;

        return (
          <NextLink
            key={fullPath}
            href={fullPath}
            className={cn(
              buttonVariants({
                variant: activeCategory === slug ? "secondary" : "default",
              }),
              "font-serif",
            )}
          >
            {label}
          </NextLink>
        );
      })}
    </ul>
  );
}

function SubcategoriesNav({ activeCategory, pathname }: NavItemProps) {
  const subcategories = LEADERBOARD_NAV_DATA.find(
    ({ slug }) => slug === activeCategory,
  )?.subcategories;

  return (
    <ul className="grid grid-cols-3 gap-2">
      {subcategories?.map(({ slug, label }) => {
        const fullPath =
          `${LEADERBOARD_BASE_PATH}/${activeCategory}/${slug}` as Route;

        const isActive = pathname === fullPath;

        return (
          <NextLink
            key={fullPath}
            href={fullPath}
            className={cn(
              buttonVariants({
                variant: isActive ? "secondary" : "default",
                size: "sm",
              }),
              { "font-bold": isActive },
              "text-xs",
            )}
          >
            {label}
          </NextLink>
        );
      })}
    </ul>
  );
}
