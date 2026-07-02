// Approved LixenAI customer-facing package naming.
// IMPORTANT: never expose internal "Smart" / "Pro" labels in the UI.
// "Smart" -> "Local Automation Starter" (Starter)
// "Pro"   -> "AI Growth System" (Plus)

export type PackageTier = "starter" | "plus";

export interface PackageInfo {
  tier: PackageTier;
  /** Short customer-facing toggle label. */
  shortLabel: string;
  /** Full customer-facing plan name. */
  name: string;
  setupMinimum: string;
  opensAt: string;
  monthly: string;
  term?: string;
}

export const PACKAGES: Record<PackageTier, PackageInfo> = {
  starter: {
    tier: "starter",
    shortLabel: "Starter",
    name: "Local Automation Starter",
    setupMinimum: "$1,000 setup minimum",
    opensAt: "opens at $3,000",
    monthly: "$197/month",
    term: "minimum 6-month term",
  },
  plus: {
    tier: "plus",
    shortLabel: "Plus",
    name: "AI Growth System",
    setupMinimum: "$1,999 setup minimum",
    opensAt: "opens at $4,000",
    monthly: "$497/month",
  },
};

/**
 * Corrected upgrade sentence. The reference screenshot showed the deprecated
 * internal phrasing ("Smart is active; Pro is what we turn on when upgrading").
 * Customer-facing copy must use approved package names only.
 */
export function upgradeSentence(active: PackageTier): string {
  if (active === "starter") {
    return `${PACKAGES.starter.name} is active; ${PACKAGES.plus.name} is what we turn on when upgrading.`;
  }
  return `${PACKAGES.plus.name} is active; you're on our most complete plan.`;
}