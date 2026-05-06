import { Card, CardContent } from "@/components/ui/card";

export function RadarEmptyState() {
  return (
    <Card>
      <CardContent className="p-8 text-center text-muted-foreground">
        No real Birdeye radar tokens loaded yet. Run wallet analysis or retry after rate limits clear.
      </CardContent>
    </Card>
  );
}
