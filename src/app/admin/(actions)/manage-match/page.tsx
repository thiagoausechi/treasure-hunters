"use client";

import {
  CancelMatchAction,
  StartMatchAction,
} from "~/components/layout/admin/actions/manage-match";
import { api } from "~/trpc/react";

export default function ManageMatchPage() {
  const [hasOpenMatch] = api.gameMatch.hasOpenMatch.useSuspenseQuery();

  return hasOpenMatch ? <CancelMatchAction /> : <StartMatchAction />;
}
