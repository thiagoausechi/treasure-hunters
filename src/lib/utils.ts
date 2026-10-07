import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date) {
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (days > 0) {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } else if (hours > 0) {
    return `há ${hours}h`;
  } else if (minutes > 0) {
    return `há ${minutes} min`;
  } else {
    return `agora mesmo`;
  }
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  if (hours > 0) {
    const remainingMinutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${hours}h${remainingMinutes}m${remainingSeconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}m${remainingSeconds}s`;
}
export function formatPlural({
  count,
  singular,
  plural,
}: {
  count?: number | null;
  singular: string;
  plural: string;
}) {
  if (!count || count === 0) return plural;
  if (count === 1) return singular;
  return plural;
}
