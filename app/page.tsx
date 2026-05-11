import { Account } from "@/components/Account";
import { Disclaimer } from "@/components/Disclaimer";
import { Forms } from "@/components/Forms";
import { Navigation } from "@/components/Navigation";
import { Queries } from "@/components/Queries";

/** RSC shell. Each client leaf is opted in via "use client" in its own file. */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-8 md:px-6">
      <Navigation />
      <Disclaimer />
      <Account />
      <Forms />
      <Queries />
    </main>
  );
}
