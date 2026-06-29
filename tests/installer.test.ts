import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeManagedSection } from "../src/installer.js";

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
