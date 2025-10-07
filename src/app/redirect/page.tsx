import { redirect } from "next/navigation";
import { DEFAULT_LEADERBOARD_PATH } from "~/lib/navigation";

interface RedirectPageProps {
  searchParams: {
    to?: string;
  };
}

export function RedirectPage(props: RedirectPageProps) {
  switch (props.searchParams.to) {
    case "feira-profissoes-fema":
      return redirect(DEFAULT_LEADERBOARD_PATH);
    default:
      return redirect("/");
  }
}
