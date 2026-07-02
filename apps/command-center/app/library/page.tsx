import { AssetLibrary } from "@/components/playbook/AssetLibrary";
import { getCommandCenterState } from "@/lib/data";

export default function LibraryPage() {
  const { assets } = getCommandCenterState();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Asset Library
      </h2>
      <div className="max-w-md">
        <AssetLibrary assets={assets} />
      </div>
    </div>
  );
}
