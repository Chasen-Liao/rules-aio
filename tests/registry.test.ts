import { describe, it, expect } from "vitest";
import { allRules, matchRules } from "../src/registry/index.js";

describe("registry", () => {
  it("allRules returns a non-empty array", () => {
    expect(allRules().length).toBeGreaterThan(0);
  });

  it("matchRules returns react + typescript rules for a react project", () => {
    const matched = matchRules(["react", "typescript"]).map((r) => r.id);
    expect(matched).toContain("react");
    expect(matched).toContain("typescript");
  });

  it("matchRules is case-insensitive", () => {
    const matched = matchRules(["PYTHON"]).map((r) => r.id);
    expect(matched).toContain("python");
  });

  it("matchRules returns empty for unknown stack", () => {
    expect(matchRules(["cobol"])).toEqual([]);
  });
});
