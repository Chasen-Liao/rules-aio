import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { install } from "../src/installer.js";
import { uninstall } from "../src/uninstaller.js";
import { readManifest } from "../src/manifest.js";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "rules-aio-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("uninstall", () => {
  it("removes all installed files and clears managed sections", async () => {
    await writeFile(path.join(dir, "package.json"), JSON.stringify({ dependencies: { react: "^18" } }));
    await install(dir, { yes: true });

    await uninstall(dir);

    await expect(readFile(path.join(dir, ".cursor/rules/react.mdc"), "utf8")).rejects.toThrow();
    await expect(readFile(path.join(dir, ".claude/rules/react.md"), "utf8")).rejects.toThrow();
    const claude = await readFile(path.join(dir, "CLAUDE.md"), "utf8").catch(() => "");
    const agents = await readFile(path.join(dir, "AGENTS.md"), "utf8").catch(() => "");
    expect(claude).not.toContain("rules-aio:start");
    expect(agents).not.toContain("rules-aio:start");
    expect(await readManifest(dir)).toBeNull();
  });

  it("uninstalls only the cursor target when targets cursor given", async () => {
    await writeFile(path.join(dir, "package.json"), JSON.stringify({ dependencies: { react: "^18" } }));
    await install(dir, { yes: true });

    await uninstall(dir, { targets: ["cursor"] });

    await expect(readFile(path.join(dir, ".cursor/rules/react.mdc"), "utf8")).rejects.toThrow();
    expect(await readFile(path.join(dir, ".claude/rules/react.md"), "utf8")).toContain("# React");
    const m = await readManifest(dir);
    expect(m?.targets).toEqual(expect.arrayContaining(["claude", "codex"]));
    expect(m?.targets).not.toContain("cursor");
  });

  it("does nothing and prints when no manifest exists", async () => {
    await uninstall(dir);
    expect(await readManifest(dir)).toBeNull();
  });
});
