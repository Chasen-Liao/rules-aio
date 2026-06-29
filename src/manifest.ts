import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import type { Agent } from "./registry/index.js";

const MANIFEST_FILE = ".rules-aio.json";

export interface Manifest {
  rules: string[];
  targets: Agent[];
}

export function manifestPath(rootDir: string): string {
  return path.join(rootDir, MANIFEST_FILE);
}

export async function readManifest(rootDir: string): Promise<Manifest | null> {
  try {
    const raw = await readFile(manifestPath(rootDir), "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return null;
  }
}

export async function writeManifest(rootDir: string, manifest: Manifest): Promise<void> {
  await writeFile(manifestPath(rootDir), JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

export async function removeManifest(rootDir: string): Promise<void> {
  await rm(manifestPath(rootDir), { force: true });
}
