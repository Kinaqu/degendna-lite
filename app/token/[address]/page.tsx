import { DegenFlow } from "@/components/flow/DegenFlow";

export default async function TokenPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return <DegenFlow focus="token" initialTokenAddress={address} />;
}
