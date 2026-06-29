import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

let cached: string | undefined;

export function getVersion(): string {
  if (cached) return cached;
  try {
    const url = new URL("../package.json", import.meta.url);
    const pkg = JSON.parse(readFileSync(fileURLToPath(url), "utf8")) as { version?: string };
    cached = pkg.version ?? "0.0.0";
  } catch {
    cached = "0.0.0";
  }
  return cached;
}

export const VERSION = getVersion();
