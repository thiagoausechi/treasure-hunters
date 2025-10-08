const tierConfig = {
  0: { label: "Sem Classificação", rankDescription: "?" },
  1: { label: "Lenda", rankDescription: "Top 20%" },
  2: { label: "Caçador de Relíquias", rankDescription: "60-80%" },
  3: { label: "Equilibrado", rankDescription: "40-60%" },
  4: { label: "Explorador", rankDescription: "20-40%" },
  5: { label: "Aspirante", rankDescription: "< 20%" },
} as const;

interface Args {
  tier: number | null;
  scoreDifference: number | null;
}

export function getByPerformanceTier({ tier, scoreDifference }: Args) {
  if (scoreDifference === 0) return tierConfig[3];

  const index: keyof typeof tierConfig = (tier as keyof typeof tierConfig) ?? 0;

  return tierConfig[index];
}
