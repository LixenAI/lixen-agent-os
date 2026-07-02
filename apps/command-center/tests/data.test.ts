import { describe, expect, it } from "vitest";
import { getCommandCenterState } from "../lib/data";

describe("command center seed data", () => {
  const state = getCommandCenterState();

  it("matches the reference KPI strip", () => {
    expect(state.checklist).toEqual({ percent: 70, completed: 140, total: 200 });
    expect(state.benchmark).toEqual({ baselineDate: "Apr 28, 2025", percent: 70 });
  });

  it("has the five playbook phases with reference completion", () => {
    expect(state.phases.map((p) => p.completion)).toEqual([90, 70, 45, 20, 0]);
    expect(state.phases.map((p) => p.name)).toEqual([
      "Foundation",
      "Build",
      "Validate",
      "Launch",
      "Optimize",
    ]);
  });

  it("keeps source status separate from execution status", () => {
    for (const item of state.items) {
      expect(item.status).toBeTruthy();
      expect(item.execution).toBeTruthy();
      expect(item.status).not.toBe(item.execution);
    }
  });

  it("reports canonical source of truth", () => {
    expect(state.sync.sourceOfTruth).toBe("CANONICAL");
  });
});