import { describe, it, expect } from "vitest";
import { stripFrontmatter } from "../src/converter/util.js";
import { claudeImportLine } from "../src/converter/claude.js";
import { toCodexChunk } from "../src/converter/codex.js";

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

describe("claudeImportLine", () => {
  it("produces an @import line", () => {
    expect(claudeImportLine("react")).toBe("@.claude/rules/react.md");
  });
});

describe("toCodexChunk", () => {
  it("produces a titled markdown chunk", () => {
    const content = "Use strict typing.";
    expect(toCodexChunk("TypeScript", content)).toBe("## TypeScript\n\nUse strict typing.\n");
  });
});
