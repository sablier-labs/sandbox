import { Account } from "@/components/Account";
import { Disclaimer } from "@/components/Disclaimer";
import { Forms } from "@/components/Forms";
import { Navigation } from "@/components/Navigation";
import { Queries } from "@/components/Queries";

/** RSC shell. Each client leaf is opted in via "use client" in its own file. */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
      <Navigation />
      <Disclaimer />
      <Account />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Forms />
        <Queries />
      </div>
    </main>
  );
}
