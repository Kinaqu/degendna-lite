import { Badge } from "@/components/ui/badge";
import { scoreTone } from "@/lib/utils/numbers";

export function ScoreBadge({ score, inverse = false }: { score: number; inverse?: boolean }) {
  return <Badge tone={scoreTone(score, inverse)}>{Math.round(score)}</Badge>;
}
