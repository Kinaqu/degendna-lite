import { DegenFlow } from "@/components/flow/DegenFlow";

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  const params = await searchParams;
  return <DegenFlow initialDemo={params.demo === "1"} />;
}
