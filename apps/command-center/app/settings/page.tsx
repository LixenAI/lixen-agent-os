import { PACKAGES } from "@/lib/packages";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Settings
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(["starter", "plus"] as const).map((tier) => {
          const pkg = PACKAGES[tier];
          return (
            <div key={tier} className="panel p-4">
              <p className="text-2xs uppercase tracking-wide text-muted">
                {pkg.shortLabel} Package
              </p>
              <h3 className="mt-1 text-lg font-bold">{pkg.name}</h3>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-muted">
                <li>{pkg.setupMinimum}</li>
                <li>{pkg.opensAt}</li>
                <li>{pkg.monthly}</li>
                {pkg.term ? <li>{pkg.term}</li> : null}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="panel p-4 text-sm text-muted">
        <h3 className="th px-0">Source of Truth</h3>
        <p className="mt-1">
          Canonical benchmark drives all status labels. Execution progress is
          tracked separately from canonical source status.
        </p>
      </div>
    </div>
  );
}
