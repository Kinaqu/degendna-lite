import { Card, CardContent } from "@/components/ui/card";

export function RadarEmptyState() {
  return (
    <Card>
      <CardContent className="p-8 text-center text-muted-foreground">
        No radar tokens loaded yet. Run wallet analysis or try demo mode.
      </CardContent>
    </Card>
  );
}
