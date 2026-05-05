export function clamp(value: number, min = 0, max = 100) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function formatCompact(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function scoreTone(score: number, inverse = false) {
  const normalized = inverse ? 100 - score : score;
  if (normalized >= 75) return "success";
  if (normalized >= 50) return "cyan";
  if (normalized >= 30) return "warning";
  return "danger";
}
