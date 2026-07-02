import { getCommandCenterState } from "@/lib/data";
import { AssetLibrary } from "./AssetLibrary";
import { LaunchTracker } from "./LaunchTracker";
import { PhasesCard } from "./PhasesCard";
import { TaskTable } from "./TaskTable";

export function PlaybookDashboard() {
  const { phases, items, tracker, assets } = getCommandCenterState();
  const activePhase = phases[0];
  const phaseItems = items.filter((i) => i.phaseId === activePhase.id);
  const phaseLabel = `${activePhase.index}. ${activePhase.name.toUpperCase()}`;

  return (
    <div className="flex h-full min-h-0 gap-4">
      <PhasesCard phases={phases} activePhaseId={activePhase.id} />
      <TaskTable phaseLabel={phaseLabel} items={phaseItems} />
      <div className="flex w-80 shrink-0 flex-col gap-4">
        <LaunchTracker tracker={tracker} />
        <AssetLibrary assets={assets} />
      </div>
    </div>
  );
}
