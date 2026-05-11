import { TriangleAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-md border-2 border-orange/40 bg-orange/5 p-4 text-sm">
      <TriangleAlert className="size-5 shrink-0 text-orange" />
      <p className="text-mist-200">
        This sandbox targets <strong className="font-bold text-white">Sablier Lockup v4.0</strong>{" "}
        on Sepolia. Connect with MetaMask, mint or hold test DAI, and use the tabs below to create
        and query streams.
      </p>
    </div>
  );
}
