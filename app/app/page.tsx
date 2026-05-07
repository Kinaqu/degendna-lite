import { DegenFlow } from "@/components/flow/DegenFlow";

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ wallet?: string }>;
}) {
  const params = await searchParams;
  return <DegenFlow initialWalletAddress={params.wallet} />;
}
