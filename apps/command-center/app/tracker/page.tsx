import { LaunchTracker } from "@/components/playbook/LaunchTracker";
import { getCommandCenterState } from "@/lib/data";

export default function TrackerPage() {
  const { tracker } = getCommandCenterState();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Launch Tracker
      </h2>
      <div className="max-w-3xl">
        <LaunchTracker tracker={tracker} />
      </div>
    </div>
  );
}
