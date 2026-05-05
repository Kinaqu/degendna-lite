import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-4xl font-bold">Build your meme radar in under a minute.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          DegenDNA Lite is behavioral and market analysis, not financial advice.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/app">
              Open My Radar <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
