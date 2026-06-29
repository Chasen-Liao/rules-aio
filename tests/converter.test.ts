import { describe, it, expect } from "vitest";
import { stripFrontmatter } from "../src/converter/util.js";
import { toCursor } from "../src/converter/cursor.js";
import { toClaudeFile, claudeImportLine } from "../src/converter/claude.js";
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

describe("toCursor", () => {
  it("writes raw content unchanged to .cursor/rules/<id>.mdc", () => {
    const raw = "---\ndescription: x\n---\nbody";
    const out = toCursor("react", raw);
    expect(out.path).toBe(".cursor/rules/react.mdc");
    expect(out.content).toBe(raw);
  });
});

describe("toClaudeFile", () => {
  it("strips frontmatter and writes to .claude/rules/<id>.md", () => {
    const raw = "---\ndescription: x\n---\n# React\nrules";
    const out = toClaudeFile("react", raw);
    expect(out.path).toBe(".claude/rules/react.md");
    expect(out.content).toBe("# React\nrules");
  });
});

describe("claudeImportLine", () => {
  it("produces an @import line", () => {
    expect(claudeImportLine("react")).toBe("@.claude/rules/react.md");
  });
});

describe("toCodexChunk", () => {
  it("produces a titled markdown chunk with frontmatter stripped", () => {
    const raw = "---\ndescription: x\n---\nUse strict typing.";
    expect(toCodexChunk("TypeScript", raw)).toBe("## TypeScript\n\nUse strict typing.\n");
  });
});
