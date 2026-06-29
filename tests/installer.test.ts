import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeManagedSection, install } from "../src/installer.js";

let dir: string;
let file: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "rules-aio-"));
  file = path.join(dir, "CLAUDE.md");
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("writeManagedSection", () => {
  it("creates the file with markers when absent", async () => {
    await writeManagedSection(file, "line A");
    const content = await readFile(file, "utf8");
    expect(content).toContain("<!-- rules-aio:start -->");
    expect(content).toContain("line A");
    expect(content).toContain("<!-- rules-aio:end -->");
  });

  it("appends section after existing content", async () => {
    await writeFile(file, "# Project\n\nexisting");
    await writeManagedSection(file, "line A");
    const content = await readFile(file, "utf8");
    expect(content.startsWith("# Project")).toBe(true);
    expect(content).toContain("line A");
  });

  it("replaces existing managed section idempotently", async () => {
    await writeManagedSection(file, "line A");
    await writeManagedSection(file, "line B");
    const content = await readFile(file, "utf8");
    expect(content).toContain("line B");
    expect(content).not.toContain("line A");
  });
});

describe("install", () => {
  it("in --yes mode, writes cursor/claude/codex files for a fake react project", async () => {
    await writeFile(path.join(dir, "package.json"), JSON.stringify({ dependencies: { react: "^18" } }));

    const fakeRaw = "---\ndescription: x\n---\n# React rules\nbe strict";
    const deps = {
      fetchRaw: async () => fakeRaw,
    };

    await install(dir, { yes: true }, deps);

    const cursorFile = await readFile(path.join(dir, ".cursor/rules/react.mdc"), "utf8");
    expect(cursorFile).toBe(fakeRaw);

    const claudeRule = await readFile(path.join(dir, ".claude/rules/react.md"), "utf8");
    expect(claudeRule).toBe("# React rules\nbe strict");

    const claudeMd = await readFile(path.join(dir, "CLAUDE.md"), "utf8");
    expect(claudeMd).toContain("@.claude/rules/react.md");

    const agentsMd = await readFile(path.join(dir, "AGENTS.md"), "utf8");
    expect(agentsMd).toContain("## React");
    expect(agentsMd).toContain("be strict");
  });
});
