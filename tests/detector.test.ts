import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { detectProject } from "../src/detector.js";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "rules-aio-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("detectProject", () => {
  it("detects react + typescript from package.json deps", async () => {
    await writeFile(
      path.join(dir, "package.json"),
      JSON.stringify({ dependencies: { react: "^18.0.0" }, devDependencies: { typescript: "^5.0.0" } })
    );
    const tags = await detectProject(dir);
    expect(tags).toEqual(expect.arrayContaining(["react", "typescript", "node"]));
  });

  it("detects fastapi + python from requirements.txt", async () => {
    await writeFile(path.join(dir, "requirements.txt"), "fastapi\nuvicorn\n");
    const tags = await detectProject(dir);
    expect(tags).toEqual(expect.arrayContaining(["python", "fastapi"]));
  });

  it("detects go from go.mod", async () => {
    await writeFile(path.join(dir, "go.mod"), "module example.com/foo\ngo 1.21\n");
    const tags = await detectProject(dir);
    expect(tags).toContain("go");
  });

  it("detects rust from Cargo.toml", async () => {
    await writeFile(path.join(dir, "Cargo.toml"), "[package]\nname = \"foo\"\n");
    const tags = await detectProject(dir);
    expect(tags).toContain("rust");
  });

  it("returns empty array when no manifests present", async () => {
    const tags = await detectProject(dir);
    expect(tags).toEqual([]);
  });
});
