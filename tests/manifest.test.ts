import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, readFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeManifest, readManifest, removeManifest, type Manifest } from "../src/manifest.js";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "rules-aio-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("manifest", () => {
  it("writes and reads back the manifest", async () => {
    const m: Manifest = { rules: ["react", "typescript"], targets: ["claude", "codex", "cursor"] };
    await writeManifest(dir, m);
    const read = await readManifest(dir);
    expect(read).toEqual(m);
  });

  it("returns null when no manifest exists", async () => {
    expect(await readManifest(dir)).toBeNull();
  });

  it("removes the manifest file", async () => {
    await writeManifest(dir, { rules: ["react"], targets: ["cursor"] });
    await removeManifest(dir);
    await expect(access(path.join(dir, ".rules-aio.json"))).rejects.toThrow();
  });
});
