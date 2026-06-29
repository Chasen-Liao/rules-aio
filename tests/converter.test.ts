import { describe, it, expect } from "vitest";
import { stripFrontmatter } from "../src/converter/util.js";

describe("stripFrontmatter", () => {
  it("removes a leading YAML frontmatter block", () => {
    const raw = "---\ndescription: x\n---\n# Title\nbody";
    expect(stripFrontmatter(raw)).toBe("# Title\nbody");
  });

  it("returns content unchanged when no frontmatter", () => {
    const raw = "# Title\nbody";
    expect(stripFrontmatter(raw)).toBe("# Title\nbody");
  });
});
