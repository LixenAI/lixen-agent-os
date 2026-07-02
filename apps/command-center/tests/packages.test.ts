import { describe, expect, it } from "vitest";
import { PACKAGES, upgradeSentence } from "../lib/packages";

describe("package terminology (approved naming)", () => {
  it("uses approved customer-facing names", () => {
    expect(PACKAGES.starter.name).toBe("Local Automation Starter");
    expect(PACKAGES.plus.name).toBe("AI Growth System");
    expect(PACKAGES.starter.shortLabel).toBe("Starter");
    expect(PACKAGES.plus.shortLabel).toBe("Plus");
  });

  it("upgrade sentence uses approved names, never Smart/Pro", () => {
    const sentence = upgradeSentence("starter");
    expect(sentence).toBe(
      "Local Automation Starter is active; AI Growth System is what we turn on when upgrading.",
    );
    expect(sentence).not.toMatch(/\bSmart\b/);
    expect(sentence).not.toMatch(/\bPro\b/);
  });

  it("never exposes deprecated Smart/Pro labels", () => {
    const all = JSON.stringify(PACKAGES) + upgradeSentence("starter") + upgradeSentence("plus");
    expect(all).not.toMatch(/\bSmart\b/);
    expect(all).not.toMatch(/\bPro\b/);
  });
});