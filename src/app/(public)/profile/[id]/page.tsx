"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import {
  ProfileFrequentOpponent,
  ProfileRecords,
  ProfileScoreBalance,
  ProfileSidePreference,
  ProfileSummary,
} from "~/components/layout/profile";
import { api } from "~/trpc/react";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  if (!id || id.length !== 36) return notFound();

  const [data] = api.profile.byId.useSuspenseQuery({ playerId: id });
  if (!data) throw new Error("Perfil não encontrado");

  const { mainStats, playerDescription, records, sideStats, frequentOpponent } =
    data;

  return (
    <div className="space-y-4">
      <ProfileSummary {...mainStats!} description={playerDescription} />
      <ProfileRecords {...records} />
      <ProfileScoreBalance {...mainStats!} />
      <ProfileSidePreference {...sideStats} />
      <ProfileFrequentOpponent
        frequentOpponent={frequentOpponent}
        totalMatches={mainStats?.totalMatches}
      />
    </div>
  );
}
