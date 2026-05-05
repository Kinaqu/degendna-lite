import Link from "next/link";
import { PublicProfileCard } from "@/components/profile/PublicProfileCard";
import { Button } from "@/components/ui/button";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ wallet: string }>;
}) {
  const { wallet } = await params;
  return (
    <main className="terminal-grid min-h-screen px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold">
            DegenDNA <span className="text-secondary">Lite</span>
          </Link>
          <Button asChild variant="outline"><Link href="/app">Open radar</Link></Button>
        </header>
        <PublicProfileCard wallet={wallet} />
      </div>
    </main>
  );
}
