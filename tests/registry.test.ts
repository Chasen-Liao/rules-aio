import { describe, it, expect } from "vitest";
import { allRules, matchRules, readRuleContent } from "../src/registry/index.js";

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

describe("readRuleContent", () => {
  it("reads the cursor variant (with frontmatter)", async () => {
    const content = await readRuleContent("react", "cursor");
    expect(content.startsWith("---")).toBe(true);
  });

  it("reads the claude variant (frontmatter stripped)", async () => {
    const content = await readRuleContent("react", "claude");
    expect(content.startsWith("---")).toBe(false);
  });

  it("throws for unknown rule id", async () => {
    await expect(readRuleContent("nope", "claude")).rejects.toThrow();
  });
});
